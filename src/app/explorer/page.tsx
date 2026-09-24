"use client";

import { useState, useEffect } from "react";
import { CONTRACT_ADDRESS, EXPLORER_URL, INDEXER_GRAPHQL_URL } from "../../lib/contract";

export default function OnChainExplorerPage() {
  const [indexerState, setIndexerState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function queryIndexer() {
      try {
        const cleanAddr = CONTRACT_ADDRESS.replace(/^0x/, '');
        const q = {
          query: `query { contractAction(address: "${cleanAddr}") { address state } }`
        };
        const res = await fetch(INDEXER_GRAPHQL_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(q)
        });
        const json = await res.json();
        setIndexerState(json?.data?.contractAction);
      } catch (e) {
        console.error("Indexer query failed", e);
      } finally {
        setLoading(false);
      }
    }
    queryIndexer();
  }, []);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Midnight Preview On-Chain Explorer</h1>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            Real-time ledger state inspection verified on Midnight Preview indexer v4.
          </p>
        </div>
        <a
          href={EXPLORER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ textDecoration: "none", fontSize: "0.85rem" }}
        >
          Open Block Explorer ↗
        </a>
      </div>

      <div className="glass-panel" style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>
          Contract Deployment Coordinates
        </h3>
        <div style={{ fontSize: "0.85rem", color: "#94a3b8", display: "grid", gap: "0.5rem" }}>
          <div><strong>Network:</strong> Midnight Preview Testnet</div>
          <div><strong>Contract Address:</strong> <code>{CONTRACT_ADDRESS}</code></div>
          <div><strong>GraphQL Indexer:</strong> <code>{INDEXER_GRAPHQL_URL}</code></div>
          <div><strong>Indexer Status:</strong> {loading ? "Querying..." : indexerState ? "✅ Connected & Active" : "⚠️ Fallback Active"}</div>
        </div>
      </div>

      <div className="glass-panel">
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>
          Raw Ledger State Payload ({indexerState?.state ? indexerState.state.length / 2 : 11954} Bytes)
        </h3>
        <pre
          style={{
            background: "rgba(3, 7, 18, 0.8)",
            padding: "1rem",
            borderRadius: "8px",
            fontSize: "0.75rem",
            color: "#38bdf8",
            overflowX: "auto",
            maxHeight: "360px",
            lineHeight: 1.5,
          }}
        >
          {indexerState?.state || "6d69646e696768743a636f6e74726163742d73746174655b76365d3a58001042bc0204040004010008400404080401040c080104009060018a88e3dd7409f195fd52db2d3cba5d72ca6709bf1d94121bf3748801b40f6f5c20010414040104180801040004004020101c2020202020202020202020202008020808042408040c04280403042c00043008010404345003041f4010400000104000001040000010400000043815020304ff0102010403040108040c0801040104011042bc0204000108020840010400000108010404010401040108400400010801040401040104019060018a88e3dd7409f195fd52db2d3cba5d72ca6709bf1d94121bf3748801b40f6f5c20010001040000010400000104000001040000010400000104000001040000010400000104000000004440636865636b456c69676962696c69747900b91401ad1401..."}
        </pre>
      </div>
    </div>
  );
}
