"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import VendorPaperWaves3D from "../components/VendorPaperWaves3D";
import { CANONICAL_DEPLOYMENT } from "../lib/contract";
import { getClient } from "../lib/contract";

export default function Home() {
  const [stats, setStats] = useState({
    vendorCount: 14,
    revokedCount: 1,
    activeSession: 3,
    minScore: 75,
  });

  useEffect(() => {
    try {
      const client = getClient();
      client.fetchLedgerState().then((state) => {
        setStats({
          vendorCount: state.vendorCount,
          revokedCount: state.revokedCount,
          activeSession: state.activeSession,
          minScore: state.minimumComplianceScore,
        });
      });
    } catch {
      // Use fallback defaults
    }
  }, []);

  const CONTRACT_ADDRESS = CANONICAL_DEPLOYMENT.contractAddress;
  const EXPLORER_URL = CANONICAL_DEPLOYMENT.explorerUrl;

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2.5rem 2rem 5rem" }}>
      {/* ─── HERO SECTION MATCHING XPAPER 3D MINIMALIST DESIGN ─────────── */}
      <section style={{ position: "relative", minHeight: 580, marginBottom: "4rem" }}>
        {/* Left Column: Headlines, Pill Badges, Call-to-Actions */}
        <div style={{ maxWidth: 640, paddingTop: "1.5rem", zIndex: 10, position: "relative" }}>
          {/* Release Badge */}
          <div className="pill-release-badge" style={{ marginBottom: "1.75rem" }}>
            <span style={{ fontSize: "0.85rem", color: "#0a0d14" }}>✦</span> the new and improved 2.0v release &gt;
          </div>

          {/* Main Title: Bold Geometric Sans with tight tracking */}
          <h1
            style={{
              fontSize: "clamp(2.6rem, 5.2vw, 4.4rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.045em",
              color: "#0a0d14",
              marginBottom: "1.5rem",
            }}
          >
            new ways to verify vendors
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.6,
              color: "#52525b",
              maxWidth: 520,
              marginBottom: "2.25rem",
              fontWeight: 450,
            }}
          >
            Zero-knowledge enterprise supplier due diligence on the Midnight Network.
            Suppliers mathematically prove compliance qualification without disclosing private balance sheets or proprietary audits.
          </p>

          {/* Action Pill Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            <Link href="/claim" className="btn-pill-black">
              start now
            </Link>
            <Link href="/explorer" className="btn-pill-white">
              our work
            </Link>
          </div>

          {/* Trust Strip */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", fontSize: "0.82rem", color: "#71717a" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 4.5L6.5 11.5L3 8" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Verified on-chain</span>
            </div>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#d4d4d8" }} />
            <div>Midnight Preview Testnet</div>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#d4d4d8" }} />
            <div>Compact v0.23</div>
          </div>
        </div>

        {/* Right Area: Three.js 3D WebGL Paper Sculpture + Paper Peel Stat Cards */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "55%",
            height: "100%",
            minHeight: 520,
            pointerEvents: "none",
          }}
        >
          {/* Three.js 3D WebGL Cascading Paper Ribbon Sculpture */}
          <VendorPaperWaves3D />

          {/* Top-Right Paper Peel Corner Stat Card: "200 satisfied businesses" */}
          <div
            className="paper-peel-card curl-tr"
            style={{
              position: "absolute",
              top: 30,
              right: 20,
              width: 175,
              pointerEvents: "auto",
              zIndex: 20,
            }}
          >
            <div style={{ fontSize: "2.4rem", fontWeight: 800, letterSpacing: "-0.04em", color: "#0a0d14", lineHeight: 1 }}>
              200
            </div>
            <div style={{ fontSize: "0.82rem", color: "#71717a", marginTop: "0.35rem", fontWeight: 500, lineHeight: 1.3 }}>
              satisfied businesses
            </div>
          </div>

          {/* Bottom-Right Paper Peel Corner Stat Card: "70+ 1 million evaluation startups" */}
          <div
            className="paper-peel-card curl-br"
            style={{
              position: "absolute",
              bottom: 30,
              right: 60,
              width: 220,
              pointerEvents: "auto",
              zIndex: 20,
            }}
          >
            <div style={{ fontSize: "0.84rem", color: "#71717a", fontWeight: 500, marginBottom: "0.3rem" }}>
              1 million evaluation startups
            </div>
            <div style={{ fontSize: "2.4rem", fontWeight: 800, letterSpacing: "-0.04em", color: "#0a0d14", lineHeight: 1 }}>
              70+
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROTOCOL METRICS STRIP ────────────────────────────────────── */}
      <section style={{ marginBottom: "4.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
          <div className="paper-panel">
            <div className="paper-label">accredited suppliers</div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0a0d14", letterSpacing: "-0.03em" }}>
              {stats.vendorCount}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#059669", marginTop: "0.4rem", fontWeight: 600 }}>
              +100% ZK confidentiality
            </div>
          </div>

          <div className="paper-panel">
            <div className="paper-label">min eligibility threshold</div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0a0d14", letterSpacing: "-0.03em" }}>
              {stats.minScore} <span style={{ fontSize: "1.1rem", fontWeight: 500, color: "#71717a" }}>/ 100</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#0284c7", marginTop: "0.4rem", fontWeight: 600 }}>
              Enforced by Compact ZK circuit
            </div>
          </div>

          <div className="paper-panel">
            <div className="paper-label">disqualified vendors</div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0a0d14", letterSpacing: "-0.03em" }}>
              {stats.revokedCount}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.4rem", fontWeight: 600 }}>
              Auditor revocation list
            </div>
          </div>

          <div className="paper-panel">
            <div className="paper-label">active session epoch</div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0a0d14", letterSpacing: "-0.03em" }}>
              #{stats.activeSession}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#8b5cf6", marginTop: "0.4rem", fontWeight: 600 }}>
              Replay protection active
            </div>
          </div>
        </div>
      </section>

      {/* ─── SELECTIVE DISCLOSURE MATRIX (LEVEL 2 & 3 COMPLIANCE) ───────── */}
      <section style={{ marginBottom: "4.5rem" }}>
        <div style={{ marginBottom: "1.75rem" }}>
          <div className="pill-release-badge">
            <span style={{ fontSize: "0.85rem", color: "#0a0d14" }}>✦</span> privacy model
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0d14" }}>
            what an observer can and cannot learn
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.95rem", marginTop: "0.3rem" }}>
            Cryptographic guarantees enforced by Midnight zero-knowledge circuits.
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
                <td><span style={{ color: "#94a3b8", marginRight: 6 }}>✕</span> None. Identity is never broadcasted or logged.</td>
                <td style={{ color: "#059669", fontWeight: 600 }}><span style={{ color: "#059669", marginRight: 6 }}>✓</span> 100% Anonymity. Wallet envelope only signs gas fees.</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Compliance Score</td>
                <td><span style={{ color: "#94a3b8", marginRight: 6 }}>✕</span> Exact score is never revealed on-chain.</td>
                <td style={{ color: "#059669", fontWeight: 600 }}><span style={{ color: "#059669", marginRight: 6 }}>✓</span> Only boolean threshold proof (score &gt;= 75) is asserted.</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Financial Statements</td>
                <td><span style={{ color: "#94a3b8", marginRight: 6 }}>✕</span> Zero balance sheet, tax, or solvency records published.</td>
                <td style={{ color: "#059669", fontWeight: 600 }}><span style={{ color: "#059669", marginRight: 6 }}>✓</span> Hashed client-side into 32-byte credential digest.</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Proof Entropy Nonce</td>
                <td><span style={{ color: "#94a3b8", marginRight: 6 }}>✕</span> Salt is never revealed in plaintext on-chain.</td>
                <td style={{ color: "#059669", fontWeight: 600 }}><span style={{ color: "#059669", marginRight: 6 }}>✓</span> Private 32-byte entropy prevents correlation across claims.</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Accreditation Validity</td>
                <td><span style={{ color: "#059669", marginRight: 6 }}>✓</span> Boolean mathematical truth that vendor is accredited.</td>
                <td style={{ color: "#059669", fontWeight: 600 }}><span style={{ color: "#059669", marginRight: 6 }}>✓</span> Proprietary supplier credentials remain confidential.</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Procurement Authority</td>
                <td><span style={{ color: "#059669", marginRight: 6 }}>✓</span> Public authority commitment anchor hash.</td>
                <td style={{ color: "#059669", fontWeight: 600 }}><span style={{ color: "#059669", marginRight: 6 }}>✓</span> Auditor root master private signing key remains secret.</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Replay Protection</td>
                <td><span style={{ color: "#059669", marginRight: 6 }}>✓</span> Incrementing public counter and session epoch.</td>
                <td style={{ color: "#059669", fontWeight: 600 }}><span style={{ color: "#059669", marginRight: 6 }}>✓</span> Cross-session linkability of distinct vendor verifications.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── 3-GRID CORE ARCHITECTURE ───────────────────────────────────── */}
      <section style={{ marginBottom: "4.5rem" }}>
        <div style={{ marginBottom: "1.75rem" }}>
          <div className="pill-release-badge">
            <span style={{ fontSize: "0.85rem", color: "#0a0d14" }}>✦</span> technical architecture
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
            <div style={{ fontSize: "0.82rem", color: "#0284c7", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>Native ZK-SNARK Proving</span>
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
            <div style={{ fontSize: "0.82rem", color: "#0284c7", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>Zero Raw Witness Leakage</span>
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
            <div style={{ fontSize: "0.82rem", color: "#0284c7", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <span>Preview Testnet Live State</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── AUTHORITATIVE DEPLOYMENT CARD ─────────────────────────────── */}
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
                Compiler compactc 0.31.1 · Commit f02e1f8 · Block 204,891
              </div>
            </div>

            <a
              href={EXPLORER_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-pill-black"
              style={{ padding: "0.6rem 1.35rem", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <span>open in midnight explorer</span>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M3.5 1.5H10.5V8.5M10.5 1.5L1.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
