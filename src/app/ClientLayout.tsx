"use client";

import React from "react";
import Navbar from "../components/Navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1, paddingBottom: "4rem" }}>{children}</main>
      <footer
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "2rem 1.5rem",
          textAlign: "center",
          color: "#64748b",
          fontSize: "0.8rem",
          background: "rgba(3, 7, 18, 0.6)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{ fontWeight: 600, color: "#94a3b8" }}>Private Vendor Verification (PVV)</span> — Built on Midnight Network Preview Testnet
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <a href="https://preview.midnightexplorer.com/contracts/0xf300c8ef23885f1cc04e6879ec5085f0845eff81c79d5ef6066f176af11df09f" target="_blank" rel="noopener noreferrer" style={{ color: "#38bdf8", textDecoration: "none" }}>
              Midnight Explorer ↗
            </a>
            <a href="https://github.com/sanasabnam59-svg/Private-Vendor-Verification" target="_blank" rel="noopener noreferrer" style={{ color: "#94a3b8", textDecoration: "none" }}>
              GitHub Repo ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
