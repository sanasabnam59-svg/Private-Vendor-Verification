"use client";

import { useState } from "react";
import { getClient, VendorPledgeData, VerificationResult } from "../../lib/contract";

export default function VendorVerificationPage() {
  const [activeTab, setActiveTab] = useState<"register" | "verify">("register");

  const [companyName, setCompanyName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [jurisdiction, setJurisdiction] = useState("United States / Delaware");
  const [complianceScore, setComplianceScore] = useState(88);
  const [solvencyTier, setSolvencyTier] = useState("Tier 1: $10M+ Capitalization");
  const [frameworks, setFrameworks] = useState<string[]>(["ISO-27001", "SOC-2-Type-II"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regResult, setRegResult] = useState<any>(null);
  const [regError, setRegError] = useState<string | null>(null);

  const [verifyQuery, setVerifyQuery] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<VerificationResult | null>(null);

  const toggleFramework = (f: string) => {
    if (frameworks.includes(f)) {
      setFrameworks(frameworks.filter(item => item !== f));
    } else {
      setFrameworks([...frameworks, f]);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setRegError(null);
    setRegResult(null);

    try {
      const client = getClient();
      const res = await client.registerVendor({
        companyName,
        registrationNumber,
        jurisdiction,
        complianceScore,
        solvencyTier,
        frameworks,
      });
      setRegResult(res);
      setVerifyQuery(res.commitment);
    } catch (err: any) {
      setRegError(err?.message || "Failed to register vendor accreditation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyQuery.trim()) return;

    setIsVerifying(true);
    setVerifyResult(null);
    try {
      const client = getClient();
      const res = await client.verifyVendorAccreditation(verifyQuery.trim());
      setVerifyResult(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "0.5rem" }}>
        <button
          onClick={() => setActiveTab("register")}
          style={{
            background: activeTab === "register" ? "rgba(56, 189, 248, 0.15)" : "transparent",
            color: activeTab === "register" ? "#38bdf8" : "#94a3b8",
            border: activeTab === "register" ? "1px solid #38bdf8" : "1px solid transparent",
            borderRadius: "8px",
            padding: "0.6rem 1.25rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          🏢 1. Vendor ZK Accreditation
        </button>
        <button
          onClick={() => setActiveTab("verify")}
          style={{
            background: activeTab === "verify" ? "rgba(56, 189, 248, 0.15)" : "transparent",
            color: activeTab === "verify" ? "#38bdf8" : "#94a3b8",
            border: activeTab === "verify" ? "1px solid #38bdf8" : "1px solid transparent",
            borderRadius: "8px",
            padding: "0.6rem 1.25rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          🔍 2. Dual Verification Portal
        </button>
      </div>

      {activeTab === "register" && (
        <div className="glass-panel">
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Submit Vendor Due Diligence Pledge
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1.5rem" }}>
            Generate a zero-knowledge proof that your enterprise complies with all required regulatory criteria without disclosing raw balance sheets or tax forms.
          </p>

          {regError && (
            <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", borderRadius: "8px", padding: "0.75rem", fontSize: "0.85rem", color: "#fca5a5", marginBottom: "1.25rem" }}>
              {regError}
            </div>
          )}

          {regResult && (
            <div style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid #10b981", borderRadius: "8px", padding: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ fontWeight: 600, color: "#34d399", fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                ✅ Zero-Knowledge Accreditation Anchored Successfully!
              </div>
              <div style={{ fontSize: "0.8rem", color: "#cbd5e1", wordBreak: "break-all", marginBottom: "0.25rem" }}>
                <strong>32-Byte ZK Commitment:</strong> {regResult.commitment}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#cbd5e1", wordBreak: "break-all", marginBottom: "0.75rem" }}>
                <strong>On-Chain TxHash:</strong> {regResult.txHash}
              </div>
              <button
                onClick={() => setActiveTab("verify")}
                className="btn-primary"
                style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
              >
                Verify In Portal →
              </button>
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "0.35rem" }}>
                  Legal Company Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Cyber Logistics Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "0.35rem" }}>
                  Registration / DUNS Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DUNS-8921-994"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "0.35rem" }}>
                Jurisdiction / Country
              </label>
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="United States / Delaware">United States (Delaware / NY)</option>
                <option value="European Union / Germany">European Union (Germany / Ireland)</option>
                <option value="United Kingdom">United Kingdom (London)</option>
                <option value="Singapore">Singapore (MAS Regulated)</option>
                <option value="Japan">Japan (FSA Compliant)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "0.5rem" }}>
                Certified Compliance Frameworks
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {["ISO-27001", "SOC-2-Type-II", "GDPR-Privacy", "HIPAA-Healthcare", "PCI-DSS-v4", "ESG-Tier-1"].map((f) => (
                  <button
                    type="button"
                    key={f}
                    onClick={() => toggleFramework(f)}
                    style={{
                      background: frameworks.includes(f) ? "rgba(56, 189, 248, 0.2)" : "rgba(255, 255, 255, 0.05)",
                      border: frameworks.includes(f) ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.1)",
                      color: frameworks.includes(f) ? "#38bdf8" : "#94a3b8",
                      borderRadius: "6px",
                      padding: "0.35rem 0.75rem",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    {frameworks.includes(f) ? "✓ " : "+ "} {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <label style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                  Confidential Audit & Compliance Score (Min: 75)
                </label>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: complianceScore >= 75 ? "#34d399" : "#ef4444" }}>
                  {complianceScore} / 100
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={complianceScore}
                onChange={(e) => setComplianceScore(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#38bdf8" }}
              />
              <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>
                🔒 The exact score is verified inside the ZK-SNARK circuit; it is never written to the public ledger.
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ marginTop: "0.5rem", padding: "0.85rem", fontSize: "0.95rem" }}
            >
              {isSubmitting ? "Generating Proof & Committing..." : "⚡ Execute ZK Accreditation Circuit"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "verify" && (
        <div className="glass-panel">
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Dual Verification Engine
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1.5rem" }}>
            Verify vendor accreditation status using either a 32-Byte ZK Commitment Hash or an on-chain Midnight Transaction Hash.
          </p>

          <form onSubmit={handleVerify} style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                placeholder="Enter 32-Byte ZK Commitment OR On-Chain TxHash (0x...)"
                value={verifyQuery}
                onChange={(e) => setVerifyQuery(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" disabled={isVerifying} className="btn-primary">
                {isVerifying ? "Verifying..." : "Verify"}
              </button>
            </div>
          </form>

          {verifyResult && (
            <div
              style={{
                background: verifyResult.valid ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                border: "1px solid " + (verifyResult.valid ? "#10b981" : "#ef4444"),
                borderRadius: "12px",
                padding: "1.25rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "1.25rem" }}>{verifyResult.valid ? "✅" : "❌"}</span>
                <span style={{ fontWeight: 700, fontSize: "1rem", color: verifyResult.valid ? "#34d399" : "#fca5a5" }}>
                  {verifyResult.valid ? "Accreditation Status: VALID & ACTIVE" : "Accreditation Status: INVALID OR REVOKED"}
                </span>
              </div>

              <div style={{ fontSize: "0.8rem", color: "#94a3b8", display: "grid", gap: "0.4rem" }}>
                <div><strong>Commitment:</strong> {verifyResult.commitment}</div>
                <div><strong>Verification Mode:</strong> {verifyResult.mode}</div>
                <div><strong>Verified At:</strong> {verifyResult.verifiedAt}</div>
                <div><strong>Network Source:</strong> {verifyResult.source}</div>

                {verifyResult.vendorDetails && (
                  <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    <div style={{ fontWeight: 600, color: "#f8fafc", marginBottom: "0.3rem" }}>Vendor Profile:</div>
                    <div>Company: {verifyResult.vendorDetails.companyName}</div>
                    <div>Registration: {verifyResult.vendorDetails.registrationNumber}</div>
                    <div>Frameworks: {verifyResult.vendorDetails.frameworks?.join(", ")}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
