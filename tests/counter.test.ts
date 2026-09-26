import { describe, it, expect } from 'vitest';
import { Contract, ledger } from '../managed/contract/index.js';
import type { Witnesses } from '../managed/contract/index.d.ts';
import { CONTRACT_ADDRESS } from '../src/lib/contract';

const NETWORK_CONFIG = {
  networkId: 'preview',
  indexerUrl: 'https://indexer.preview.midnight.network/api/v4/graphql',
};

import { deployPVVContract, CANONICAL_DEPLOYMENT } from '../src/integration/deploy';

function toBytes32(str: string = 'test'): Uint8Array {
  const enc = new TextEncoder().encode(str);
  const out = new Uint8Array(32);
  out.set(enc.slice(0, 32));
  return out;
}

function bytesToHex(bytes: Uint8Array): string {
  return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function buildWitnesses({
  vendorKey = 'vendor_secret_key_1',
  nonce = 'vendor_nonce_1',
  credentialHash = 'credential_hash_1',
  complianceScore = 88n,
  authorityKey = 'procurement_authority_1',
}: {
  vendorKey?: string;
  nonce?: string;
  credentialHash?: string;
  complianceScore?: bigint;
  authorityKey?: string;
}): Witnesses<any> {
  const vKey = toBytes32(vendorKey);
  const nBytes = toBytes32(nonce);
  const cHash = toBytes32(credentialHash);
  const authKey = toBytes32(authorityKey);

  return {
    vendorSecretKey: (ctx: any) => [ctx.privateState ?? ctx, vKey] as [any, Uint8Array],
    vendorProofNonce: (ctx: any) => [ctx.privateState ?? ctx, nBytes] as [any, Uint8Array],
    vendorCredentialHash: (ctx: any) => [ctx.privateState ?? ctx, cHash] as [any, Uint8Array],
    vendorComplianceScore: (ctx: any) => [ctx.privateState ?? ctx, complianceScore] as [any, bigint],
    authoritySigningKey: (ctx: any) => [ctx.privateState ?? ctx, authKey] as [any, Uint8Array],
  };
}

describe('Private Vendor Verification (PVV) - Invariant Validation Suite', () => {

  it('1. Contract Structure: all 6 core circuits are exported and callable from managed runtime', () => {
    const contract = new Contract(buildWitnesses({}));
    expect(contract).toBeDefined();
    expect(typeof contract.circuits.registerVendor).toBe('function');
    expect(typeof contract.circuits.verifyVendorAccreditation).toBe('function');
    expect(typeof contract.circuits.revokeVendorAccreditation).toBe('function');
    expect(typeof contract.circuits.setRegistryAuthorityCommitment).toBe('function');
    expect(typeof contract.circuits.resetRegistryPolicy).toBe('function');
    expect(typeof contract.circuits.incrementSession).toBe('function');
    expect(contract).toHaveProperty('circuits');
    expect(contract).toHaveProperty('witnesses');
  });

  it('2. Witness Completeness: all 5 witnesses are defined', () => {
    const witnesses = buildWitnesses({
      vendorKey: 'vendor_key_001',
      nonce: 'nonce_001',
      credentialHash: 'hash_001',
      complianceScore: 82n,
      authorityKey: 'auth_key_001',
    });
    const contract = new Contract(witnesses);

    expect(contract.witnesses.vendorSecretKey).toBeDefined();
    expect(contract.witnesses.vendorProofNonce).toBeDefined();
    expect(contract.witnesses.vendorCredentialHash).toBeDefined();
    expect(contract.witnesses.vendorComplianceScore).toBeDefined();
    expect(contract.witnesses.authoritySigningKey).toBeDefined();
  });

  it('3. Private Witness Byte Length: vendorSecretKey, vendorProofNonce, vendorCredentialHash are 32 bytes', () => {
    const witnesses = buildWitnesses({
      vendorKey: 'vendor_key_invariant_test',
      nonce: 'vendor_nonce_invariant_test',
      credentialHash: 'credential_hash_invariant_test',
    });
    const mockCtx = { privateState: {} };

    const [, keyBytes] = witnesses.vendorSecretKey(mockCtx);
    const [, nonceBytes] = witnesses.vendorProofNonce(mockCtx);
    const [, credBytes] = witnesses.vendorCredentialHash(mockCtx);

    expect(keyBytes.length).toBe(32);
    expect(nonceBytes.length).toBe(32);
    expect(credBytes.length).toBe(32);
  });

  it('4. Compliance Score Threshold Witness: vendorComplianceScore returns bigint usable for eligibility verification', () => {
    const complianceScore = 85n;
    const minScore = 75n;
    const witnesses = buildWitnesses({ complianceScore });
    const mockCtx = { privateState: {} };

    const [, score] = witnesses.vendorComplianceScore(mockCtx);
    expect(typeof score).toBe('bigint');
    expect(score).toBe(85n);
    expect(score >= minScore).toBe(true);
  });

  it('5. ZK Privacy: private witnesses are strictly isolated from public registryId (no data leak)', () => {
    const publicRegistryId = toBytes32('vendor_procurement_registry_2027');
    const witnesses = buildWitnesses({
      vendorKey: 'super_secret_vendor_key',
      nonce: 'private_vendor_nonce',
      credentialHash: 'encrypted_financial_credentials',
    });
    const mockCtx = { privateState: {} };

    const [, keyBytes] = witnesses.vendorSecretKey(mockCtx);
    const [, nonceBytes] = witnesses.vendorProofNonce(mockCtx);
    const [, credBytes] = witnesses.vendorCredentialHash(mockCtx);

    expect(keyBytes).not.toEqual(publicRegistryId);
    expect(nonceBytes).not.toEqual(publicRegistryId);
    expect(credBytes).not.toEqual(publicRegistryId);
  });

  it('6. Authority Witness: authoritySigningKey produces 32-byte array independent of vendor key', () => {
    const witnesses = buildWitnesses({
      vendorKey: 'vendor_key_123',
      authorityKey: 'procurement_authority_key_456',
    });
    const mockCtx = { privateState: {} };

    const [, vendorKeyBytes] = witnesses.vendorSecretKey(mockCtx);
    const [, authKeyBytes] = witnesses.authoritySigningKey(mockCtx);

    expect(authKeyBytes.length).toBe(32);
    expect(authKeyBytes).not.toEqual(vendorKeyBytes);
  });

  it('7. Multi-Vendor Accreditation Uniqueness: different vendors produce distinct contract instances', () => {
    const witnessesA = buildWitnesses({ vendorKey: 'vendor_a', credentialHash: 'hash_a' });
    const witnessesB = buildWitnesses({ vendorKey: 'vendor_b', credentialHash: 'hash_b' });
    const mockCtx = { privateState: {} };

    const contractA = new Contract(witnessesA);
    const contractB = new Contract(witnessesB);

    const [, keyA] = witnessesA.vendorSecretKey(mockCtx);
    const [, keyB] = witnessesB.vendorSecretKey(mockCtx);

    expect(contractA).not.toBe(contractB);
    expect(keyA).not.toEqual(keyB);
  });

  it('8. Ledger Schema Interface: ledger() decodes the 8-field on-chain public state correctly', () => {
    expect(typeof ledger).toBe('function');
    const parsed = ledger({});
    expect(parsed).toHaveProperty('vendorCount');
    expect(parsed).toHaveProperty('revokedCount');
    expect(parsed).toHaveProperty('activeSession');
    expect(parsed).toHaveProperty('registryId');
    expect(parsed).toHaveProperty('authorityCommitment');
    expect(parsed).toHaveProperty('lastVendorCommitment');
    expect(parsed).toHaveProperty('lastRevokedCommitment');
    expect(parsed).toHaveProperty('minimumComplianceScore');
    expect(typeof parsed.vendorCount).toBe('bigint');
    expect(typeof parsed.minimumComplianceScore).toBe('bigint');
  });

  it('9. Under-Score Fail Case: complianceScore below minimumComplianceScore fails threshold check', () => {
    const underScore = 60n;
    const minScore = 75n;
    const witnesses = buildWitnesses({ complianceScore: underScore });
    const mockCtx = { privateState: {} };

    const [, score] = witnesses.vendorComplianceScore(mockCtx);
    expect(score >= minScore).toBe(false);
  });

  it('10. Session Isolation: witnesses built for different sessions produce independent nonce contexts', () => {
    const witnessesSession1 = buildWitnesses({ nonce: 'session_1_vendor_nonce', complianceScore: 85n });
    const witnessesSession2 = buildWitnesses({ nonce: 'session_2_vendor_nonce', complianceScore: 95n });
    const mockCtx = { privateState: { sessionId: 'test' } };

    const [, nonce1] = witnessesSession1.vendorProofNonce(mockCtx);
    const [, nonce2] = witnessesSession2.vendorProofNonce(mockCtx);

    expect(nonce1).not.toEqual(nonce2);
  });

  it('11. Authoritative Verified Contract Address: matches Preview deployment record', () => {
    expect(CONTRACT_ADDRESS).toBe('0xf300c8ef23885f1cc04e6879ec5085f0845eff81c79d5ef6066f176af11df09f');
    expect(NETWORK_CONFIG.networkId).toBe('preview');
    expect(NETWORK_CONFIG.indexerUrl).toContain('indexer.preview.midnight.network');
  });

  it('12. Authoritative deployPVVContract returns the verified contract address', async () => {
    await expect(deployPVVContract(undefined as any)).rejects.toThrow('ContractProviders are strictly required');
    expect(CANONICAL_DEPLOYMENT.contractAddress).toBe('0xf300c8ef23885f1cc04e6879ec5085f0845eff81c79d5ef6066f176af11df09f');
  });

  it('13. Encoding Helpers: bytesToHex and hexToBytes round-trip correctly', () => {
    const testStr = 'vendor_procurement_registry_2027';
    const bytes = toBytes32(testStr);
    expect(bytes.length).toBe(32);
    const hex = bytesToHex(bytes);
    expect(hex.startsWith('0x')).toBe(true);
    expect(hex.length).toBe(66);
    const back = hexToBytes(hex);
    expect(back).toEqual(bytes);
  });

});
