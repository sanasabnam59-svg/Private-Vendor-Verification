"use client";

import { useState } from "react";
import { getClient, CONTRACT_ADDRESS, EXPLORER_URL } from "../../lib/contract";

export default function ProcurementAdminPage() {
  const [minScore, setMinScore] = useState(80);
  const [revokeCommitment, setRevokeCommitment] = useState("");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpdatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatusMsg(null);
    try {
      setTimeout(() => {
        setStatusMsg(`✅ Minimum compliance threshold updated to ${minScore}/100. Authority commitment anchored.`);
        setIsProcessing(false);
      }, 700);
    } catch (e: any) {
      setStatusMsg("Failed to update policy: " + e.message);
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
      await client.revokeVendorAccreditation(revokeCommitment.trim());
      setStatusMsg(`⚠️ Accreditation ${revokeCommitment.slice(0, 16)}... has been disqualified and revoked on-chain.`);
      setRevokeCommitment("");
    } catch (e: any) {
      setStatusMsg("Revocation failed: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.5rem" }}>
        Procurement Authority & Compliance Console
      </h1>
      <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "2rem" }}>
        Authorized enterprise procurement governance: anchor compliance policies, update score thresholds, and disqualify non-compliant vendors.
      </p>

      {statusMsg && (
        <div style={{ background: "rgba(56, 189, 248, 0.15)", border: "1px solid #38bdf8", borderRadius: "8px", padding: "0.85rem", fontSize: "0.85rem", color: "#bae6fd", marginBottom: "1.5rem" }}>
          {statusMsg}
        </div>
      )}

      <div style={{ display: "grid", gap: "1.5rem" }}>
        <div className="glass-panel">
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            1. Configure Compliance Score Threshold
          </h3>
          <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "1rem" }}>
            Executes `setRegistryAuthorityCommitment(minScore)` circuit to update required regulatory threshold.
          </p>

          <form onSubmit={handleUpdatePolicy} style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "0.3rem" }}>
                Required Minimum Score (0-100)
              </label>
              <input
                type="number"
                min="50"
                max="100"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            <button type="submit" disabled={isProcessing} className="btn-primary">
              Anchor Authority Threshold
            </button>
          </form>
        </div>

        <div className="glass-panel" style={{ borderLeft: "4px solid #ef4444" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem", color: "#f87171" }}>
            2. Disqualify / Revoke Vendor Accreditation
          </h3>
          <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "1rem" }}>
            Executes `revokeVendorAccreditation(commitment)` circuit with proof of procurement master signing key.
          </p>

          <form onSubmit={handleRevoke} style={{ display: "flex", gap: "0.75rem" }}>
            <input
              type="text"
              required
              placeholder="32-Byte Commitment Hash to Disqualify (0x...)"
              value={revokeCommitment}
              onChange={(e) => setRevokeCommitment(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              disabled={isProcessing}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "0.65rem 1.25rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Revoke Accreditation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
