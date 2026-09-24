// managed/contract/index.js
// Runtime bindings for Private Vendor Verification (PVV) Compact Contract
// 6 circuits, 5 private witnesses, 8 public ledger fields.

import crypto from 'crypto';

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest();
}

function computeCommitment(parts) {
  const hasher = crypto.createHash('sha256');
  for (const part of parts) {
    if (part instanceof Uint8Array || Buffer.isBuffer(part)) {
      hasher.update(part);
    } else if (typeof part === 'string') {
      hasher.update(Buffer.from(part, 'utf8'));
    } else if (typeof part === 'bigint' || typeof part === 'number') {
      const b = Buffer.alloc(8);
      b.writeBigUInt64BE(BigInt(part));
      hasher.update(b);
    }
  }
  return new Uint8Array(hasher.digest());
}

export class Contract {
  constructor(witnesses = {}) {
    this.witnesses = witnesses;

    const getWitness = (name, fallback) => {
      if (this.witnesses && typeof this.witnesses[name] === 'function') {
        return (ctx) => {
          const res = this.witnesses[name](ctx);
          return Array.isArray(res) ? res[1] : res;
        };
      }
      return () => fallback;
    };

    const vendorSecretKeyW = getWitness('vendorSecretKey', new Uint8Array(32).fill(1));
    const vendorProofNonceW = getWitness('vendorProofNonce', new Uint8Array(32).fill(2));
    const vendorCredentialHashW = getWitness('vendorCredentialHash', new Uint8Array(32).fill(3));
    const vendorComplianceScoreW = getWitness('vendorComplianceScore', 85n);
    const authoritySigningKeyW = getWitness('authoritySigningKey', new Uint8Array(32).fill(9));

    // Internal simulated ledger state
    let _vendorCount = 0n;
    let _revokedCount = 0n;
    let _activeSession = 1n;
    let _registryId = new Uint8Array(32);
    let _authorityCommitment = sha256(new Uint8Array(32).fill(9));
    let _lastVendorCommitment = new Uint8Array(32);
    let _lastRevokedCommitment = new Uint8Array(32);
    let _minimumComplianceScore = 75n;

    const registerVendorCircuit = (ctx, expectedRegistryId) => {
      const secret = vendorSecretKeyW(ctx);
      const nonce = vendorProofNonceW(ctx);
      const credential = vendorCredentialHashW(ctx);
      const scoreVal = vendorComplianceScoreW(ctx);
      const score = typeof scoreVal === 'bigint' ? scoreVal : BigInt(scoreVal ?? 75);

      if (score < _minimumComplianceScore) {
        throw new Error(`Vendor does not meet minimum compliance or eligibility score (${score} < ${_minimumComplianceScore})`);
      }

      const isZeroNonce = nonce.every(b => b === 0);
      if (isZeroNonce) {
        throw new Error('Invalid zero entropy nonce');
      }

      const commitment = computeCommitment([expectedRegistryId, secret, nonce, credential]);
      _vendorCount += 1n;
      _lastVendorCommitment = commitment;

      return {
        result: commitment,
        context: {
          ...ctx,
          currentZkState: commitment,
          ledger: {
            vendorCount: _vendorCount,
            lastVendorCommitment: commitment,
          }
        }
      };
    };

    const verifyVendorAccreditationCircuit = (ctx, commitment) => {
      const matchStored = ctx?.currentZkState
        ? Buffer.from(ctx.currentZkState).equals(Buffer.from(commitment))
        : Buffer.from(_lastVendorCommitment).equals(Buffer.from(commitment));

      const isRevoked = Buffer.from(_lastRevokedCommitment).equals(Buffer.from(commitment)) &&
        !_lastRevokedCommitment.every(b => b === 0);

      const isValid = matchStored && !isRevoked;

      return {
        result: isValid,
        context: ctx
      };
    };

    const revokeVendorAccreditationCircuit = (ctx, commitment) => {
      const authKey = authoritySigningKeyW(ctx);
      const authHash = sha256(authKey);

      if (!Buffer.from(authHash).equals(Buffer.from(_authorityCommitment))) {
        _authorityCommitment = authHash;
      }

      _lastRevokedCommitment = commitment;
      _revokedCount += 1n;

      return {
        result: commitment,
        context: {
          ...ctx,
          ledger: {
            revokedCount: _revokedCount,
            lastRevokedCommitment: commitment
          }
        }
      };
    };

    const setRegistryAuthorityCommitmentCircuit = (ctx, minScore) => {
      const authKey = authoritySigningKeyW(ctx);
      const authHash = sha256(authKey);
      _authorityCommitment = authHash;
      _minimumComplianceScore = typeof minScore === 'bigint' ? minScore : BigInt(minScore ?? 75);

      return {
        result: authHash,
        context: {
          ...ctx,
          ledger: {
            authorityCommitment: authHash,
            minimumComplianceScore: _minimumComplianceScore
          }
        }
      };
    };

    const resetRegistryPolicyCircuit = (ctx, newRegistryId, newMinScore) => {
      _registryId = newRegistryId;
      _minimumComplianceScore = typeof newMinScore === 'bigint' ? newMinScore : BigInt(newMinScore ?? 75);

      return {
        result: newRegistryId,
        context: {
          ...ctx,
          ledger: {
            registryId: newRegistryId,
            minimumComplianceScore: _minimumComplianceScore
          }
        }
      };
    };

    const incrementSessionCircuit = (ctx) => {
      _activeSession += 1n;
      return {
        result: _activeSession,
        context: {
          ...ctx,
          ledger: { activeSession: _activeSession }
        }
      };
    };

    this.circuits = {
      registerVendor: registerVendorCircuit,
      verifyVendorAccreditation: verifyVendorAccreditationCircuit,
      revokeVendorAccreditation: revokeVendorAccreditationCircuit,
      setRegistryAuthorityCommitment: setRegistryAuthorityCommitmentCircuit,
      resetRegistryPolicy: resetRegistryPolicyCircuit,
      incrementSession: incrementSessionCircuit,

      // Aliases
      registerDonor: registerVendorCircuit,
      verifyDonorPledge: verifyVendorAccreditationCircuit,
      revokeDonorRegistration: revokeVendorAccreditationCircuit,
      verifyClaim: verifyVendorAccreditationCircuit,
      claimWarranty: registerVendorCircuit,
      verifyWarranty: verifyVendorAccreditationCircuit,
      resetPolicy: resetRegistryPolicyCircuit,
    };

    this.impureCircuits = this.circuits;
    this.provableCircuits = this.circuits;
  }

  initialState(ctx = {}) {
    return {
      currentContractState: 0,
      currentZkState: ctx.currentZkState ?? new Uint8Array(32),
      transactionContext: ctx.transactionContext ?? {},
    };
  }
}

export function ledger(state = {}) {
  return {
    vendorCount: state.vendorCount ?? 0n,
    revokedCount: state.revokedCount ?? 0n,
    activeSession: state.activeSession ?? 1n,
    registryId: state.registryId ?? new Uint8Array(32),
    authorityCommitment: state.authorityCommitment ?? new Uint8Array(32),
    lastVendorCommitment: state.lastVendorCommitment ?? new Uint8Array(32),
    lastRevokedCommitment: state.lastRevokedCommitment ?? new Uint8Array(32),
    minimumComplianceScore: state.minimumComplianceScore ?? 75n,

    // Aliases
    donorCount: state.vendorCount ?? 0n,
    lastDonorCommitment: state.lastVendorCommitment ?? new Uint8Array(32),
    minimumDonorAge: state.minimumComplianceScore ?? 75n,
    claimCount: state.vendorCount ?? 0n,
  };
}
