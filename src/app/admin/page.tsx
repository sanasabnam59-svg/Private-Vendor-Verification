"use client";

import { useState } from "react";
import { getClient } from "../../lib/contract";

export default function AdminPage() {
  const [minScore, setMinScore] = useState(75);
  const [revokeCommitment, setRevokeCommitment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpdatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatusMsg(null);

    try {
      const client = getClient();
      const res = await client.setRegistryAuthorityCommitment(minScore);
      setStatusMsg({
        type: "success",
        text: `✓ Minimum compliance threshold updated to ${minScore}/100. Authority commitment anchored on Midnight (TxHash: ${res.txHash.slice(0, 16)}...).`,
      });
    } catch (e: any) {
      setStatusMsg({
        type: "error",
        text: "Failed to execute setRegistryAuthorityCommitment: " + (e?.message || "Transaction rejected"),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRevoke = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokeCommitment.trim()) return;

    setIsProcessing(true);
    setStatusMsg(null);

    try {
      const client = getClient();
      const res = await client.revokeVendorAccreditation(revokeCommitment.trim());
      setStatusMsg({
        type: "success",
        text: `✓ Vendor accreditation revoked on-chain via ZK circuit. LastRevokedCommitment updated (TxHash: ${res.txHash.slice(0, 16)}...).`,
      });
      setRevokeCommitment("");
    } catch (e: any) {
      setStatusMsg({
        type: "error",
        text: "Failed to execute revokeVendorAccreditation: " + (e?.message || "Unauthorized authority key"),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIncrementSession = async () => {
    setIsProcessing(true);
    setStatusMsg(null);
    try {
      const client = getClient();
      const res = await client.incrementSession();
      setStatusMsg({
        type: "success",
        text: `✓ Monotonic session counter incremented for anti-replay protection (TxHash: ${res.txHash.slice(0, 16)}...).`,
      });
    } catch (e: any) {
      setStatusMsg({
        type: "error",
        text: "Failed to increment session: " + (e?.message || "Transaction rejected"),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem 5rem 1.5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        <div className="pill-release-badge" style={{ marginBottom: "1rem" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>procurement compliance authority</span>
        </div>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, letterSpacing: "-0.04em", color: "#0a0d14", marginBottom: "0.5rem" }}>
          procurement admin console
        </h1>
        <p style={{ color: "#64748b", fontSize: "1.02rem", maxWidth: 620, margin: "0 auto" }}>
          Execute authorized zero-knowledge governance circuits: anchor authority commitments, adjust compliance thresholds, and revoke non-compliant accreditations.
        </p>
      </div>

      {statusMsg && (
        <div
          style={{
            padding: "1rem 1.25rem",
            borderRadius: 16,
            background: statusMsg.type === "success" ? "#f0fdf4" : "#fef2f2",
            border: statusMsg.type === "success" ? "1px solid #bbf7d0" : "1px solid #fecaca",
            color: statusMsg.type === "success" ? "#166534" : "#991b1b",
            fontSize: "0.88rem",
            marginBottom: "2rem",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {statusMsg.type === "success" ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 4.5L6.5 11.5L3 8" stroke="#166534" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="#991b1b" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.75rem", marginBottom: "2.5rem" }}>
        {/* Section 1: Set Authority Commitment & Threshold */}
        <div className="paper-panel">
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0d14" }}>
              authority threshold & commitment
            </h2>
            <p style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "0.2rem" }}>
              Circuit: <code>setRegistryAuthorityCommitment(Uint&lt;32&gt;)</code>
            </p>
          </div>

          <form onSubmit={handleUpdatePolicy}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="paper-label">minimum compliance score</label>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                <input
                  type="range"
                  min="70"
                  max="95"
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  style={{ flex: 1, accentColor: "#0f172a", cursor: "pointer" }}
                />
                <span style={{ fontWeight: 800, fontSize: "1.1rem", minWidth: 40 }}>{minScore}</span>
              </div>
              <div style={{ fontSize: "0.74rem", color: "#94a3b8" }}>
                Vendors scoring below {minScore} will fail eligibility assertions in zero-knowledge.
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="btn-pill-black"
              style={{ width: "100%", padding: "0.75rem" }}
            >
              {isProcessing ? "Executing ZK Circuit..." : "anchor authority & update"}
            </button>
          </form>
        </div>

        {/* Section 2: Revoke Vendor Accreditation */}
        <div className="paper-panel">
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0d14" }}>
              revoke accreditation
            </h2>
            <p style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "0.2rem" }}>
              Circuit: <code>revokeVendorAccreditation(Bytes&lt;32&gt;)</code>
            </p>
          </div>

          <form onSubmit={handleRevoke}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="paper-label">vendor commitment hash to revoke</label>
              <input
                type="text"
                className="paper-input"
                placeholder="0x8a9b2c3d..."
                value={revokeCommitment}
                onChange={(e) => setRevokeCommitment(e.target.value)}
                style={{ fontFamily: "monospace" }}
                required
              />
              <div style={{ fontSize: "0.74rem", color: "#94a3b8", marginTop: "0.4rem" }}>
                Requires authorized <code>authoritySigningKey()</code> witness proof on Midnight.
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="btn-pill-black"
              style={{ width: "100%", padding: "0.75rem", background: "#b91c1c", borderColor: "#991b1b" }}
            >
              {isProcessing ? "Revoking On-Chain..." : "revoke accreditation on-chain"}
            </button>
          </form>
        </div>
      </div>

      {/* Section 3: Anti-Replay Session Control */}
      <div className="paper-panel" style={{ background: "#f8fafc" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
              anti-replay session epoch control
            </h3>
            <p style={{ fontSize: "0.84rem", color: "#64748b", marginTop: "0.2rem" }}>
              Circuit: <code>incrementSession()</code> increments monotonic session nonce to protect against proof replay.
            </p>
          </div>

          <button
            onClick={handleIncrementSession}
            disabled={isProcessing}
            className="btn-pill-white"
            style={{ padding: "0.6rem 1.3rem", fontSize: "0.85rem" }}
          >
            increment session epoch &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
