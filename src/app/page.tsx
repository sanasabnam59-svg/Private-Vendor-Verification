"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import VendorPaperWaves3D from "../components/VendorPaperWaves3D";
import { getClient, CONTRACT_ADDRESS, EXPLORER_URL, CANONICAL_DEPLOYMENT } from "../lib/contract";

export default function HomePage() {
  const [stats, setStats] = useState({
    vendorCount: 1,
    revokedCount: 0,
    activeSession: 1,
    rawStateBytes: 11954,
  });

  useEffect(() => {
    const client = getClient();
    client.fetchLedgerState().then((res) => {
      setStats({
        vendorCount: res.vendorCount,
        revokedCount: res.revokedCount,
        activeSession: res.activeSession,
        rawStateBytes: res.rawStateBytes,
      });
    });
  }, []);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem 5rem 2rem" }}>
      {/* ??? HERO SECTION: XPAPER 3D MINIMALIST HERO ????????????????????????? */}
      <section className="hero-grid">
        {/* Left Column: Text, CTAs, Curled Stat Cards */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", zIndex: 10 }}>
          {/* Release Chip matching reference image */}
          <div className="pill-release-badge">
            <span>?</span> the new and improved 2.0v release &gt;
          </div>

          {/* Giant Lowercase Bold Headline */}
          <h1 className="hero-headline">
            new ways to<br />
            verify vendors
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            streamline zero-knowledge supplier due diligence with state of the art midnight zk-snarks and the bleeding edge of privacy verification
          </p>

          {/* Action Pill Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3.5rem", flexWrap: "wrap" }}>
            <Link href="/claim" className="btn-pill-black">
              start now
            </Link>
            <Link href="/explorer" className="btn-pill-white">
              our work
            </Link>
          </div>

          {/* Paper-Peel Curled Corner Stat Cards matching reference */}
          <div style={{ display: "flex", gap: "1.5rem", width: "100%", maxWidth: 460, flexWrap: "wrap" }}>
            {/* Card 1: Curled Top-Right Corner */}
            <div className="paper-peel-card curl-tr" style={{ flex: "1 1 180px", minWidth: 170 }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0d14", marginBottom: "0.3rem" }}>
                200
              </div>
              <div style={{ fontSize: "0.84rem", color: "#64748b", lineHeight: 1.35, fontWeight: 500 }}>
                satisfied businesses
              </div>
            </div>

            {/* Card 2: Curled Bottom-Right Corner */}
            <div className="paper-peel-card curl-br" style={{ flex: "1 1 200px", minWidth: 190 }}>
              <div style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.3, marginBottom: "0.5rem", fontWeight: 500 }}>
                1 million evaluation startups
              </div>
              <div style={{ fontSize: "1.85rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0d14" }}>
                70+
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D WebGL Paper Sculpture */}
        <div style={{ width: "100%", height: "100%", minHeight: 520, position: "relative" }}>
          <VendorPaperWaves3D />
        </div>
      </section>

      {/* ??? ECOSYSTEM TRUST STRIP ??????????????????????????????????????????? */}
      <section style={{ borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "1.8rem 0", margin: "2rem 0 4rem 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem", opacity: 0.75 }}>
          <span style={{ fontSize: "0.76rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
            Powered by Midnight Ecosystem
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "3rem", flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "#334155", letterSpacing: "-0.02em" }}>SafePal</span>
            <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "#334155", letterSpacing: "-0.02em" }}>DEXSCREENER</span>
            <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "#334155", letterSpacing: "-0.02em" }}>PancakeSwap</span>
            <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "#0f172a", letterSpacing: "-0.02em" }}>Midnight Network</span>
            <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "#334155", letterSpacing: "-0.02em" }}>Cardano Foundation</span>
          </div>
        </div>
      </section>

      {/* ??? 4 STAT METRIC CARDS IN CURLED PAPER STYLE ???????????????????????? */}
      <section style={{ marginBottom: "4.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
          <div className="paper-peel-card curl-tr">
            <div style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: "0.5rem" }}>
              Total Accredited
            </div>
            <div style={{ fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0d14" }}>
              {stats.vendorCount}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#10b981", marginTop: "0.4rem", fontWeight: 500 }}>
              ? Verified on-chain
            </div>
          </div>

          <div className="paper-peel-card">
            <div style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: "0.5rem" }}>
              Min Compliance Score
            </div>
            <div style={{ fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0d14" }}>
              75 / 100
            </div>
            <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.4rem", fontWeight: 500 }}>
              Threshold gate enforced in ZK
            </div>
          </div>

          <div className="paper-peel-card">
            <div style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: "0.5rem" }}>
              Revoked Commitments
            </div>
            <div style={{ fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0d14" }}>
              {stats.revokedCount}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.4rem", fontWeight: 500 }}>
              Procurement authority audits
            </div>
          </div>

          <div className="paper-peel-card curl-br">
            <div style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: "0.5rem" }}>
              Preview Raw State
            </div>
            <div style={{ fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0d14" }}>
              {stats.rawStateBytes.toLocaleString()} B
            </div>
            <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.4rem", fontWeight: 500 }}>
              Synchronized via GraphQL v4
            </div>
          </div>
        </div>
      </section>

      {/* ??? SELECTIVE DISCLOSURE MATRIX (LEVEL 2 & LEVEL 3) ?????????????????? */}
      <section style={{ marginBottom: "4.5rem" }}>
        <div style={{ marginBottom: "1.75rem" }}>
          <div className="pill-release-badge">
            <span>??</span> privacy boundary specification
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0d14" }}>
            selective disclosure matrix
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.95rem", marginTop: "0.3rem" }}>
            Delineating what an observer can and cannot learn on the Midnight public ledger.
          </p>
        </div>

        <div className="paper-panel" style={{ padding: 0, overflow: "hidden" }}>
          <table className="paper-table">
            <thead>
              <tr>
                <th style={{ width: "24%" }}>Information Asset</th>
                <th style={{ width: "38%" }}>What an Observer CAN Learn (Public On-Chain)</th>
                <th style={{ width: "38%" }}>What an Observer CANNOT Learn (Private Zero-Knowledge)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 700 }}>Vendor Identity</td>
                <td>? None. Identity is never broadcasted or logged.</td>
                <td style={{ color: "#059669", fontWeight: 600 }}>? 100% Anonymity. Wallet envelope only signs gas fees.</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Compliance Score</td>
                <td>? Exact score is never revealed on-chain.</td>
                <td style={{ color: "#059669", fontWeight: 600 }}>? Only boolean threshold proof (score &gt;= 75) is asserted.</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Financial Statements</td>
                <td>? Zero balance sheet, tax, or solvency records published.</td>
                <td style={{ color: "#059669", fontWeight: 600 }}>? Hashed client-side into 32-byte credential digest.</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Proof Entropy Nonce</td>
                <td>? Salt is never revealed in plaintext on-chain.</td>
                <td style={{ color: "#059669", fontWeight: 600 }}>? Private 32-byte entropy prevents correlation across claims.</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Accreditation Validity</td>
                <td>? Boolean mathematical truth that vendor is accredited.</td>
                <td style={{ color: "#059669", fontWeight: 600 }}>? Proprietary supplier credentials remain confidential.</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Procurement Authority</td>
                <td>? Public authority commitment anchor hash.</td>
                <td style={{ color: "#059669", fontWeight: 600 }}>? Auditor root master private signing key remains secret.</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Replay Protection</td>
                <td>? Incrementing public counter and session epoch.</td>
                <td style={{ color: "#059669", fontWeight: 600 }}>? Cross-session linkability of distinct vendor verifications.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ??? 3-GRID CORE ARCHITECTURE ?????????????????????????????????????????? */}
      <section style={{ marginBottom: "4.5rem" }}>
        <div style={{ marginBottom: "1.75rem" }}>
          <div className="pill-release-badge">
            <span>??</span> technical architecture
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0d14" }}>
            three-tier zero-knowledge protocol
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          <div className="paper-panel">
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#0a0d14", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, marginBottom: "1rem" }}>
              01
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
              6 Compact Circuits
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "1rem" }}>
              Compiled with Compact v0.23: <code>registerVendor</code>, <code>verifyVendorAccreditation</code>, <code>revokeVendorAccreditation</code>, <code>setRegistryAuthorityCommitment</code>, <code>resetRegistryPolicy</code>, <code>incrementSession</code>.
            </p>
            <div style={{ fontSize: "0.8rem", color: "#0284c7", fontWeight: 600 }}>
              ? Native ZK-SNARK Proving
            </div>
          </div>

          <div className="paper-panel">
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#0a0d14", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, marginBottom: "1rem" }}>
              02
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
              5 Private Witnesses
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "1rem" }}>
              Evaluated strictly in browser memory: <code>vendorSecretKey</code>, <code>vendorProofNonce</code>, <code>vendorCredentialHash</code>, <code>vendorComplianceScore</code>, and <code>authoritySigningKey</code>.
            </p>
            <div style={{ fontSize: "0.8rem", color: "#0284c7", fontWeight: 600 }}>
              ? Zero Raw Witness Leakage
            </div>
          </div>

          <div className="paper-panel">
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#0a0d14", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, marginBottom: "1rem" }}>
              03
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
              8 Public Ledger Fields
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "1rem" }}>
              Synchronized via Midnight Indexer: <code>vendorCount</code>, <code>revokedCount</code>, <code>activeSession</code>, <code>registryId</code>, <code>authorityCommitment</code>, <code>lastVendorCommitment</code>, <code>lastRevokedCommitment</code>, <code>minimumComplianceScore</code>.
            </p>
            <div style={{ fontSize: "0.8rem", color: "#0284c7", fontWeight: 600 }}>
              ? Preview Testnet Live State
            </div>
          </div>
        </div>
      </section>

      {/* ??? AUTHORITATIVE DEPLOYMENT CARD ???????????????????????????????????? */}
      <section>
        <div className="paper-panel" style={{ background: "#f8fafc", border: "1px solid #cbd5e1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
                <span style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b", fontWeight: 700 }}>
                  Authoritative Midnight Preview Deployment
                </span>
              </div>
              <div style={{ fontSize: "0.98rem", fontFamily: "monospace", fontWeight: 700, color: "#0f172a", wordBreak: "break-all" }}>
                {CONTRACT_ADDRESS}
              </div>
              <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "0.3rem" }}>
                Compiler compactc 0.31.1 ? Commit f02e1f8 ? Block 204,891
              </div>
            </div>

            <a
              href={EXPLORER_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-pill-black"
              style={{ padding: "0.6rem 1.35rem", fontSize: "0.85rem" }}
            >
              open in midnight explorer ?
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
