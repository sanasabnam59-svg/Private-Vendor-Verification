"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getClient } from "../lib/contract";
import WalletConnectModal from "./WalletConnectModal";

export default function Navbar() {
  const [address, setAddress] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const client = getClient();
    if (client.isConnected && client.connectedAddress) {
      setAddress(client.connectedAddress);
      setWalletName(client.connectedWallet === "oneam" ? "1AM Wallet" : "Midnight Lace");
    }
  }, []);

  const handleDisconnect = () => {
    const client = getClient();
    client.disconnect();
    setAddress(null);
    setWalletName(null);
  };

  const shortAddress = address
    ? address.slice(0, 6) + "..." + address.slice(-4)
    : null;

  return (
    <>
      <nav
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(5, 8, 17, 0.8)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "0.75rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              textDecoration: "none",
            }}
          >
            <span style={{ fontSize: "1.6rem" }}>🏢</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#f8fafc", letterSpacing: "-0.02em" }}>
                PVV <span style={{ color: "#38bdf8", fontWeight: 400 }}>Registry</span>
              </div>
              <div style={{ fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Private Vendor Verification
              </div>
            </div>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link href="/" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}>
                Overview
              </Link>
              <Link href="/claim" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}>
                Verify Vendor
              </Link>
              <Link href="/explorer" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}>
                On-Chain Explorer
              </Link>
              <Link href="/admin" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}>
                Procurement Admin
              </Link>
            </div>

            {address ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.35rem 0.75rem",
                    borderRadius: "9999px",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.25)",
                    fontSize: "0.75rem",
                    color: "#34d399",
                    fontFamily: "monospace",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                  {walletName}: {shortAddress}
                </div>
                <button
                  onClick={handleDisconnect}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "6px",
                    color: "#94a3b8",
                    padding: "0.35rem 0.65rem",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                  }}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary"
                style={{ fontSize: "0.8rem", padding: "0.45rem 1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <span>🌙</span> Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>

      <WalletConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnected={(addr, name) => {
          setAddress(addr);
          setWalletName(name);
        }}
      />
    </>
  );
}
