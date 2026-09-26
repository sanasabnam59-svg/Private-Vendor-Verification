"use client";

import { useState } from "react";
import { getClient, VendorPledgeData, VerificationResult } from "../../lib/contract";

export default function VendorVerificationPage() {
  const [activeTab, setActiveTab] = useState<"register" | "verify">("register");

  // Registration Form State
  const [companyName, setCompanyName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [jurisdiction, setJurisdiction] = useState("United States / Delaware");
  const [complianceScore, setComplianceScore] = useState(88);
  const [solvencyTier, setSolvencyTier] = useState("Tier 1: $10M+ Capitalization");
  const [frameworks, setFrameworks] = useState<string[]>(["ISO-27001", "SOC-2-Type-II"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regResult, setRegResult] = useState<any>(null);
  const [regError, setRegError] = useState<string | null>(null);

  // Verification Form State
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
      const payload: VendorPledgeData = {
        companyName: companyName.trim() || "Global Enterprise Supplier",
        registrationNumber: registrationNumber.trim() || "US-CORP-77491",
        jurisdiction,
        complianceScore,
        solvencyTier,
        frameworks,
      };

      const result = await client.registerVendor(payload);
      setRegResult(result);
    } catch (e: any) {
      setRegError(e?.message || "Failed to submit vendor accreditation");
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
    } catch (e: any) {
      setVerifyResult({
        valid: false,
        commitment: verifyQuery,
        verifiedAt: new Date().toISOString(),
        mode: "zk-commitment",
        source: "Private Vendor Verification Registry",
        status: "unverified",
        details: e?.message || "Verification query failed",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "2rem 1.5rem 5rem 1.5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        <div className="pill-release-badge">
          <span>?</span> zero-knowledge supplier due diligence
        </div>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, letterSpacing: "-0.04em", color: "#0a0d14", marginBottom: "0.5rem" }}>
          vendor accreditation portal
        </h1>
        <p style={{ color: "#64748b", fontSize: "1.02rem", maxWidth: 640, margin: "0 auto" }}>
          Register compliant supplier credentials with ZK-SNARK threshold proofs, or instantly verify accreditation by commitment or on-chain transaction hash.
        </p>
      </div>

      {/* Pill Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
        <button
          onClick={() => setActiveTab("register")}
          className={activeTab === "register" ? "btn-pill-black" : "btn-pill-white"}
          style={{ padding: "0.6rem 1.4rem" }}
        >
          register vendor
        </button>
        <button
          onClick={() => setActiveTab("verify")}
          className={activeTab === "verify" ? "btn-pill-black" : "btn-pill-white"}
          style={{ padding: "0.6rem 1.4rem" }}
        >
          dual verification engine
        </button>
      </div>

      {/* ??? TAB 1: REGISTER VENDOR ?????????????????????????????????????????? */}
      {activeTab === "register" && (
        <div className="paper-panel" style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ marginBottom: "1.8rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1.2rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0d14" }}>
              submit vendor accreditation
            </h2>
            <p style={{ fontSize: "0.84rem", color: "#64748b", marginTop: "0.2rem" }}>
              Private witnesses remain local in browser memory. Proves compliance score &gt;= 75 on Midnight Preview.
            </p>
          </div>

          {regError && (
            <div
              style={{
                padding: "0.9rem 1.1rem",
                borderRadius: 14,
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                fontSize: "0.85rem",
                marginBottom: "1.5rem",
              }}
            >
              ?? {regError}
            </div>
          )}

          {regResult && (
            <div
              style={{
                padding: "1.25rem 1.4rem",
                borderRadius: 16,
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#166534",
                marginBottom: "1.75rem",
              }}
            >
              <div style={{ fontWeight: 800, fontSize: "1.05rem", marginBottom: "0.4rem" }}>
                ? Vendor Accreditation Verified On-Chain!
              </div>
              <div style={{ fontSize: "0.85rem", lineHeight: 1.6, wordBreak: "break-all" }}>
                <div><strong>Commitment Hash:</strong> <span style={{ fontFamily: "monospace" }}>{regResult.commitment}</span></div>
                <div><strong>Transaction Hash:</strong> <span style={{ fontFamily: "monospace" }}>{regResult.txHash}</span></div>
                <div><strong>Compliance Score:</strong> {regResult.complianceScore} / 100 (Threshold Passed)</div>
              </div>
              <button
                onClick={() => {
                  setVerifyQuery(regResult.commitment);
                  setActiveTab("verify");
                }}
                className="btn-pill-black"
                style={{ marginTop: "1rem", fontSize: "0.8rem", padding: "0.45rem 1rem" }}
              >
                verify this accreditation in dual engine &gt;
              </button>
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginBottom: "1.2rem" }}>
              <div>
                <label className="paper-label">company legal name</label>
                <input
                  type="text"
                  className="paper-input"
                  placeholder="e.g. Apex Cyber Logistics Inc"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="paper-label">registration / tax id</label>
                <input
                  type="text"
                  className="paper-input"
                  placeholder="e.g. US-DE-8831920"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginBottom: "1.5rem" }}>
              <div>
                <label className="paper-label">jurisdiction</label>
                <select
                  className="paper-input"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                >
                  <option value="United States / Delaware">United States / Delaware</option>
                  <option value="European Union / Ireland">European Union / Ireland</option>
                  <option value="United Kingdom / London">United Kingdom / London</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Switzerland / Zug">Switzerland / Zug</option>
                  <option value="Global Multi-Jurisdiction">Global Multi-Jurisdiction</option>
                </select>
              </div>

              <div>
                <label className="paper-label">solvency tier</label>
                <select
                  className="paper-input"
                  value={solvencyTier}
                  onChange={(e) => setSolvencyTier(e.target.value)}
                >
                  <option value="Tier 1: $10M+ Capitalization">Tier 1: $10M+ Capitalization</option>
                  <option value="Tier 2: $2M - $10M Capitalization">Tier 2: $2M - $10M Capitalization</option>
                  <option value="Tier 3: Seed / Series A Capitalized">Tier 3: Seed / Series A Capitalized</option>
                  <option value="Government Certified Prime">Government Certified Prime</option>
                </select>
              </div>
            </div>

            {/* Compliance Score Slider */}
            <div style={{ marginBottom: "1.5rem", background: "#f8fafc", padding: "1.2rem", borderRadius: 16, border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span className="paper-label" style={{ margin: 0 }}>audited compliance score</span>
                <span style={{ fontWeight: 800, fontSize: "1.15rem", color: complianceScore >= 75 ? "#059669" : "#dc2626" }}>
                  {complianceScore} / 100 {complianceScore >= 75 ? "? Eligible" : "? Below Threshold"}
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={complianceScore}
                onChange={(e) => setComplianceScore(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#0f172a", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: "#94a3b8", marginTop: "0.3rem" }}>
                <span>50 (Fail)</span>
                <span style={{ color: "#059669", fontWeight: 700 }}>75 (Required Threshold)</span>
                <span>100 (Max)</span>
              </div>
            </div>

            {/* Framework Badges */}
            <div style={{ marginBottom: "2rem" }}>
              <label className="paper-label">audited compliance frameworks</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.3rem" }}>
                {["ISO-27001", "SOC-2-Type-II", "HIPAA", "PCI-DSS", "GDPR", "FedRAMP"].map((fw) => {
                  const selected = frameworks.includes(fw);
                  return (
                    <button
                      type="button"
                      key={fw}
                      onClick={() => toggleFramework(fw)}
                      style={{
                        padding: "0.4rem 0.9rem",
                        borderRadius: 9999,
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        border: selected ? "1px solid #0f172a" : "1px solid #cbd5e1",
                        background: selected ? "#0f172a" : "#ffffff",
                        color: selected ? "#ffffff" : "#475569",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {selected ? "? " : "+ "}{fw}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-pill-black"
              style={{ width: "100%", padding: "0.85rem", fontSize: "0.96rem" }}
            >
              {isSubmitting ? "Generating ZK-SNARK Proof on Midnight..." : "submit accreditation proof on midnight"}
            </button>
          </form>
        </div>
      )}

      {/* ??? TAB 2: DUAL VERIFICATION ENGINE ???????????????????????????????? */}
      {activeTab === "verify" && (
        <div className="paper-panel" style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ marginBottom: "1.8rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1.2rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0d14" }}>
              dual verification engine
            </h2>
            <p style={{ fontSize: "0.84rem", color: "#64748b", marginTop: "0.2rem" }}>
              Verify supplier accreditation validity using either 32-Byte ZK Commitment Hash or On-Chain Transaction Hash.
            </p>
          </div>

          <form onSubmit={handleVerify} style={{ marginBottom: "2rem" }}>
            <label className="paper-label">enter zk commitment or on-chain txhash</label>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <input
                type="text"
                className="paper-input"
                placeholder="0x8a9b2c3d... or 0xf300c8ef..."
                value={verifyQuery}
                onChange={(e) => setVerifyQuery(e.target.value)}
                style={{ fontFamily: "monospace" }}
                required
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="btn-pill-black"
                style={{ padding: "0.72rem 1.6rem", whiteSpace: "nowrap" }}
              >
                {isVerifying ? "verifying..." : "verify"}
              </button>
            </div>
          </form>

          {/* Verification Result Card */}
          {verifyResult && (
            <div
              className="paper-panel-subtle"
              style={{
                border: verifyResult.valid ? "1px solid #86efac" : "1px solid #fca5a5",
                background: verifyResult.valid ? "#f0fdf4" : "#fef2f2",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.8rem" }}>
                <span
                  style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: 9999,
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    background: verifyResult.valid ? "#bbf7d0" : "#fecaca",
                    color: verifyResult.valid ? "#166534" : "#991b1b",
                  }}
                >
                  {verifyResult.status.toUpperCase()}
                </span>
                <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                  Mode: {verifyResult.mode}
                </span>
              </div>

              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.4rem" }}>
                {verifyResult.valid ? "? Accreditation Confirmed Active" : "? Accreditation Invalid or Revoked"}
              </div>

              <div style={{ fontSize: "0.84rem", color: "#475569", marginBottom: "0.8rem" }}>
                {verifyResult.details}
              </div>

              <div style={{ fontSize: "0.8rem", fontFamily: "monospace", color: "#64748b", wordBreak: "break-all" }}>
                <div><strong>Commitment:</strong> {verifyResult.commitment}</div>
                {verifyResult.txHash && <div><strong>TxHash:</strong> {verifyResult.txHash}</div>}
                <div><strong>Source:</strong> {verifyResult.source}</div>
              </div>

              {verifyResult.vendorDetails && (
                <div style={{ marginTop: "1rem", paddingTop: "0.8rem", borderTop: "1px solid rgba(0, 0, 0, 0.08)", fontSize: "0.82rem" }}>
                  <div style={{ fontWeight: 700, marginBottom: "0.3rem" }}>Accredited Entity Details:</div>
                  <div><strong>Company:</strong> {verifyResult.vendorDetails.companyName}</div>
                  <div><strong>Jurisdiction:</strong> {verifyResult.vendorDetails.jurisdiction}</div>
                  <div><strong>Compliance Score:</strong> {verifyResult.vendorDetails.complianceScore} / 100</div>
                  <div><strong>Frameworks:</strong> {verifyResult.vendorDetails.frameworks?.join(", ")}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
