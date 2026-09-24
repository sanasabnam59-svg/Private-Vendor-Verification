import type { Contract as CompactContract, Witnesses as CompactWitnesses } from '@midnight-ntwrk/compact-runtime';

export type Witnesses<T = unknown> = {
  vendorSecretKey: (context: T) => [T, Uint8Array];
  vendorProofNonce: (context: T) => [T, Uint8Array];
  vendorCredentialHash: (context: T) => [T, Uint8Array];
  vendorComplianceScore: (context: T) => [T, bigint | number];
  authoritySigningKey: (context: T) => [T, Uint8Array];
};

export type ImpureCircuits<T = unknown> = {
  registerVendor: (context: T, expectedRegistryId: Uint8Array) => { result: Uint8Array; context: T };
  verifyVendorAccreditation: (context: T, commitment: Uint8Array) => { result: boolean; context: T };
  revokeVendorAccreditation: (context: T, commitment: Uint8Array) => { result: Uint8Array; context: T };
  setRegistryAuthorityCommitment: (context: T, minScore: bigint | number) => { result: Uint8Array; context: T };
  resetRegistryPolicy: (context: T, newRegistryId: Uint8Array, newMinScore: bigint | number) => { result: Uint8Array; context: T };
  incrementSession: (context: T) => { result: bigint; context: T };
};

export type PureCircuits = Record<string, never>;

export type Ledger = {
  vendorCount: bigint;
  revokedCount: bigint;
  activeSession: bigint;
  registryId: Uint8Array;
  authorityCommitment: Uint8Array;
  lastVendorCommitment: Uint8Array;
  lastRevokedCommitment: Uint8Array;
  minimumComplianceScore: bigint;
};

export type ContractState = {
  data: Uint8Array;
};

export declare class Contract<T = unknown> implements CompactContract<T> {
  witnesses: Witnesses<T>;
  circuits: ImpureCircuits<T>;
  impureCircuits: ImpureCircuits<T>;
  provableCircuits: ImpureCircuits<T>;
  constructor(witnesses: Partial<Witnesses<T>>);
  initialState(context?: T): {
    currentContractState: number;
    currentZkState: Uint8Array;
    transactionContext: unknown;
  };
}

export declare function ledger(state: unknown): Ledger;
export default Contract;
