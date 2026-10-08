import { useState } from "react";
import { Globe, ExternalLink, Shield, Info, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import type { DataProvenance } from "../../lib/space-data-engine";
import { Button } from "../ui/button";

interface SpaceDataProvenanceBadgeProps {
  provenance: DataProvenance;
  className?: string;
  style?: React.CSSProperties | undefined;
  compact?: boolean | undefined;
}

export function SpaceDataProvenanceBadge({
  provenance,
  className = "",
  style,
  compact = false,
}: SpaceDataProvenanceBadgeProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const statusColor =
    provenance.status === "LIVE"
      ? "#10b981"
      : provenance.status === "CACHED"
      ? "#f59e0b"
      : provenance.status === "AVAILABLE"
      ? "#38bdf8"
      : "#94a3b8";

  return (
    <>
      <div
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${className}`}
        style={{
          background: "rgba(10, 25, 47, 0.75)",
          border: `1px solid ${statusColor}40`,
          color: "#e2f1ff",
          backdropFilter: "blur(6px)",
          boxShadow: `0 0 10px ${statusColor}15`,
          ...style,
        }}
      >
        <span style={{ fontSize: "12px" }}>{provenance.countryFlag}</span>
        <span style={{ fontWeight: 700, color: "#fff" }}>{provenance.agency}</span>
        {!compact && (
          <span style={{ color: "#94a3b8", fontSize: "10px", margin: "0 2px" }}>·</span>
        )}
        {!compact && (
          <span style={{ color: "#cbd5e1", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {provenance.dataset}
          </span>
        )}
        <span
          style={{
            fontSize: "9px",
            fontWeight: 800,
            padding: "1px 5px",
            borderRadius: "4px",
            background: `${statusColor}22`,
            color: statusColor,
            border: `1px solid ${statusColor}55`,
            letterSpacing: "0.08em",
          }}
        >
          {provenance.status}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setModalOpen(true);
          }}
          title="View Data Provenance & Official Source"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#38bdf8",
            padding: "2px 4px",
            fontSize: "10px",
            fontWeight: 600,
            textDecoration: "underline",
            marginLeft: "2px",
          }}
        >
          VIEW SOURCE
        </button>
      </div>

      {modalOpen && (
        <div
          className="gm-backdrop"
          onClick={() => setModalOpen(false)}
          style={{ zIndex: 10000, display: "grid", placeItems: "center" }}
        >
          <div
            className="gm-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(92vw, 560px)",
              background: "#081428f5",
              border: `1px solid ${statusColor}60`,
              borderRadius: "14px",
              padding: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.85)",
              color: "#e2f1ff",
              fontSize: "13px",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "22px" }}>{provenance.countryFlag}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                    {provenance.agency} — {provenance.dataset}
                  </h3>
                  <p style={{ margin: 0, fontSize: "11px", color: "#8dafd8" }}>
                    {provenance.agencyFullName} ({provenance.country})
                  </p>
                </div>
              </div>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  padding: "3px 8px",
                  borderRadius: "6px",
                  background: `${statusColor}25`,
                  color: statusColor,
                  border: `1px solid ${statusColor}70`,
                  letterSpacing: "0.08em",
                }}
              >
                {provenance.status}
              </span>
            </div>

            {/* Content Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <b style={{ color: "#74b3ff", fontSize: "11px", display: "block", marginBottom: "4px" }}>
                  MISSION FORGE USE CASE
                </b>
                <p style={{ margin: 0, fontSize: "12px", color: "#cbd5e1", lineHeight: 1.5 }}>
                  {provenance.missionForgeUseCase}
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px" }}>
                <div style={{ background: "rgba(255,255,255,0.03)", padding: "8px", borderRadius: "6px" }}>
                  <span style={{ color: "#8dafd8", fontSize: "10px", display: "block" }}>RETRIEVED AT (UTC)</span>
                  <span style={{ fontFamily: "monospace", color: "#e2f1ff", fontSize: "11px" }}>
                    {provenance.retrievedAt.slice(0, 19).replace("T", " ")}
                  </span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", padding: "8px", borderRadius: "6px" }}>
                  <span style={{ color: "#8dafd8", fontSize: "10px", display: "block" }}>LICENSE / ACCESS</span>
                  <span style={{ color: "#a5f3fc", fontSize: "11px", fontWeight: 600 }}>
                    {provenance.license}
                  </span>
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", padding: "8px", borderRadius: "6px" }}>
                <span style={{ color: "#8dafd8", fontSize: "10px", display: "block" }}>API / DATA ENDPOINT</span>
                <span style={{ fontFamily: "monospace", color: "#38bdf8", fontSize: "11px", wordBreak: "break-all" }}>
                  {provenance.apiUrl}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "12px" }}>
              <a
                href={provenance.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#38bdf8",
                  fontSize: "12px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <span>Visit Official Agency Portal</span>
                <ExternalLink size={13} />
              </a>
              <Button size="sm" onClick={() => setModalOpen(false)}>
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
