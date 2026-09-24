"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getClient, CONTRACT_ADDRESS, EXPLORER_URL } from "../lib/contract";

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
    <div style={{ maxWidth: 1140, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 0.85rem",
            background: "rgba(56, 189, 248, 0.1)",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            borderRadius: "9999px",
            fontSize: "0.8rem",
            color: "#38bdf8",
            marginBottom: "1.25rem",
            fontWeight: 500,
          }}
        >
          <span>🏢</span> Midnight Preview Testnet — Level 2 & Level 3 Protocol
        </div>

        <h1
          style={{
            fontSize: "2.75rem",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #38bdf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Private Vendor Verification (PVV)
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            color: "#94a3b8",
            maxWidth: 720,
            margin: "0 auto 2rem auto",
            lineHeight: 1.6,
          }}
        >
          Enterprise-grade, zero-knowledge supplier due diligence and accreditation. Prove ISO compliance, SOC 2 certification, and solvency thresholds without disclosing confidential financial balance sheets or proprietary secrets.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/claim" className="btn-primary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            <span>🔒</span> Verify Vendor Accreditation
          </Link>
          <a
            href={EXPLORER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            <span>🌐</span> Inspect Midnight Explorer ↗
          </a>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
        <div className="glass-panel" style={{ borderLeft: "4px solid #38bdf8" }}>
          <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
            Accredited Vendors
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f8fafc" }}>
            {stats.vendorCount}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#38bdf8", marginTop: "0.25rem" }}>
            ZK Verified On-Chain
          </div>
        </div>

        <div className="glass-panel" style={{ borderLeft: "4px solid #10b981" }}>
          <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
            Compliance Threshold
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f8fafc" }}>
            75 / 100
          </div>
          <div style={{ fontSize: "0.75rem", color: "#10b981", marginTop: "0.25rem" }}>
            Minimum Audit Score
          </div>
        </div>

        <div className="glass-panel" style={{ borderLeft: "4px solid #818cf8" }}>
          <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
            Contract State
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f8fafc" }}>
            {stats.rawStateBytes.toLocaleString()} B
          </div>
          <div style={{ fontSize: "0.75rem", color: "#818cf8", marginTop: "0.25rem" }}>
            Raw State on Preview v4
          </div>
        </div>

        <div className="glass-panel" style={{ borderLeft: "4px solid #f59e0b" }}>
          <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
            Session Nonce
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f8fafc" }}>
            Epoch #{stats.activeSession}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#f59e0b", marginTop: "0.25rem" }}>
            Replay Protected
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>🛡️</span> Level 3 Privacy Model: Selective Disclosure Matrix
        </h2>
        <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1.5rem" }}>
          Midnight's dual public/private ledger guarantees that third-party observers cannot reconstruct proprietary vendor financials or confidential client lists.
        </p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.12)", color: "#94a3b8" }}>
                <th style={{ padding: "0.75rem 1rem" }}>Information Asset</th>
                <th style={{ padding: "0.75rem 1rem" }}>Public On-Chain Ledger</th>
                <th style={{ padding: "0.75rem 1rem" }}>Private Zero-Knowledge Layer</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>Vendor Identity & Name</td>
                <td style={{ padding: "0.75rem 1rem", color: "#ef4444" }}>❌ Nothing (Never published)</td>
                <td style={{ padding: "0.75rem 1rem", color: "#34d399" }}>✅ Fully private in browser memory</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>Audit & Compliance Score</td>
                <td style={{ padding: "0.75rem 1rem", color: "#ef4444" }}>❌ Exact numerical score hidden</td>
                <td style={{ padding: "0.75rem 1rem", color: "#34d399" }}>✅ Circuit asserts score &ge; 75</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>Balance Sheets & Solvency</td>
                <td style={{ padding: "0.75rem 1rem", color: "#ef4444" }}>❌ Zero financial statements</td>
                <td style={{ padding: "0.75rem 1rem", color: "#34d399" }}>✅ Evaluated client-side via SHA-256</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>Accreditation Anchor</td>
                <td style={{ padding: "0.75rem 1rem", color: "#38bdf8" }}>✅ 32-byte cryptographic commitment</td>
                <td style={{ padding: "0.75rem 1rem", color: "#94a3b8" }}>Irreversible persistent hash</td>
              </tr>
              <tr>
                <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>Disqualified / Revoked Status</td>
                <td style={{ padding: "0.75rem 1rem", color: "#f59e0b" }}>✅ Revoked commitment hash</td>
                <td style={{ padding: "0.75rem 1rem", color: "#34d399" }}>✅ Proprietary reasons remain private</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
