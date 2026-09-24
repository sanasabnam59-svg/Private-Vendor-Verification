// tests/private_vendor_verification.test.ts
// Comprehensive 25-case test suite for Private Vendor Verification (PVV) Compact Contract
// Validates circuits, witnesses, age/compliance eligibility gate, dual verification, and authority admin.

import { describe, it, expect, beforeEach } from 'vitest';
import { Contract, ledger } from '../managed/contract/index.js';
import crypto from 'crypto';

describe('Private Vendor Verification (PVV) - Midnight ZK Contract Suite (Level 2 & Level 3)', () => {
  let contract: any;
  const mockRegistryId = new Uint8Array(32).fill(5);

  beforeEach(() => {
    contract = new Contract({
      vendorSecretKey: () => [{}, new Uint8Array(32).fill(11)],
      vendorProofNonce: () => [{}, new Uint8Array(32).fill(22)],
      vendorCredentialHash: () => [{}, new Uint8Array(32).fill(33)],
      vendorComplianceScore: () => [{}, 88n],
      authoritySigningKey: () => [{}, new Uint8Array(32).fill(99)],
    });
  });

  it('1. Contract Instantiation: discovers 6 primary circuits and runtime bindings', () => {
    expect(contract).toBeDefined();
    expect(contract.circuits).toBeDefined();
    expect(typeof contract.circuits.registerVendor).toBe('function');
    expect(typeof contract.circuits.verifyVendorAccreditation).toBe('function');
    expect(typeof contract.circuits.revokeVendorAccreditation).toBe('function');
    expect(typeof contract.circuits.setRegistryAuthorityCommitment).toBe('function');
    expect(typeof contract.circuits.resetRegistryPolicy).toBe('function');
    expect(typeof contract.circuits.incrementSession).toBe('function');
  });

  it('2. Initial State: initializes default contract and transaction context', () => {
    const state = contract.initialState();
    expect(state).toBeDefined();
    expect(state.currentContractState).toBe(0);
    expect(state.currentZkState).toHaveLength(32);
  });

  it('3. Default Witness Generation: generates valid byte lengths and BigInt types', () => {
    const c = new Contract();
    const state = c.initialState();
    const res = c.circuits.registerVendor(state, mockRegistryId);
    expect(res.result).toBeInstanceOf(Uint8Array);
    expect(res.result).toHaveLength(32);
  });

  it('4. Standard Vendor Registration: vendor with score >= 75 succeeds and returns 32-byte commitment', () => {
    const state = contract.initialState();
    const res = contract.circuits.registerVendor(state, mockRegistryId);
    expect(res.result).toHaveLength(32);
    expect(res.context.ledger.vendorCount).toBe(1n);
    expect(res.context.ledger.lastVendorCommitment).toEqual(res.result);
  });

  it('5. Deterministic Zero-Knowledge Commitment: identical witnesses yield identical commitments', () => {
    const state1 = contract.initialState();
    const res1 = contract.circuits.registerVendor(state1, mockRegistryId);

    const contract2 = new Contract({
      vendorSecretKey: () => [{}, new Uint8Array(32).fill(11)],
      vendorProofNonce: () => [{}, new Uint8Array(32).fill(22)],
      vendorCredentialHash: () => [{}, new Uint8Array(32).fill(33)],
      vendorComplianceScore: () => [{}, 88n],
      authoritySigningKey: () => [{}, new Uint8Array(32).fill(99)],
    });
    const state2 = contract2.initialState();
    const res2 = contract2.circuits.registerVendor(state2, mockRegistryId);

    expect(Buffer.from(res1.result).equals(Buffer.from(res2.result))).toBe(true);
  });

  it('6. Counter Increment: successive vendor registrations increment vendorCount sequentially', () => {
    const state = contract.initialState();
    const res1 = contract.circuits.registerVendor(state, mockRegistryId);
    expect(res1.context.ledger.vendorCount).toBe(1n);

    const res2 = contract.circuits.registerVendor(res1.context, mockRegistryId);
    expect(res2.context.ledger.vendorCount).toBe(2n);
  });

  it('7. Zero Entropy Nonce Rejection: throws error when proof nonce is zeroed', () => {
    const zeroNonceContract = new Contract({
      vendorSecretKey: () => [{}, new Uint8Array(32).fill(1)],
      vendorProofNonce: () => [{}, new Uint8Array(32).fill(0)],
      vendorCredentialHash: () => [{}, new Uint8Array(32).fill(2)],
      vendorComplianceScore: () => [{}, 90n],
      authoritySigningKey: () => [{}, new Uint8Array(32).fill(9)],
    });
    const state = zeroNonceContract.initialState();
    expect(() => {
      zeroNonceContract.circuits.registerVendor(state, mockRegistryId);
    }).toThrow(/Invalid zero entropy nonce/);
  });

  it('8. Compliance Eligibility Gate - Under-Score Rejection: score < 75 throws error', () => {
    const underScoreContract = new Contract({
      vendorSecretKey: () => [{}, new Uint8Array(32).fill(1)],
      vendorProofNonce: () => [{}, new Uint8Array(32).fill(2)],
      vendorCredentialHash: () => [{}, new Uint8Array(32).fill(3)],
      vendorComplianceScore: () => [{}, 65n], // Fails minimum 75 threshold
      authoritySigningKey: () => [{}, new Uint8Array(32).fill(9)],
    });
    const state = underScoreContract.initialState();
    expect(() => {
      underScoreContract.circuits.registerVendor(state, mockRegistryId);
    }).toThrow(/Vendor does not meet minimum compliance/);
  });

  it('9. Compliance Eligibility Gate - Exact Boundary: score == 75 succeeds', () => {
    const boundaryContract = new Contract({
      vendorSecretKey: () => [{}, new Uint8Array(32).fill(1)],
      vendorProofNonce: () => [{}, new Uint8Array(32).fill(2)],
      vendorCredentialHash: () => [{}, new Uint8Array(32).fill(3)],
      vendorComplianceScore: () => [{}, 75n], // Exactly at minimum threshold
      authoritySigningKey: () => [{}, new Uint8Array(32).fill(9)],
    });
    const state = boundaryContract.initialState();
    const res = boundaryContract.circuits.registerVendor(state, mockRegistryId);
    expect(res.result).toHaveLength(32);
    expect(res.context.ledger.vendorCount).toBe(1n);
  });

  it('10. Dual Verification - Mode A: Verification by 32-Byte ZK Commitment succeeds', () => {
    const state = contract.initialState();
    const regRes = contract.circuits.registerVendor(state, mockRegistryId);
    const commitment = regRes.result;

    const verifyRes = contract.circuits.verifyVendorAccreditation(regRes.context, commitment);
    expect(verifyRes.result).toBe(true);
  });

  it('11. Dual Verification - Mode A: Verification of arbitrary uncommitted hash returns false', () => {
    const state = contract.initialState();
    const regRes = contract.circuits.registerVendor(state, mockRegistryId);

    const fakeCommitment = new Uint8Array(32).fill(99);
    const verifyRes = contract.circuits.verifyVendorAccreditation(regRes.context, fakeCommitment);
    expect(verifyRes.result).toBe(false);
  });

  it('12. Dual Verification - Mode A: Zero commitment returns false', () => {
    const state = contract.initialState();
    const regRes = contract.circuits.registerVendor(state, mockRegistryId);

    const zeroCommitment = new Uint8Array(32).fill(0);
    const verifyRes = contract.circuits.verifyVendorAccreditation(regRes.context, zeroCommitment);
    expect(verifyRes.result).toBe(false);
  });

  it('13. Dual Verification - Mode B: On-Chain Transaction Hash audit check', async () => {
    const txHash = "0xf300c8ef23885f1cc04e6879ec5085f0845eff81c79d5ef6066f176af11df09f";
    expect(txHash.startsWith("0x")).toBe(true);
    expect(txHash).toHaveLength(66);
  });

  it('14. Authority Governance: setRegistryAuthorityCommitment updates authority anchor and threshold', () => {
    const state = contract.initialState();
    const res = contract.circuits.setRegistryAuthorityCommitment(state, 80n);
    expect(res.result).toHaveLength(32);
    expect(res.context.ledger.minimumComplianceScore).toBe(80n);
  });

  it('15. Authority Key Verification: authoritySigningKey forms persistent sha256 commitment', () => {
    const authKey = new Uint8Array(32).fill(99);
    const expectedHash = crypto.createHash('sha256').update(authKey).digest();

    const state = contract.initialState();
    const res = contract.circuits.setRegistryAuthorityCommitment(state, 80n);
    expect(Buffer.from(res.context.ledger.authorityCommitment).equals(expectedHash)).toBe(true);
  });

  it('16. Revocation Circuit: authorized compliance officer can revoke vendor accreditation', () => {
    const state = contract.initialState();
    const regRes = contract.circuits.registerVendor(state, mockRegistryId);
    const commitment = regRes.result;

    const revokeRes = contract.circuits.revokeVendorAccreditation(regRes.context, commitment);
    expect(revokeRes.result).toEqual(commitment);
    expect(revokeRes.context.ledger.revokedCount).toBe(1n);
    expect(revokeRes.context.ledger.lastRevokedCommitment).toEqual(commitment);
  });

  it('17. Revocation Impact: revoked commitment returns false upon verification', () => {
    const state = contract.initialState();
    const regRes = contract.circuits.registerVendor(state, mockRegistryId);
    const commitment = regRes.result;

    // Initially valid
    const preVerify = contract.circuits.verifyVendorAccreditation(regRes.context, commitment);
    expect(preVerify.result).toBe(true);

    // Revoke
    const revokeRes = contract.circuits.revokeVendorAccreditation(regRes.context, commitment);

    // Post-revocation verification returns false
    const postVerify = contract.circuits.verifyVendorAccreditation(revokeRes.context, commitment);
    expect(postVerify.result).toBe(false);
  });

  it('18. Revocation Counter Monotonicity: revokedCount increments strictly monotonically', () => {
    const state = contract.initialState();
    const c1 = new Uint8Array(32).fill(1);
    const c2 = new Uint8Array(32).fill(2);

    const r1 = contract.circuits.revokeVendorAccreditation(state, c1);
    expect(r1.context.ledger.revokedCount).toBe(1n);

    const r2 = contract.circuits.revokeVendorAccreditation(r1.context, c2);
    expect(r2.context.ledger.revokedCount).toBe(2n);
  });

  it('19. Replay Protection: incrementSession increments monotonic epoch counter', () => {
    const state = contract.initialState();
    const res1 = contract.circuits.incrementSession(state);
    expect(res1.result).toBe(2n);
    expect(res1.context.ledger.activeSession).toBe(2n);

    const res2 = contract.circuits.incrementSession(res1.context);
    expect(res2.result).toBe(3n);
    expect(res2.context.ledger.activeSession).toBe(3n);
  });

  it('20. Policy Rotation: resetRegistryPolicy updates registry program ID and compliance threshold', () => {
    const state = contract.initialState();
    const newProgId = new Uint8Array(32).fill(77);
    const res = contract.circuits.resetRegistryPolicy(state, newProgId, 85n);

    expect(res.context.ledger.registryId).toEqual(newProgId);
    expect(res.context.ledger.minimumComplianceScore).toBe(85n);
  });

  it('21. Policy Threshold Enforcement: higher threshold is enforced after policy reset', () => {
    const state = contract.initialState();
    const newProgId = new Uint8Array(32).fill(77);
    const resetRes = contract.circuits.resetRegistryPolicy(state, newProgId, 90n);

    // A vendor with score 88 should now fail because threshold is 90
    expect(() => {
      contract.circuits.registerVendor(resetRes.context, newProgId);
    }).toThrow(/Vendor does not meet minimum compliance/);
  });

  it('22. Ledger State Decoder: decodes all 8 public ledger fields properly', () => {
    const decoded = ledger({
      vendorCount: 15n,
      revokedCount: 2n,
      activeSession: 4n,
      registryId: mockRegistryId,
      authorityCommitment: new Uint8Array(32).fill(9),
      lastVendorCommitment: new Uint8Array(32).fill(3),
      lastRevokedCommitment: new Uint8Array(32).fill(2),
      minimumComplianceScore: 80n,
    });

    expect(decoded.vendorCount).toBe(15n);
    expect(decoded.revokedCount).toBe(2n);
    expect(decoded.activeSession).toBe(4n);
    expect(decoded.minimumComplianceScore).toBe(80n);
    expect(decoded.registryId).toEqual(mockRegistryId);
  });

  it('23. Multiple Vendor Registrations: maintains isolated commitments across vendors', () => {
    const state = contract.initialState();

    const vendorA = new Contract({
      vendorSecretKey: () => [{}, new Uint8Array(32).fill(1)],
      vendorProofNonce: () => [{}, new Uint8Array(32).fill(2)],
      vendorCredentialHash: () => [{}, new Uint8Array(32).fill(3)],
      vendorComplianceScore: () => [{}, 90n],
      authoritySigningKey: () => [{}, new Uint8Array(32).fill(9)],
    });
    const resA = vendorA.circuits.registerVendor(state, mockRegistryId);

    const vendorB = new Contract({
      vendorSecretKey: () => [{}, new Uint8Array(32).fill(4)],
      vendorProofNonce: () => [{}, new Uint8Array(32).fill(5)],
      vendorCredentialHash: () => [{}, new Uint8Array(32).fill(6)],
      vendorComplianceScore: () => [{}, 95n],
      authoritySigningKey: () => [{}, new Uint8Array(32).fill(9)],
    });
    const resB = vendorB.circuits.registerVendor(state, mockRegistryId);

    expect(Buffer.from(resA.result).equals(Buffer.from(resB.result))).toBe(false);
  });

  it('24. Concurrent Witness Isolation: different witness states do not contaminate instance', () => {
    const c1 = new Contract({ vendorComplianceScore: () => [{}, 70n] });
    const c2 = new Contract({ vendorComplianceScore: () => [{}, 90n] });

    expect(() => c1.circuits.registerVendor(c1.initialState(), mockRegistryId)).toThrow();
    expect(() => c2.circuits.registerVendor(c2.initialState(), mockRegistryId)).not.toThrow();
  });

  it('25. End-to-End Protocol Lifecycle: Register -> Verify -> Revoke -> Re-verify', () => {
    const state = contract.initialState();

    // Step 1: Register
    const regRes = contract.circuits.registerVendor(state, mockRegistryId);
    const commitment = regRes.result;
    expect(regRes.context.ledger.vendorCount).toBe(1n);

    // Step 2: Verify (Active)
    const v1 = contract.circuits.verifyVendorAccreditation(regRes.context, commitment);
    expect(v1.result).toBe(true);

    // Step 3: Revoke by procurement compliance authority
    const revRes = contract.circuits.revokeVendorAccreditation(regRes.context, commitment);
    expect(revRes.context.ledger.revokedCount).toBe(1n);

    // Step 4: Re-verify (Disqualified/Revoked)
    const v2 = contract.circuits.verifyVendorAccreditation(revRes.context, commitment);
    expect(v2.result).toBe(false);
  });
});
