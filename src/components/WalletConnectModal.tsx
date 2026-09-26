"use client";

import React, { useState, useEffect } from "react";
import { getClient, DiscoveredWallet } from "../lib/contract";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: (address: string, walletName: string) => void;
}

export default function WalletConnectModal({
  isOpen,
  onClose,
  onConnected,
}: WalletConnectModalProps) {
  const [wallets, setWallets] = useState<DiscoveredWallet[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const client = getClient();
      setWallets(client.getWallets());
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnect = async (walletId: "lace" | "oneam") => {
    setConnecting(walletId);
    setErrorMsg(null);
    try {
      const client = getClient();
      const res = await client.connect(walletId);
      onConnected(res.address, walletId === "oneam" ? "1AM Wallet" : "Midnight Lace");
      onClose();
    } catch (e: any) {
      setErrorMsg(e?.message || "Failed to connect wallet");
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
        background: "rgba(15, 23, 42, 0.35)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "1.5rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 24,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.18)",
          width: "100%",
          maxWidth: 440,
          padding: "2rem",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0d14" }}>
              connect wallet
            </h3>
            <p style={{ fontSize: "0.84rem", color: "#64748b", marginTop: "0.2rem" }}>
              Select your Midnight Preview testnet wallet
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f1f5f9",
              border: "none",
              width: 32,
              height: 32,
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "1rem",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ?
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: 12,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              fontSize: "0.82rem",
              marginBottom: "1.25rem",
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Wallet Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {wallets.map((w) => (
            <button
              key={w.id}
              onClick={() => handleConnect(w.id as any)}
              disabled={connecting !== null}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.15rem",
                borderRadius: 16,
                border: "1px solid #e2e8f0",
                background: "#fbfcfd",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.background = "#fbfcfd";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <span style={{ fontSize: "1.5rem" }}>{w.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.94rem", color: "#0f172a" }}>
                    {w.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: w.installed ? "#10b981" : "#94a3b8" }}>
                    {w.installed ? "Detected in browser" : "Demo session ready"}
                  </div>
                </div>
              </div>

              <div
                className="btn-pill-black"
                style={{ padding: "0.4rem 0.9rem", fontSize: "0.78rem" }}
              >
                {connecting === w.id ? "connecting..." : "connect"}
              </div>
            </button>
          ))}
        </div>

        {/* Footer info */}
        <div style={{ marginTop: "1.75rem", textAlign: "center", fontSize: "0.76rem", color: "#94a3b8" }}>
          Shielded and transparent operations via official Midnight.js SDK.
        </div>
      </div>
    </div>
  );
}
