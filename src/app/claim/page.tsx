"use client";

import { useState, useEffect } from "react";
import { getClient, VendorRegistrationInput, sha256Hex } from "../../lib/contract";
import TransactionVerifyModal from "../../components/TransactionVerifyModal";
import WalletConnectModal from "../../components/WalletConnectModal";

export default function ClaimPage() {
  const [activeTab, setActiveTab] = useState<"register" | "verify">("register");

  // Wallet State
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // Form State
  const [companyName, setCompanyName] = useState("");
  const [jurisdiction, setJurisdiction] = useState("US-DE");
  const [regNumber, setRegNumber] = useState("");
  const [solvencyTier, setSolvencyTier] = useState("Tier 1: $10M+ Capitalization");
  const [complianceScore, setComplianceScore] = useState(88);
  const [frameworks, setFrameworks] = useState<string[]>(["ISO-27001", "SOC-2-Type-II"]);

  // Process States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 1AM Transaction Verification Modal State
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"idle" | "awaiting_approval" | "submitting" | "confirmed" | "rejected">("idle");
  const [modalError, setModalError] = useState<string | null>(null);
  const [computedCommitment, setComputedCommitment] = useState<string>("");

  // Verification Search State
  const [verifyQuery, setVerifyQuery] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  useEffect(() => {
    const client = getClient();
    if (client.isConnected && client.connectedAddress) {
      setWalletAddress(client.connectedAddress);
      setWalletName(client.connectedWallet || "1AM Wallet");
    }
  }, []);

  const toggleFramework = (fw: string) => {
    if (frameworks.includes(fw)) {
      setFrameworks(frameworks.filter((f) => f !== fw));
    } else {
      setFrameworks([...frameworks, fw]);
    }
  };

  const handlePreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const client = getClient();

    if (!client.isConnected || !client.connectedAddress) {
      setSubmitError("Please connect your 1AM Wallet first before pledging vendor accreditation.");
      setIsConnectModalOpen(true);
      return;
    }

    setSubmitError(null);
    setSubmitResult(null);

    // Precompute the credential digest to show in 1AM approval modal
    const payload = JSON.stringify({
      companyName,
      registrationNumber: regNumber || "REG-" + Math.floor(100000 + Math.random() * 900000),
      jurisdiction,
      frameworks,
      solvencyTier,
    });

    const cHash = await sha256Hex(payload);
    setComputedCommitment("0x" + cHash);
    setModalStatus("awaiting_approval");
    setModalError(null);
    setIsVerifyModalOpen(true);

    // Trigger execution
    executeRegisterFlow();
  };

  const executeRegisterFlow = async () => {
    setIsSubmitting(true);
    setModalStatus("awaiting_approval");

    try {
      const client = getClient();
      const input: VendorRegistrationInput = {
        companyName,
        jurisdiction,
        registrationNumber: regNumber || "REG-" + Math.floor(100000 + Math.random() * 900000),
        solvencyTier,
        complianceScore,
        frameworks,
      };

      setModalStatus("submitting");
      const result = await client.registerVendor(input);
      setSubmitResult(result);
      setModalStatus("confirmed");
      setIsVerifyModalOpen(false);
    } catch (err: any) {
      const msg = err?.message || "Failed to register vendor accreditation proof";
      setSubmitError(msg);
      setModalError(msg);
      setModalStatus("rejected");
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
      const res = await client.verifyAccreditationDual(verifyQuery.trim());
      setVerifyResult(res);
    } catch (err: any) {
      setVerifyResult({
        valid: false,
        status: "Error",
        commitment: verifyQuery,
        details: err?.message || "Verification query failed",
        mode: "unknown",
        source: "client",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "2.5rem 2rem 5rem" }}>
      {/* Page Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div className="pill-release-badge" style={{ marginBottom: "1rem" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>zero-knowledge supplier due diligence</span>
        </div>
        <h1 style={{ fontSize: "2.6rem", fontWeight: 800, letterSpacing: "-0.04em", color: "#0a0d14", marginBottom: "0.6rem" }}>
          confidential vendor verification
        </h1>
        <p style={{ color: "#52525b", maxWidth: 620, margin: "0 auto", fontSize: "1.02rem", lineHeight: 1.6 }}>
          Register confidential compliance accreditations verified through your 1AM Wallet or inspect live on-chain credentials with zero-knowledge privacy.
        </p>

        {/* Tab Switcher */}
        <div style={{ display: "inline-flex", background: "#f1f5f9", padding: "0.3rem", borderRadius: 9999, marginTop: "1.75rem", border: "1px solid #e2e8f0" }}>
          <button
            onClick={() => setActiveTab("register")}
            style={{
              padding: "0.55rem 1.6rem",
              borderRadius: 9999,
              border: "none",
              background: activeTab === "register" ? "#0f172a" : "transparent",
              color: activeTab === "register" ? "#ffffff" : "#64748b",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            register vendor
          </button>
          <button
            onClick={() => setActiveTab("verify")}
            style={{
              padding: "0.55rem 1.6rem",
              borderRadius: 9999,
              border: "none",
              background: activeTab === "verify" ? "#0f172a" : "transparent",
              color: activeTab === "verify" ? "#ffffff" : "#64748b",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            dual verification
          </button>
        </div>
      </div>

      {/* ─── TAB 1: REGISTER VENDOR ────────────────────────────────────── */}
      {activeTab === "register" && (
        <div className="paper-panel" style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ marginBottom: "1.8rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1.2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0d14" }}>
                vendor accreditation pledge
              </h2>
              <p style={{ fontSize: "0.84rem", color: "#64748b", marginTop: "0.2rem" }}>
                Private witnesses are evaluated strictly in browser memory. Every transaction requires your explicit authorization in 1AM Wallet.
              </p>
            </div>

            {walletAddress ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", background: "#f8fafc", padding: "0.35rem 0.8rem", borderRadius: 9999, border: "1px solid #e2e8f0", fontSize: "0.78rem", fontWeight: 600 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
                <span>1AM: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsConnectModalOpen(true)}
                className="btn-pill-white"
                style={{ padding: "0.35rem 0.85rem", fontSize: "0.78rem" }}
              >
                + connect 1am wallet
              </button>
            )}
          </div>

          {submitError && (
            <div style={{ padding: "0.9rem 1.1rem", borderRadius: 14, background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: "0.84rem", marginBottom: "1.5rem" }}>
              <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>Verification Notice:</div>
              <div>{submitError}</div>
            </div>
          )}

          {submitResult && (
            <div className="paper-panel-subtle" style={{ border: "1px solid #86efac", background: "#f0fdf4", marginBottom: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 4.5L6.5 11.5L3 8" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "#065f46" }}>
                  Verified by 1AM Wallet & Confirmed On-Chain!
                </span>
              </div>
              <p style={{ fontSize: "0.84rem", color: "#047857", marginBottom: "0.8rem", lineHeight: 1.5 }}>
                Vendor qualification threshold mathematically proven on Midnight Preview testnet.
              </p>
              <div style={{ fontSize: "0.78rem", fontFamily: "monospace", color: "#334155", wordBreak: "break-all" }}>
                <div><strong>Commitment:</strong> {submitResult.commitment}</div>
                <div><strong>TxHash:</strong> {submitResult.txHash}</div>
                <div><strong>Signed By:</strong> {walletAddress || "1AM Wallet"}</div>
                <div><strong>Status:</strong> Confirmed on Midnight Ledger</div>
              </div>
            </div>
          )}

          <form onSubmit={handlePreSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
              <div>
                <label className="paper-label">company legal name</label>
                <input
                  type="text"
                  className="paper-input"
                  placeholder="e.g. Acme Cyber Systems Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="paper-label">regulatory jurisdiction</label>
                <select
                  className="paper-input"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                >
                  <option value="US-DE">United States (Delaware)</option>
                  <option value="US-CA">United States (California)</option>
                  <option value="EU-DE">European Union (Germany)</option>
                  <option value="UK-GB">United Kingdom (London)</option>
                  <option value="SG-SG">Singapore</option>
                  <option value="CH-ZH">Switzerland (Zurich)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
              <div>
                <label className="paper-label">tax / registration number</label>
                <input
                  type="text"
                  className="paper-input"
                  placeholder="e.g. EIN-84-9182390"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                />
              </div>

              <div>
                <label className="paper-label">solvency & balance sheet tier</label>
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
                  {complianceScore} / 100 {complianceScore >= 75 ? "✓ Eligible" : "⚠ Below Threshold"}
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
                      {selected ? "✓ " : "+ "}{fw}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-pill-black"
              style={{ width: "100%", padding: "0.85rem", fontSize: "0.96rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              <span>{isSubmitting ? "Waiting for 1AM Wallet approval..." : "verify with 1am wallet & pledge"}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* ─── TAB 2: DUAL VERIFICATION ENGINE ───────────────────────────── */}
      {activeTab === "verify" && (
        <div className="paper-panel" style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ marginBottom: "1.8rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1.2rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0d14" }}>
              dual verification engine
            </h2>
            <p style={{ fontSize: "0.84rem", color: "#64748b", marginTop: "0.2rem" }}>
              Verify supplier accreditation validity using either 32-Byte ZK Commitment Hash, Contract Address, or On-Chain Transaction Hash.
            </p>
          </div>

          <form onSubmit={handleVerify} style={{ marginBottom: "2rem" }}>
            <label className="paper-label">enter zk commitment, contract address, or on-chain txhash</label>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <input
                type="text"
                className="paper-input"
                placeholder="0xf300c8ef23885f1cc04e6879ec5085f0845eff81c79d5ef6066f176af11df09f"
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

              {verifyResult.valid ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "1.1rem", fontWeight: 800, color: "#166534", marginBottom: "0.4rem" }}>
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path d="M13.5 4.5L6.5 11.5L3 8" stroke="#166534" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Accreditation Confirmed Active on Midnight</span>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "1.1rem", fontWeight: 800, color: "#991b1b", marginBottom: "0.4rem" }}>
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4L12 12M12 4L4 12" stroke="#991b1b" strokeWidth="2.2" strokeLinecap="round"/>
                  </svg>
                  <span>Accreditation Invalid or Revoked</span>
                </div>
              )}

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

      {/* 1AM Wallet Transaction Verification Modal */}
      <TransactionVerifyModal
        isOpen={isVerifyModalOpen}
        actionTitle="Vendor Accreditation Pledge"
        circuitName="registerVendor"
        commitment={computedCommitment}
        details={{
          "Company": companyName,
          "Jurisdiction": jurisdiction,
          "Audited Score": `${complianceScore} / 100 (Threshold >= 75)`,
          "Frameworks": frameworks.join(", "),
        }}
        walletAddress={walletAddress}
        walletName={walletName}
        status={modalStatus}
        errorMsg={modalError}
        onApprove={executeRegisterFlow}
        onCancel={() => {
          setIsVerifyModalOpen(false);
          setIsSubmitting(false);
          setModalStatus("idle");
        }}
      />

      {/* Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnected={(addr, name) => {
          setWalletAddress(addr);
          setWalletName(name);
          setSubmitError(null);
        }}
      />
    </div>
  );
}
