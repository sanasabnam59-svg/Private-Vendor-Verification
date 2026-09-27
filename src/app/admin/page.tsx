"use client";

import { useState, useEffect } from "react";
import { getClient } from "../../lib/contract";
import TransactionVerifyModal from "../../components/TransactionVerifyModal";
import WalletConnectModal from "../../components/WalletConnectModal";

export default function AdminPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const [minScore, setMinScore] = useState(75);
  const [revokeCommitment, setRevokeCommitment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1AM Transaction Verification Modal State
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<{ title: string; circuit: string; commitment?: string; details?: any; exec: () => Promise<void> } | null>(null);
  const [modalStatus, setModalStatus] = useState<"idle" | "awaiting_approval" | "submitting" | "confirmed" | "rejected">("idle");
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    const client = getClient();
    if (client.isConnected && client.connectedAddress) {
      setWalletAddress(client.connectedAddress);
      setWalletName(client.connectedWallet || "1AM Wallet");
    }
  }, []);

  const ensureWallet = (): boolean => {
    const client = getClient();
    if (!client.isConnected || !client.connectedAddress) {
      setStatusMsg({
        type: "error",
        text: "Please connect your 1AM Wallet before executing procurement authority governance circuits.",
      });
      setIsConnectModalOpen(true);
      return false;
    }
    return true;
  };

  const handleUpdatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ensureWallet()) return;

    setModalAction({
      title: "Update Minimum Compliance Score",
      circuit: "setRegistryAuthorityCommitment",
      details: { "New Minimum Threshold": `${minScore} / 100` },
      exec: async () => {
        const client = getClient();
        const res = await client.setRegistryAuthorityCommitment(minScore);
        setStatusMsg({
          type: "success",
          text: `✓ Verified by 1AM Wallet! Minimum compliance threshold updated to ${minScore}/100 on Midnight (TxHash: ${res.txHash.slice(0, 16)}...).`,
        });
      },
    });
    setModalStatus("awaiting_approval");
    setModalError(null);
    setIsVerifyModalOpen(true);
  };

  const handleRevoke = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokeCommitment.trim()) return;
    if (!ensureWallet()) return;

    const clean = revokeCommitment.trim();
    setModalAction({
      title: "Revoke Vendor Accreditation",
      circuit: "revokeVendorAccreditation",
      commitment: clean,
      details: { "Target Commitment": clean },
      exec: async () => {
        const client = getClient();
        const res = await client.revokeVendorAccreditation(clean);
        setStatusMsg({
          type: "success",
          text: `✓ Verified by 1AM Wallet! Vendor accreditation revoked on-chain via ZK circuit (TxHash: ${res.txHash.slice(0, 16)}...).`,
        });
        setRevokeCommitment("");
      },
    });
    setModalStatus("awaiting_approval");
    setModalError(null);
    setIsVerifyModalOpen(true);
  };

  const handleIncrementSession = () => {
    if (!ensureWallet()) return;

    setModalAction({
      title: "Increment Monotonic Session Epoch",
      circuit: "incrementSession",
      details: { "Anti-Replay": "Advance session epoch nonce by +1" },
      exec: async () => {
        const client = getClient();
        const res = await client.incrementSession();
        setStatusMsg({
          type: "success",
          text: `✓ Verified by 1AM Wallet! Monotonic session counter incremented for anti-replay protection (TxHash: ${res.txHash.slice(0, 16)}...).`,
        });
      },
    });
    setModalStatus("awaiting_approval");
    setModalError(null);
    setIsVerifyModalOpen(true);
  };

  const executeModalAction = async () => {
    if (!modalAction) return;
    setIsProcessing(true);
    setModalStatus("submitting");

    try {
      await modalAction.exec();
      setModalStatus("confirmed");
      setIsVerifyModalOpen(false);
    } catch (e: any) {
      const msg = e?.message || "Transaction failed";
      setModalError(msg);
      setModalStatus("rejected");
      setStatusMsg({
        type: "error",
        text: "1AM Wallet Notice: " + msg,
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
          Execute authorized zero-knowledge governance circuits verified through your 1AM Wallet.
        </p>

        {/* Wallet Status indicator */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
          {walletAddress ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", background: "#f1f5f9", padding: "0.35rem 0.9rem", borderRadius: 9999, border: "1px solid #e2e8f0", fontSize: "0.8rem", fontWeight: 600 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
              <span>1AM: {walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}</span>
            </div>
          ) : (
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="btn-pill-white"
              style={{ padding: "0.4rem 1rem", fontSize: "0.82rem" }}
            >
              + connect 1am wallet
            </button>
          )}
        </div>
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
              verify with 1am & update threshold
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
                Requires authorized <code>authoritySigningKey()</code> witness verified by 1AM Wallet.
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="btn-pill-black"
              style={{ width: "100%", padding: "0.75rem", background: "#b91c1c", borderColor: "#991b1b" }}
            >
              verify with 1am & revoke on-chain
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
              Circuit: <code>incrementSession()</code> advances monotonic session epoch to prevent proof replay.
            </p>
          </div>

          <button
            onClick={handleIncrementSession}
            disabled={isProcessing}
            className="btn-pill-white"
            style={{ padding: "0.6rem 1.3rem", fontSize: "0.85rem" }}
          >
            increment session epoch via 1am &gt;
          </button>
        </div>
      </div>

      {/* 1AM Wallet Transaction Verification Modal */}
      {modalAction && (
        <TransactionVerifyModal
          isOpen={isVerifyModalOpen}
          actionTitle={modalAction.title}
          circuitName={modalAction.circuit}
          commitment={modalAction.commitment}
          details={modalAction.details}
          walletAddress={walletAddress}
          walletName={walletName}
          status={modalStatus}
          errorMsg={modalError}
          onApprove={executeModalAction}
          onCancel={() => {
            setIsVerifyModalOpen(false);
            setIsProcessing(false);
            setModalStatus("idle");
          }}
        />
      )}

      {/* Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnected={(addr, name) => {
          setWalletAddress(addr);
          setWalletName(name);
          setStatusMsg(null);
        }}
      />
    </div>
  );
}
