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

  const handleConnect = async (walletId: "lace" | "oneam", allowDemo: boolean = false) => {
    setConnecting(walletId);
    setErrorMsg(null);
    try {
      const client = getClient();
      const res = await client.connect(walletId, allowDemo);
      onConnected(res.address, walletId === "oneam" ? (allowDemo ? "1AM Wallet (Demo)" : "1AM Wallet") : (allowDemo ? "Midnight Lace (Demo)" : "Midnight Lace"));
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
        background: "rgba(15, 23, 42, 0.4)",
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
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)",
          width: "100%",
          maxWidth: 460,
          padding: "2rem",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0d14" }}>
              connect midnight wallet
            </h3>
            <p style={{ fontSize: "0.84rem", color: "#64748b", marginTop: "0.2rem" }}>
              Connect your authorized 1AM Wallet or Midnight Lace extension
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1.5 1.5L10.5 10.5M10.5 1.5L1.5 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div
            style={{
              padding: "0.85rem 1rem",
              borderRadius: 14,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              fontSize: "0.83rem",
              marginBottom: "1.25rem",
              lineHeight: 1.5,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>Connection Notice:</div>
            <div>{errorMsg}</div>
            {errorMsg.includes("not detected") && (
              <div style={{ marginTop: "0.5rem" }}>
                <a
                  href="https://1am.xyz"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#0284c7", fontWeight: 700, textDecoration: "underline" }}
                >
                  Download & Install 1AM Wallet Extension (1am.xyz) &gt;
                </a>
              </div>
            )}
          </div>
        )}

        {/* Connecting progress prompt */}
        {connecting && (
          <div
            style={{
              padding: "0.85rem 1rem",
              borderRadius: 14,
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#166534",
              fontSize: "0.83rem",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", border: "2px solid #166534", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
            <span>
              Requesting authorization from {connecting === "oneam" ? "1AM Wallet" : "Midnight Lace"}... Please approve in your wallet extension popup.
            </span>
          </div>
        )}

        {/* Wallet Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.95rem" }}>
          {wallets.map((w) => {
            const isOneAm = w.id === "oneam";
            return (
              <div
                key={w.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.05rem 1.15rem",
                  borderRadius: 18,
                  border: isOneAm ? "1.5px solid #0f172a" : "1px solid #e2e8f0",
                  background: isOneAm ? "#fcfcfd" : "#fbfcfd",
                  boxShadow: isOneAm ? "0 4px 12px rgba(0, 0, 0, 0.04)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: isOneAm ? "#fef3c7" : "#e0e7ff",
                      color: isOneAm ? "#d97706" : "#4338ca",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isOneAm ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontWeight: 800, fontSize: "0.96rem", color: "#0f172a" }}>
                        {w.name}
                      </span>
                      {isOneAm && (
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.45rem", borderRadius: 9999, background: "#0f172a", color: "#ffffff" }}>
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.76rem", color: w.installed ? "#059669" : "#94a3b8", marginTop: "0.15rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: w.installed ? "#10b981" : "#cbd5e1" }} />
                      <span>{w.installed ? "Extension detected in browser" : "Extension not detected"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {w.installed ? (
                    <button
                      onClick={() => handleConnect(w.id as any, false)}
                      disabled={connecting !== null}
                      className="btn-pill-black"
                      style={{ padding: "0.45rem 1rem", fontSize: "0.82rem" }}
                    >
                      {connecting === w.id ? "connecting..." : "connect"}
                    </button>
                  ) : (
                    <a
                      href={isOneAm ? "https://1am.xyz" : "https://midnight.network"}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-pill-white"
                      style={{ padding: "0.45rem 0.85rem", fontSize: "0.78rem", textDecoration: "none", display: "inline-block" }}
                    >
                      install ↗
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Development sandbox option */}
        <div style={{ marginTop: "1.75rem", paddingTop: "1.2rem", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
          <div style={{ fontSize: "0.74rem", color: "#94a3b8", marginBottom: "0.5rem" }}>
            Testing without 1AM extension installed?
          </div>
          <button
            onClick={() => handleConnect("oneam", true)}
            style={{
              background: "transparent",
              border: "1px dashed #cbd5e1",
              borderRadius: 9999,
              padding: "0.35rem 0.9rem",
              fontSize: "0.76rem",
              color: "#64748b",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Launch Simulated 1AM Demo Session (Dev Sandbox)
          </button>
        </div>
      </div>
    </div>
  );
}
