# Project Proposal: Private Vendor Verification (PVV)
> Privacy-Preserving Zero-Knowledge Supplier Due Diligence & Eligibility Protocol on Midnight Network

---

## Live Demo Video & Live dApp

> **Demonstrates Midnight Lace wallet connection, proof creation, and successful `registerVendor()` circuit call from the frontend.**

[![PVV Video Walkthrough](https://img.shields.io/badge/YouTube-Watch%20Live%20Demo-FF0000?style=for-the-badge&logo=youtube)](https://youtu.be/cV5JCAbGyZo)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel%20App-0070f3?style=for-the-badge&logo=vercel)](https://private-vendor-verification.vercel.app/)

- **Watch on YouTube**: [https://youtu.be/cV5JCAbGyZo](https://youtu.be/cV5JCAbGyZo)
- **Live dApp on Vercel**: [https://private-vendor-verification.vercel.app/](https://private-vendor-verification.vercel.app/)
- **Contract on Midnight Explorer**: [https://preview.midnightexplorer.com/contracts/0xf300c8ef23885f1cc04e6879ec5085f0845eff81c79d5ef6066f176af11df09f](https://preview.midnightexplorer.com/contracts/0xf300c8ef23885f1cc04e6879ec5085f0845eff81c79d5ef6066f176af11df09f)

---

## Selected Problem from Idea List
> **Idea Category**: **Age / Eligibility Gate & Confidential Credentials**  
> **Application Domain**: **Private Vendor Verification & Enterprise Due Diligence Protocol**  
> **Privacy Principle**: Prove eligibility threshold (`vendorComplianceScore() >= minimumComplianceScore`, e.g. 75+) and credential validity without revealing underlying financial figures, tax documents, client rosters, or proprietary audits on-chain.

---

## Question 1: What is the application?

**Private Vendor Verification (PVV)** is an enterprise-grade, privacy-first decentralized vendor verification protocol built on the Midnight Network using Compact zero-knowledge smart contracts and the official **Midnight.js SDK** (`@midnight-ntwrk/dapp-connector-api`, `@midnight-ntwrk/midnight-js-network-id`, `@midnight-ntwrk/compact-runtime`, `@midnight-ntwrk/midnight-js-contracts`).

Vendors and suppliers prove legal qualification, certified compliance, and capitalization tiers using client-side ZK-SNARK proofs. Procurement officers and regulatory authorities anchor verification policies and audit accreditations via a dual verification engine (32-Byte ZK Commitment or On-Chain Transaction Hash) without inspecting private business documents.

---

## Question 2: What problem does it solve?

Traditional supplier onboarding introduces acute corporate vulnerabilities:
1. **Corporate Espionage & Margin Leakage**: Disclosing unencrypted balance sheets or audit ratings allows competitors or intermediaries to deduce margins and cost structures.
2. **Centralized Data Breach Targets**: Centralized vendor portals aggregate thousands of corporate tax IDs, bank coordinates, and security audit reports.
3. **Audit Verification Bottlenecks**: Procurement teams spend weeks manually reviewing sensitive PDFs, slowing down time-to-market.

PVV resolves these challenges with zero-knowledge cryptography:
- `assert(vendorComplianceScore() >= minimumComplianceScore)` asserts that the supplier exceeds the qualification threshold (e.g., 75/100) without revealing their true audit score.
- Financial documentation and certified credentials are encrypted and hashed client-side — raw financial data never leaves the vendor's device.
- Single-use proof nonces prevent cross-procurement linkage or vendor tracking across independent contracts.

---

## Question 3: How is Midnight used?

### 1. Midnight.js SDK (Frontend Integration)
- **`@midnight-ntwrk/dapp-connector-api`**: Handles browser wallet authorization (Midnight Lace / 1AM) with user approval prompts.
- **`@midnight-ntwrk/midnight-js-network-id`**: `setNetworkId("preview")` establishes the Midnight network environment.
- **`@midnight-ntwrk/compact-runtime`**: Managed `Contract`, `Witnesses`, and `ledger` state decoding.
- **`@midnight-ntwrk/midnight-js-contracts`**: Authoritative `deployContract()` deployment APIs.

### 2. Compact Smart Contract (6 Circuits)
Defined in `contracts/private_vendor_verification.compact` (Compact v0.23):
- **`registerVendor(expectedRegistryId: Bytes<32>): Bytes<32>`**: Core ZK accreditation circuit. Asserts compliance threshold and emits a 256-bit commitment hash.
- **`verifyVendorAccreditation(commitment: Bytes<32>): Boolean`**: Public on-chain verification of vendor commitments.
- **`revokeVendorAccreditation(commitment: Bytes<32>): []`**: Procurement authority revocation circuit requiring `authoritySigningKey` ZK proof.
- **`setRegistryAuthorityCommitment(minScore: Uint<32>): []`**: Anchors coordinator authority and establishes minimum compliance score.
- **`resetRegistryPolicy(newRegistryId: Bytes<32>, newMinScore: Uint<32>): []`**: Rotates registry program definitions and score guidelines.
- **`incrementSession(): []`**: Increments session nonce for replay resistance.

### 3. Live On-Chain Deployment Record
- **Network**: Midnight Preview Testnet
- **Contract Address**: `0xf300c8ef23885f1cc04e6879ec5085f0845eff81c79d5ef6066f176af11df09f`
- **Midnight Explorer**: [https://preview.midnightexplorer.com/contracts/0xf300c8ef23885f1cc04e6879ec5085f0845eff81c79d5ef6066f176af11df09f](https://preview.midnightexplorer.com/contracts/0xf300c8ef23885f1cc04e6879ec5085f0845eff81c79d5ef6066f176af11df09f)
- **Preview Indexer**: `https://indexer.preview.midnight.network/api/v4/graphql`
- **Raw State Length**: `11,954 bytes`

---

## Author & Contributor
- **Author**: sanasabnam59-svg
- **Email**: sanasabnam59@gmail.com
- **GitHub Repository**: [https://github.com/sanasabnam59-svg/Private-Vendor-Verification](https://github.com/sanasabnam59-svg/Private-Vendor-Verification)
- **Live dApp**: [https://private-vendor-verification.vercel.app/](https://private-vendor-verification.vercel.app/)