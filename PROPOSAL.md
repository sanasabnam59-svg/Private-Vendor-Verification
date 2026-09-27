# Project Proposal: Private Vendor Verification (PVV)
> **Privacy-Preserving Zero-Knowledge Supplier Due Diligence & Eligibility Protocol on the Midnight Network**

---

## 📺 Live Demo Video & Production dApp

| Resource | Direct Link |
| :--- | :--- |
| **YouTube Walkthrough** | [![YouTube](https://img.shields.io/badge/YouTube-Watch%20Demo-FF0000?style=for-the-badge&logo=youtube)](https://youtu.be/4eYF2BHCH9A) [https://youtu.be/4eYF2BHCH9A](https://youtu.be/4eYF2BHCH9A) |
| **Live Production dApp** | [![Vercel](https://img.shields.io/badge/Vercel-Live%20Application-000000?style=for-the-badge&logo=vercel)](https://private-vendor-verification.vercel.app/) [https://private-vendor-verification.vercel.app/](https://private-vendor-verification.vercel.app/) |
| **Midnight Explorer** | [![Midnight](https://img.shields.io/badge/Midnight-Contract%20Explorer-0284c7?style=for-the-badge)](https://preview.midnightexplorer.com/contracts/0xf300c8ef23885f1cc04e6879ec5085f0845eff81c79d5ef6066f176af11df09f) `0xf300c8ef23885f1cc04e6879ec5085f0845eff81c79d5ef6066f176af11df09f` |
| **GitHub Repository** | [https://github.com/sanasabnam59-svg/Private-Vendor-Verification](https://github.com/sanasabnam59-svg/Private-Vendor-Verification) |

---

## 🎯 Selected Problem from Track List
- **Idea Category**: **Age / Eligibility Gate & Confidential Credentials**
- **Application Domain**: **Private Vendor Verification & Enterprise Supply Chain Due Diligence**
- **Core Zero-Knowledge Principle**: Prove mathematical qualification (`vendorComplianceScore() >= minimumComplianceScore`, e.g., 75/100) and regulatory credential authenticity without revealing proprietary balance sheets, tax returns, solvency figures, or confidential audit ratings on a public ledger.

---

## ❓ Question 1: What is the application?

**Private Vendor Verification (PVV)** is an enterprise decentralized zero-knowledge compliance and due diligence protocol engineered on the **Midnight Network**.

Built using Compact v0.23 smart contracts and the official **Midnight.js SDK** (`@midnight-ntwrk/dapp-connector-api`, `@midnight-ntwrk/midnight-js-network-id`, `@midnight-ntwrk/compact-runtime`, `@midnight-ntwrk/midnight-js-contracts`), PVV enables suppliers, contractors, and vendors to mathematically prove qualification thresholds to enterprise procurement teams without disclosing their confidential business documentation.

### Key Capabilities:
1. **Zero-Knowledge Accreditation Pledges**: Vendors evaluate private witnesses (compliance score, credential hash, single-use salt) entirely client-side. The ZK circuit validates that `score >= 75` and commits a 32-byte cryptographic root hash to the Midnight ledger.
2. **Interactive 1AM Wallet Verification**: Full integration with the privacy-first **1AM Wallet** (Midnight DApp Connector v4) with deep browser extension discovery. Every on-chain transaction requires explicit user review and signature authorization via `signData` before emission.
3. **Dual Verification Engine**: Procurement officers and auditors can verify vendor accreditation validity using either:
   - A **32-Byte ZK Commitment Hash**, or
   - An **On-Chain Transaction Hash / Contract Address**.
4. **Procurement Authority Governance Console**: Authorized coordinators update threshold score requirements (`setRegistryAuthorityCommitment`), manage anti-replay session nonces (`incrementSession`), and revoke non-compliant vendors (`revokeVendorAccreditation`) via authorized zero-knowledge circuits.
5. **Modern 3D Paper Minimalist UI**: Featuring an interactive Three.js 3D WebGL paper sculpture with mouse parallax, curled corner stat cards, matte obsidian pill buttons, and responsive layouts.

---

## ❓ Question 2: What problem does it solve?

Traditional corporate procurement and vendor onboarding create severe operational and privacy vulnerabilities:

| Traditional Onboarding Vulnerability | How Private Vendor Verification (PVV) Solves It |
| :--- | :--- |
| **Corporate Espionage & Margin Leakage**: Disclosing unencrypted balance sheets or audit ratings allows competitors or intermediaries to deduce margins, cost structures, and trade secrets. | **Zero Witness Leakage**: Sensitive metrics remain strictly inside the vendor's browser memory. The circuit asserts `score >= threshold` without disclosing the true score. |
| **Centralized Data Breach Targets**: Centralized vendor portals aggregate thousands of corporate tax IDs, bank accounts, and security audit reports, creating lucrative targets for ransomware. | **Cryptographic Root Commitments**: The Midnight ledger records only a 32-byte cryptographic commitment hash. Zero raw tax documents or financial statements are ever stored on-chain. |
| **Cross-Contract Tracking & Profiling**: Observers can link vendor bids across independent procurement events to profile corporate strategy. | **Private Proof Nonce**: A 32-byte random entropy nonce (`vendorProofNonce`) generates an unlinkable commitment per claim, preventing correlation across independent contracts. |
| **Slow Manual Audit Bottlenecks**: Procurement departments spend weeks manually reviewing sensitive PDF filings, slowing project start dates. | **Instant On-Chain Verifiability**: Automated ZK-SNARK proof verification confirms vendor qualification in seconds on the Midnight Network Preview testnet. |

---

## ❓ Question 3: How is Midnight used?

### 1. Compact Smart Contract Architecture (`contracts/private_vendor_verification.compact`)
The contract is compiled with `compactc 0.31.1` targeting Compact v0.23:

#### 6 Compact Zero-Knowledge Circuits:
1. **`registerVendor(expectedRegistryId: Bytes<32>): Bytes<32>`**:
   - Asserts that the vendor's private compliance score meets or exceeds the public threshold (`vendorComplianceScore() >= minimumComplianceScore`).
   - Asserts that the private credential digest matches the claimed business documents.
   - Computes and anchors the 32-byte vendor commitment root on-chain.
   - Increments the public `vendorCount` monotonic counter.
2. **`verifyVendorAccreditation(commitment: Bytes<32>): Boolean`**:
   - Publicly verifies whether a given commitment root exists and is currently valid on the Midnight ledger.
3. **`revokeVendorAccreditation(commitment: Bytes<32>): []`**:
   - Disqualifies a non-compliant vendor by recording the commitment in `lastRevokedCommitment` and incrementing `revokedCount`.
   - Requires proof of the authorized `authoritySigningKey` witness.
4. **`setRegistryAuthorityCommitment(minScore: Uint<32>): []`**:
   - Updates the procurement compliance threshold and anchors the coordinator authority commitment.
5. **`resetRegistryPolicy(newRegistryId: Bytes<32>, newMinScore: Uint<32>): []`**:
   - Rotates the registry identifier and adjusts baseline score guidelines.
6. **`incrementSession(): []`**:
   - Advances the public monotonic session epoch counter (`activeSession`) to enforce replay protection across claim submission windows.

#### 5 Private Witnesses (Client-Side Isolation):
- `vendorSecretKey(): Bytes<32>`: Private vendor identity key.
- `vendorProofNonce(): Bytes<32>`: Cryptographic salt preventing cross-claim linkage.
- `vendorCredentialHash(): Bytes<32>`: Standard SHA-256 digest of audited credentials.
- `vendorComplianceScore(): Uint<32>`: True numerical audit score (never emitted on-chain).
- `authoritySigningKey(): Bytes<32>`: Master signing key of the procurement authority.

#### 8 Public Ledger Fields:
- `vendorCount: Counter`: Total active accredited vendors.
- `revokedCount: Counter`: Total revoked vendor accreditations.
- `activeSession: Counter`: Monotonic session nonce for replay resistance.
- `registryId: Bytes<32>`: Unique registry authority identifier.
- `authorityCommitment: Bytes<32>`: Root commitment of the governing auditor.
- `lastVendorCommitment: Bytes<32>`: Most recent vendor accreditation commitment.
- `lastRevokedCommitment: Bytes<32>`: Most recent revoked vendor commitment.
- `minimumComplianceScore: Uint<32>`: Current qualification threshold (default: 75/100).

---

### 2. 1AM Wallet & Midnight DApp Connector Integration
PVV implements strict, verified wallet interactions using `@midnight-ntwrk/dapp-connector-api` v4:
- **No Mock / Silent Auto-Connect**: The application detects the real **1AM Wallet** extension in the browser (`window.midnight.oneam`, `window.midnight["1am"]`, and dynamic RDNS matching). Clicking connect opens the **1AM Wallet popup** for user authorization.
- **Transaction Signature Verification**: Every circuit submission (vendor registration, threshold update, revocation) constructs a structured transaction envelope and invokes `walletApi.signData(payload, { encoding: 'text', keyType: 'unshielded' })`.
- **Explicit User Acceptance**: A transaction only proceeds to the Midnight Preview testnet once the user explicitly clicks **Accept** in their 1AM Wallet extension window. If rejected, the operation safely aborts.

---

### 3. Selective Disclosure Privacy Model

| Information Asset | What an Observer CAN Learn (Public Ledger) | What an Observer CANNOT Learn (Zero-Knowledge) |
| :--- | :--- | :--- |
| **Vendor Identity** | ✕ None. Identity is never broadcasted or logged. | ✓ 100% Anonymity. Wallet envelope only signs gas fees. |
| **Compliance Score** | ✕ Exact score is never revealed on-chain. | ✓ Only boolean threshold qualification (`score >= 75`) is proven. |
| **Financial Statements** | ✕ Zero balance sheet, tax, or solvency records published. | ✓ Encrypted and hashed client-side into 32-byte credential digest. |
| **Proof Nonce** | ✕ Salt is never revealed in plaintext on-chain. | ✓ Private 32-byte entropy prevents correlation across claims. |
| **Accreditation Validity** | ✓ Boolean mathematical proof that vendor is qualified. | ✓ Proprietary supplier credentials remain confidential. |
| **Procurement Authority** | ✓ Public authority commitment anchor hash. | ✓ Auditor root master private signing key remains secret. |
| **Replay Protection** | ✓ Incrementing public counter and session epoch. | ✓ Cross-session linkability of distinct vendor verifications. |

---

### 4. Authoritative Midnight Preview Deployment

| Parameter | Live Value |
| :--- | :--- |
| **Network** | Midnight Preview Testnet |
| **Contract Address** | `0xf300c8ef23885f1cc04e6879ec5085f0845eff81c79d5ef6066f176af11df09f` |
| **Midnight Explorer** | [View on Midnight Explorer](https://preview.midnightexplorer.com/contracts/0xf300c8ef23885f1cc04e6879ec5085f0845eff81c79d5ef6066f176af11df09f) |
| **Deployment Block** | `204,891` |
| **Indexer GraphQL** | `https://indexer.preview.midnight.network/api/v4/graphql` |
| **Raw State Length** | `11,954 bytes` (prefix: `midnight:contract-state[v6]`) |
| **Compiler Version** | `compactc 0.31.1` (Target: Compact v0.23) |

---

## 👥 Author Information
- **Applicant / Developer**: sanasabnam59-svg
- **Email**: sanasabnam59@gmail.com
- **GitHub**: [https://github.com/sanasabnam59-svg/Private-Vendor-Verification](https://github.com/sanasabnam59-svg/Private-Vendor-Verification)
- **Live dApp**: [https://private-vendor-verification.vercel.app/](https://private-vendor-verification.vercel.app/)
- **Demo Video**: [https://youtu.be/4eYF2BHCH9A](https://youtu.be/4eYF2BHCH9A)
