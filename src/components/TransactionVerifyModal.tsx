"use client";

import React from "react";

interface TransactionVerifyModalProps {
  isOpen: boolean;
  actionTitle: string;
  circuitName: string;
  commitment?: string;
  details?: Record<string, string | number | undefined>;
  walletAddress?: string | null;
  walletName?: string | null;
  status: "idle" | "awaiting_approval" | "submitting" | "confirmed" | "rejected";
  errorMsg?: string | null;
  onApprove: () => void;
  onCancel: () => void;
}

export default function TransactionVerifyModal({
  isOpen,
  actionTitle,
  circuitName,
  commitment,
  details = {},
  walletAddress,
  walletName = "1AM Wallet",
  status,
  errorMsg,
  onApprove,
  onCancel,
}: TransactionVerifyModalProps) {
  if (!isOpen) return null;

  const shortAddr = walletAddress
    ? walletAddress.slice(0, 10) + "..." + walletAddress.slice(-6)
    : "Unknown 1AM Account";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 110,
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 24,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          width: "100%",
          maxWidth: 480,
          padding: "2rem",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with 1AM badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#fef3c7",
                color: "#d97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a" }}>
                1AM Wallet Verification
              </div>
              <div style={{ fontSize: "0.76rem", color: "#64748b" }}>
                Midnight Network Preview Testnet
              </div>
            </div>
          </div>

          <span
            style={{
              padding: "0.25rem 0.65rem",
              borderRadius: 9999,
              fontSize: "0.72rem",
              fontWeight: 700,
              background: "#f0fdf4",
              color: "#166534",
              border: "1px solid #bbf7d0",
            }}
          >
            ACTIVE SESSION
          </span>
        </div>

        {/* Action Title */}
        <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: "1.25rem" }}>
          <div style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b", fontWeight: 700 }}>
            Transaction Action
          </div>
          <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0a0d14", marginTop: "0.2rem" }}>
            {actionTitle}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#475569", marginTop: "0.2rem", fontFamily: "monospace" }}>
            Circuit: {circuitName}()
          </div>
        </div>

        {/* Transaction Details */}
        <div style={{ fontSize: "0.82rem", color: "#475569", marginBottom: "1.25rem", display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          <div><strong>Signing Account:</strong> <span style={{ fontFamily: "monospace", color: "#0f172a" }}>{shortAddr}</span></div>
          <div><strong>Contract Address:</strong> <span style={{ fontFamily: "monospace", fontSize: "0.76rem", wordBreak: "break-all" }}>0xf300c8ef23885f1cc04e6879ec5085f0845eff81c79d5ef6066f176af11df09f</span></div>
          {commitment && (
            <div><strong>ZK Commitment:</strong> <span style={{ fontFamily: "monospace", fontSize: "0.76rem", wordBreak: "break-all" }}>{commitment}</span></div>
          )}
          {Object.entries(details).map(([k, v]) => (
            <div key={k}><strong>{k}:</strong> {String(v)}</div>
          ))}
        </div>

        {/* Status prompt */}
        {status === "awaiting_approval" && (
          <div
            style={{
              padding: "0.85rem 1rem",
              borderRadius: 14,
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              color: "#1e40af",
              fontSize: "0.83rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", border: "2px solid #1e40af", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
            <div>
              <strong>Prompting 1AM Wallet:</strong> Please review and accept the transaction in your 1AM Wallet extension popup.
            </div>
          </div>
        )}

        {status === "submitting" && (
          <div
            style={{
              padding: "0.85rem 1rem",
              borderRadius: 14,
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#166534",
              fontSize: "0.83rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", border: "2px solid #166534", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
            <div>
              <strong>Signature verified by 1AM!</strong> Submitting zero-knowledge proof to Midnight Preview testnet...
            </div>
          </div>
        )}

        {errorMsg && (
          <div
            style={{
              padding: "0.85rem 1rem",
              borderRadius: 14,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              fontSize: "0.83rem",
              marginBottom: "1.5rem",
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "0.85rem", justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            disabled={status === "submitting"}
            style={{
              padding: "0.65rem 1.25rem",
              borderRadius: 9999,
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#64748b",
              fontWeight: 600,
              fontSize: "0.86rem",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={onApprove}
            disabled={status === "submitting" || status === "awaiting_approval"}
            className="btn-pill-black"
            style={{
              padding: "0.65rem 1.45rem",
              fontSize: "0.86rem",
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
            }}
          >
            <span>Approve & Verify in 1AM</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 4.5L6.5 11.5L3 8" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
