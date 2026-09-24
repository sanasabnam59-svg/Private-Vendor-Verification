"use client";

import React, { useState } from "react";
import { getClient } from "../lib/contract";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConnected: (address: string, walletName: string) => void;
}

export default function WalletConnectModal({ isOpen, onClose, onConnected }: Props) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (walletType: "lace" | "oneam") => {
    setConnecting(walletType);
    setError(null);
    try {
      const client = getClient();
      const res = await client.connect(walletType);
      onConnected(res.address, walletType === "oneam" ? "1AM Wallet" : "Midnight Lace");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to connect wallet");
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "440px",
          padding: "1.75rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          color: "#f8fafc",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>🔒</span> Connect Midnight Wallet
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              fontSize: "1.25rem",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>

        <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1.5rem", lineHeight: 1.5 }}>
          Select an authorized Midnight network wallet to authenticate your enterprise session and sign zero-knowledge circuits.
        </p>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", borderRadius: "8px", padding: "0.75rem", fontSize: "0.8rem", color: "#fca5a5", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button
            onClick={() => handleConnect("lace")}
            disabled={connecting !== null}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.9rem 1.2rem",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              color: "#f8fafc",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "1.4rem" }}>🌙</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Midnight Lace Wallet</div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Official Chrome & Brave Extension</div>
              </div>
            </div>
            <span style={{ fontSize: "0.75rem", color: "#818cf8" }}>
              {connecting === "lace" ? "Connecting..." : "Preview Testnet →"}
            </span>
          </button>

          <button
            onClick={() => handleConnect("oneam")}
            disabled={connecting !== null}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.9rem 1.2rem",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              color: "#f8fafc",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "1.4rem" }}>⚡</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>1AM Wallet</div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Alternative Midnight DApp Provider</div>
              </div>
            </div>
            <span style={{ fontSize: "0.75rem", color: "#818cf8" }}>
              {connecting === "oneam" ? "Connecting..." : "Preview Testnet →"}
            </span>
          </button>
        </div>

        <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", fontSize: "0.75rem", color: "#64748b", textAlign: "center" }}>
          Target Network: <span style={{ color: "#a5b4fc" }}>Midnight Preview (Chain ID: preview)</span>
        </div>
      </div>
    </div>
  );
}
