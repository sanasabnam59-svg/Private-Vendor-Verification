"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getClient } from "../lib/contract";
import WalletConnectModal from "./WalletConnectModal";

export default function Navbar() {
  const [address, setAddress] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  useEffect(() => {
    const client = getClient();
    if (client.isConnected && client.connectedAddress) {
      setAddress(client.connectedAddress);
      setWalletName(client.connectedWallet || "Midnight Lace");
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
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 60,
          background: "rgba(251, 252, 253, 0.88)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(226, 232, 240, 0.7)",
          padding: "0.9rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: Brand + Navigation Items */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            {/* Logo Mark */}
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                textDecoration: "none",
                color: "#0a0d14",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: "#000000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontWeight: 900,
                  fontSize: "0.95rem",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.18)",
                }}
              >
                ?
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  letterSpacing: "-0.04em",
                  color: "#0a0d14",
                }}
              >
                xvendor
              </span>
            </Link>

            {/* Subtle Divider */}
            <div style={{ width: 1, height: 22, background: "#cbd5e1" }} />

            {/* Menu Links with Dropdowns matching reference */}
            <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              {/* Solutions Dropdown */}
              <div
                style={{ position: "relative" }}
                onMouseEnter={() => setSolutionsOpen(true)}
                onMouseLeave={() => setSolutionsOpen(false)}
              >
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#475569",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "0.25rem 0",
                    fontFamily: "inherit",
                  }}
                >
                  solutions <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>?</span>
                </button>

                {solutionsOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 16,
                      boxShadow: "0 14px 30px -6px rgba(0, 0, 0, 0.08)",
                      padding: "0.6rem",
                      minWidth: 230,
                      zIndex: 100,
                    }}
                  >
                    <Link
                      href="/claim"
                      style={{
                        display: "block",
                        padding: "0.6rem 0.85rem",
                        color: "#0f172a",
                        textDecoration: "none",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        borderRadius: 10,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      Vendor Accreditation
                      <span style={{ display: "block", fontSize: "0.74rem", color: "#64748b", fontWeight: 400 }}>
                        Prove compliance score &gt;= 75 in ZK
                      </span>
                    </Link>
                    <Link
                      href="/claim"
                      style={{
                        display: "block",
                        padding: "0.6rem 0.85rem",
                        color: "#0f172a",
                        textDecoration: "none",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        borderRadius: 10,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      Dual Audit Verification
                      <span style={{ display: "block", fontSize: "0.74rem", color: "#64748b", fontWeight: 400 }}>
                        Verify by commitment or TxHash
                      </span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Company Dropdown */}
              <div
                style={{ position: "relative" }}
                onMouseEnter={() => setCompanyOpen(true)}
                onMouseLeave={() => setCompanyOpen(false)}
              >
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#475569",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "0.25rem 0",
                    fontFamily: "inherit",
                  }}
                >
                  company <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>?</span>
                </button>

                {companyOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 16,
                      boxShadow: "0 14px 30px -6px rgba(0, 0, 0, 0.08)",
                      padding: "0.6rem",
                      minWidth: 230,
                      zIndex: 100,
                    }}
                  >
                    <a
                      href="https://preview.midnightexplorer.com/contracts/0xf300c8ef23885f1cc04e6879ec5085f0845eff81c79d5ef6066f176af11df09f"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "block",
                        padding: "0.6rem 0.85rem",
                        color: "#0f172a",
                        textDecoration: "none",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        borderRadius: 10,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      Midnight Preview Explorer ?
                      <span style={{ display: "block", fontSize: "0.74rem", color: "#64748b", fontWeight: 400 }}>
                        View live on-chain contract
                      </span>
                    </a>
                  </div>
                )}
              </div>

              {/* Direct Page Links */}
              <Link
                href="/claim"
                style={{
                  color: "#475569",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#0a0d14")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
              >
                verify
              </Link>

              <Link
                href="/explorer"
                style={{
                  color: "#475569",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#0a0d14")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
              >
                explorer
              </Link>

              <Link
                href="/admin"
                style={{
                  color: "#475569",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#0a0d14")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
              >
                admin
              </Link>
            </nav>
          </div>

          {/* Right: Pill Button matching 'start now' in reference image */}
          <div>
            {address ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.4rem 0.95rem",
                    borderRadius: 9999,
                    background: "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.82rem",
                    color: "#0f172a",
                    fontWeight: 600,
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
                  {walletName}: {shortAddress}
                </div>
                <button
                  onClick={handleDisconnect}
                  style={{
                    background: "transparent",
                    border: "1px solid #e2e8f0",
                    borderRadius: 9999,
                    color: "#64748b",
                    padding: "0.4rem 0.85rem",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-pill-black"
                style={{ padding: "0.55rem 1.45rem", fontSize: "0.88rem" }}
              >
                start now
              </button>
            )}
          </div>
        </div>
      </header>

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
