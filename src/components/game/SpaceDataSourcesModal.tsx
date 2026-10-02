import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  X,
  ExternalLink,
  Globe,
  Radio,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Database,
  Shield,
  Layers,
  Sparkles,
  Info,
  Server,
  Zap,
} from "lucide-react";
import {
  SPACE_AGENCIES,
  SPACE_DATA_SOURCES,
  filterSpaceDataSources,
  getSpaceDataAuditStats,
  getAgencyAuditSummaries,
  type AgencyId,
  type AgencyPartnerTier,
  type DataCategory,
  type IntegrationStatus,
  type SpaceDataSource,
} from "../../lib/space-data-catalog";
import {
  getNormalizedSpaceWeather,
  getNormalizedMarsAtmosphere,
  getNormalizedLunarLandingSite,
  getNormalizedAsteroidTarget,
} from "../../lib/space-data-engine";
import { SpaceDataProvenanceBadge } from "./SpaceDataProvenanceBadge";
import { Button } from "../ui/button";

interface SpaceDataSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAgency?: AgencyId | undefined;
}

export function SpaceDataSourcesModal({ isOpen, onClose, initialAgency }: SpaceDataSourcesModalProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"registry" | "agencies" | "live-feeds" | "transparency">("registry");
  const [selectedAgency, setSelectedAgency] = useState<AgencyId | "ALL">(initialAgency ?? "ALL");
  const [selectedTier, setSelectedTier] = useState<AgencyPartnerTier | "ALL">("ALL");
  const [selectedDataType, setSelectedDataType] = useState<DataCategory | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<IntegrationStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = useMemo(() => getSpaceDataAuditStats(), []);
  const agencySummaries = useMemo(() => getAgencyAuditSummaries(), []);

  const filteredSources = useMemo(() => {
    return filterSpaceDataSources({
      agency: selectedAgency,
      tier: selectedTier,
      dataType: selectedDataType,
      status: selectedStatus,
      search: searchQuery,
    });
  }, [selectedAgency, selectedTier, selectedDataType, selectedStatus, searchQuery]);

  // Normalized live/cached telemetry samples
  const spaceWeather = useMemo(() => getNormalizedSpaceWeather(), []);
  const marsAtmo = useMemo(() => getNormalizedMarsAtmosphere(), []);
  const lunarSouthPole = useMemo(() => getNormalizedLunarLandingSite("south-pole"), []);
  const ryuguAsteroid = useMemo(() => getNormalizedAsteroidTarget("ryugu"), []);

  if (!isOpen) return null;

  const getStatusBadge = (status: IntegrationStatus) => {
    switch (status) {
      case "LIVE":
        return {
          bg: "rgba(16, 185, 129, 0.2)",
          color: "#34d399",
          border: "rgba(16, 185, 129, 0.5)",
          label: "LIVE CONNECTION",
          desc: "Actually connected and returning current data.",
        };
      case "CACHED":
        return {
          bg: "rgba(245, 158, 11, 0.2)",
          color: "#fbbf24",
          border: "rgba(245, 158, 11, 0.5)",
          label: "CACHED OFFICIAL",
          desc: "Previously retrieved official data stored locally.",
        };
      case "AVAILABLE":
        return {
          bg: "rgba(56, 189, 248, 0.2)",
          color: "#38bdf8",
          border: "rgba(56, 189, 248, 0.5)",
          label: "AVAILABLE PORTAL",
          desc: "Official source discovered and verified, public interface available.",
        };
      case "DEMO":
        return {
          bg: "rgba(168, 85, 247, 0.2)",
          color: "#c084fc",
          border: "rgba(168, 85, 247, 0.5)",
          label: "DEMO SPECIMEN",
          desc: "Synthetic / static demonstration data.",
        };
      case "UNAVAILABLE":
      default:
        return {
          bg: "rgba(148, 163, 184, 0.15)",
          color: "#94a3b8",
          border: "rgba(148, 163, 184, 0.3)",
          label: "NO PUBLIC API",
          desc: "DISCOVERED — NO VERIFIED PUBLIC API FOUND.",
        };
    }
  };

  return (
    <div
      className="gm-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="spacedata-title"
      style={{ zIndex: 9999 }}
    >
      <section
        className="gm-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(96vw, 1120px)",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          background: "#040b1df2",
          border: "1px solid #1e3a6d",
          borderRadius: "16px",
          boxShadow: "0 25px 70px rgba(0,0,0,0.85), 0 0 50px rgba(28, 77, 150, 0.25)",
          backdropFilter: "blur(24px)",
          color: "#e6f1ff",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #142e58",
            paddingBottom: "16px",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                display: "grid",
                placeItems: "center",
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(14, 165, 233, 0.15)",
                color: "#38bdf8",
                border: "1px solid rgba(56, 189, 248, 0.35)",
              }}
            >
              <Globe size={22} />
            </span>
            <div>
              <h2
                id="spacedata-title"
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>GLOBAL SPACE DATA CATALOG</span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "20px",
                    background: "rgba(56, 189, 248, 0.15)",
                    color: "#38bdf8",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                  }}
                >
                  NASA + 17 AGENCY PARTNERS
                </span>
              </h2>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8dafd8" }}>
                NASA Space Apps Challenge 2026 · Official Multi-Agency Telemetry & Provenance Hub
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Space Data Sources"
            style={{
              background: "transparent",
              border: "none",
              color: "#8dafd8",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "6px",
            }}
          >
            <X size={22} />
          </button>
        </header>

        {/* Global Statistics Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <div style={{ background: "rgba(8, 24, 52, 0.6)", padding: "8px 12px", borderRadius: "8px", border: "1px solid #143566" }}>
            <span style={{ fontSize: "10px", color: "#8dafd8", display: "block" }}>DISCOVERED SOURCES</span>
            <b style={{ fontSize: "17px", color: "#fff" }}>{stats.totalSources}</b>
            <small style={{ color: "#74b3ff", display: "block", fontSize: "10px" }}>Across {stats.totalAgencies} Agencies</small>
          </div>
          <div style={{ background: "rgba(8, 24, 52, 0.6)", padding: "8px 12px", borderRadius: "8px", border: "1px solid #143566" }}>
            <span style={{ fontSize: "10px", color: "#8dafd8", display: "block" }}>INTEGRATED SOURCES</span>
            <b style={{ fontSize: "17px", color: "#38bdf8" }}>{stats.integrated}</b>
            <small style={{ color: "#7dd3fc", display: "block", fontSize: "10px" }}>Live & Cached in Code</small>
          </div>
          <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
            <span style={{ fontSize: "10px", color: "#6ee7b7", display: "block" }}>LIVE CONNECTIONS</span>
            <b style={{ fontSize: "17px", color: "#10b981" }}>{stats.live}</b>
            <small style={{ color: "#a7f3d0", display: "block", fontSize: "10px" }}>Real-time Querying</small>
          </div>
          <div style={{ background: "rgba(245, 158, 11, 0.1)", padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
            <span style={{ fontSize: "10px", color: "#fcd34d", display: "block" }}>CACHED OFFICIAL</span>
            <b style={{ fontSize: "17px", color: "#f59e0b" }}>{stats.cached}</b>
            <small style={{ color: "#fde68a", display: "block", fontSize: "10px" }}>3D & Mission Data</small>
          </div>
          <div style={{ background: "rgba(56, 189, 248, 0.1)", padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(56, 189, 248, 0.3)" }}>
            <span style={{ fontSize: "10px", color: "#7dd3fc", display: "block" }}>AVAILABLE PORTALS</span>
            <b style={{ fontSize: "17px", color: "#38bdf8" }}>{stats.available}</b>
            <small style={{ color: "#bae6fd", display: "block", fontSize: "10px" }}>Open Scientific Portals</small>
          </div>
          <div style={{ background: "rgba(148, 163, 184, 0.1)", padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(148, 163, 184, 0.25)" }}>
            <span style={{ fontSize: "10px", color: "#cbd5e1", display: "block" }}>NO PUBLIC API</span>
            <b style={{ fontSize: "17px", color: "#94a3b8" }}>{stats.unavailable}</b>
            <small style={{ color: "#e2e8f0", display: "block", fontSize: "10px" }}>Institutional Only</small>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav
          style={{
            display: "flex",
            gap: "8px",
            borderBottom: "1px solid #142e58",
            paddingBottom: "12px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          {[
            { id: "registry", label: `Space Data Sources (${filteredSources.length})`, icon: <Database size={15} /> },
            { id: "agencies", label: `18 Agency Partners Network`, icon: <Globe size={15} /> },
            { id: "live-feeds", label: `Normalized Multi-Agency Feeds`, icon: <Radio size={15} /> },
            { id: "transparency", label: `Compliance & Disclaimers`, icon: <Shield size={15} /> },
          ].map((tItem) => (
            <button
              key={tItem.id}
              onClick={() => setTab(tItem.id as any)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                background: tab === tItem.id ? "#1b4f9c" : "rgba(10, 29, 61, 0.6)",
                color: tab === tItem.id ? "#ffffff" : "#8eb3e2",
                boxShadow: tab === tItem.id ? "0 0 16px rgba(45, 127, 249, 0.4)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              {tItem.icon}
              {tItem.label}
            </button>
          ))}
        </nav>

        {/* TAB 1: MASTER DATA SOURCES REGISTRY */}
        {tab === "registry" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Filter Bar */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                background: "rgba(6, 19, 44, 0.6)",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #163666",
                marginBottom: "12px",
                alignItems: "center",
              }}
            >
              {/* Search */}
              <div style={{ flex: "1 1 200px", position: "relative" }}>
                <Search
                  size={14}
                  style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#8dafd8" }}
                />
                <input
                  type="text"
                  placeholder="Search dataset, mission, agency, or use case..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7px 10px 7px 32px",
                    background: "rgba(10, 25, 52, 0.8)",
                    border: "1px solid #1c4585",
                    borderRadius: "6px",
                    color: "#fff",
                    fontSize: "12px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Agency Selector */}
              <select
                value={selectedAgency}
                onChange={(e) => setSelectedAgency(e.target.value as any)}
                style={{
                  padding: "7px 10px",
                  background: "rgba(10, 25, 52, 0.8)",
                  border: "1px solid #1c4585",
                  borderRadius: "6px",
                  color: "#e2f1ff",
                  fontSize: "12px",
                }}
              >
                <option value="ALL">All 18 Agencies</option>
                {Object.values(SPACE_AGENCIES).map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.countryFlag} {a.name} ({a.country})
                  </option>
                ))}
              </select>

              {/* Scope / Tier */}
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value as any)}
                style={{
                  padding: "7px 10px",
                  background: "rgba(10, 25, 52, 0.8)",
                  border: "1px solid #1c4585",
                  borderRadius: "6px",
                  color: "#e2f1ff",
                  fontSize: "12px",
                }}
              >
                <option value="ALL">All Tiers (NASA & Partners)</option>
                <option value="NASA">NASA Only</option>
                <option value="SPACE AGENCY PARTNER">17 Agency Partners Only</option>
              </select>

              {/* Data Type */}
              <select
                value={selectedDataType}
                onChange={(e) => setSelectedDataType(e.target.value as any)}
                style={{
                  padding: "7px 10px",
                  background: "rgba(10, 25, 52, 0.8)",
                  border: "1px solid #1c4585",
                  borderRadius: "6px",
                  color: "#e2f1ff",
                  fontSize: "12px",
                }}
              >
                <option value="ALL">All Data Types</option>
                <option value="PLANETARY">Planetary</option>
                <option value="TRAJECTORY">Trajectory & Ephemeris</option>
                <option value="PLANETARY MISSIONS">Planetary Missions</option>
                <option value="EARTH OBSERVATION">Earth Observation</option>
                <option value="SPACE WEATHER">Space Weather</option>
                <option value="SPACECRAFT">Spacecraft</option>
                <option value="ASTRONOMY">Astronomy</option>
                <option value="3D">3D Models & Textures</option>
              </select>

              {/* Status */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                style={{
                  padding: "7px 10px",
                  background: "rgba(10, 25, 52, 0.8)",
                  border: "1px solid #1c4585",
                  borderRadius: "6px",
                  color: "#e2f1ff",
                  fontSize: "12px",
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="LIVE">LIVE Only</option>
                <option value="CACHED">CACHED Only</option>
                <option value="AVAILABLE">AVAILABLE Only</option>
                <option value="UNAVAILABLE">NO PUBLIC API Only</option>
              </select>

              {(selectedAgency !== "ALL" ||
                selectedTier !== "ALL" ||
                selectedDataType !== "ALL" ||
                selectedStatus !== "ALL" ||
                searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedAgency("ALL");
                    setSelectedTier("ALL");
                    setSelectedDataType("ALL");
                    setSelectedStatus("ALL");
                    setSearchQuery("");
                  }}
                  style={{ fontSize: "11px", height: "30px", padding: "0 8px" }}
                >
                  Reset
                </Button>
              )}
            </div>

            {/* Source Cards List */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", paddingRight: "6px" }}>
              {filteredSources.map((source) => {
                const b = getStatusBadge(source.integrationStatus);
                return (
                  <div
                    key={source.id}
                    style={{
                      background: "rgba(8, 22, 48, 0.65)",
                      border: "1px solid #173666",
                      borderRadius: "10px",
                      padding: "14px 16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span style={{ fontSize: "18px" }}>{source.countryFlag}</span>
                          <span style={{ fontWeight: 700, color: "#fff", fontSize: "14px" }}>
                            {source.agency} — {source.dataset}
                          </span>
                          <span
                            style={{
                              fontSize: "10px",
                              padding: "1px 6px",
                              borderRadius: "4px",
                              background: "rgba(255,255,255,0.08)",
                              color: "#cbd5e1",
                            }}
                          >
                            {source.dataType}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: "11px", color: "#8dafd8" }}>
                          <b>{source.agencyName}</b> · {source.country} · Mission: <i>{source.mission}</i>
                        </p>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          title={b.desc}
                          style={{
                            fontSize: "10px",
                            fontWeight: 800,
                            padding: "3px 8px",
                            borderRadius: "6px",
                            background: b.bg,
                            color: b.color,
                            border: `1px solid ${b.border}`,
                            letterSpacing: "0.05em",
                          }}
                        >
                          {b.label}
                        </span>
                      </div>
                    </div>

                    {/* Mission Forge Simulation Role */}
                    <div style={{ background: "rgba(0, 0, 0, 0.25)", padding: "8px 12px", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.05)", fontSize: "12px" }}>
                      <span style={{ color: "#74b3ff", fontWeight: 600, marginRight: "6px" }}>MISSION FORGE INTEGRATION:</span>
                      <span style={{ color: "#cbd5e1" }}>{source.missionForgeUseCase}</span>
                    </div>

                    {/* Technical Specs Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "6px", fontSize: "11px", color: "#8dafd8" }}>
                      <div><b>Access:</b> {source.accessMethod}</div>
                      <div><b>Auth:</b> {source.authRequired}</div>
                      <div><b>Format:</b> {source.format}</div>
                      <div><b>Frequency:</b> {source.updateFrequency}</div>
                    </div>

                    {/* Footer Actions & Links */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "8px", marginTop: "2px", flexWrap: "wrap", gap: "6px" }}>
                      <span style={{ fontSize: "11px", color: "#64748b", fontStyle: "italic" }}>
                        {source.verifiedNotes}
                      </span>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {source.documentationUrl && (
                          <a
                            href={source.documentationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "11px",
                              color: "#38bdf8",
                              textDecoration: "none",
                              padding: "4px 8px",
                              background: "rgba(56, 189, 248, 0.1)",
                              borderRadius: "4px",
                              border: "1px solid rgba(56, 189, 248, 0.2)",
                            }}
                          >
                            <span>Docs</span>
                            <ExternalLink size={10} />
                          </a>
                        )}
                        <a
                          href={source.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "11px",
                            color: "#e2f1ff",
                            textDecoration: "none",
                            padding: "4px 8px",
                            background: "rgba(255, 255, 255, 0.08)",
                            borderRadius: "4px",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                          }}
                        >
                          <span>Official Portal</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: 18 AGENCY PARTNERS NETWORK */}
        {tab === "agencies" && (
          <div style={{ flex: 1, overflowY: "auto", paddingRight: "6px" }}>
            <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#a5c2e8", lineHeight: 1.6 }}>
              In the <b>NASA Space Apps Challenge 2026</b>, NASA collaborates with 17 global Space Agency Partners
              to provide open science, satellite observation, and planetary mission datasets for international problem solvers.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "12px" }}>
              {agencySummaries.map((agency) => (
                <div
                  key={agency.id}
                  style={{
                    background: "rgba(8, 22, 48, 0.65)",
                    border: "1px solid #173666",
                    borderRadius: "10px",
                    padding: "14px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "24px" }}>{agency.countryFlag}</span>
                        <div>
                          <b style={{ color: "#fff", fontSize: "14px" }}>{agency.name}</b>
                          <div style={{ fontSize: "11px", color: "#74b3ff" }}>{agency.country}</div>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: "9px",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: agency.tier === "NASA" ? "rgba(35, 116, 225, 0.25)" : "rgba(56, 189, 248, 0.15)",
                          color: agency.tier === "NASA" ? "#60a5fa" : "#38bdf8",
                          border: "1px solid rgba(56, 189, 248, 0.3)",
                        }}
                      >
                        {agency.tier}
                      </span>
                    </div>

                    <p style={{ margin: "6px 0 10px", fontSize: "11px", color: "#8dafd8", lineHeight: 1.5 }}>
                      {agency.description}
                    </p>

                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px", fontSize: "10px" }}>
                      <span style={{ padding: "2px 6px", borderRadius: "4px", background: "rgba(255,255,255,0.06)", color: "#c9d1d9" }}>
                        Discovered: <b>{agency.discovered}</b>
                      </span>
                      {agency.live > 0 && (
                        <span style={{ padding: "2px 6px", borderRadius: "4px", background: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.4)" }}>
                          Live: <b>{agency.live}</b>
                        </span>
                      )}
                      {agency.available > 0 && (
                        <span style={{ padding: "2px 6px", borderRadius: "4px", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.4)" }}>
                          Available: <b>{agency.available}</b>
                        </span>
                      )}
                      {agency.unavailable > 0 && (
                        <span style={{ padding: "2px 6px", borderRadius: "4px", background: "rgba(148, 163, 184, 0.1)", color: "#94a3b8" }}>
                          No Public API: <b>{agency.unavailable}</b>
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "8px" }}>
                    <button
                      onClick={() => {
                        setSelectedAgency(agency.id);
                        setTab("registry");
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#38bdf8",
                        fontSize: "11px",
                        cursor: "pointer",
                        fontWeight: 600,
                        padding: 0,
                      }}
                    >
                      Filter Catalog ({agency.discovered}) →
                    </button>
                    <a
                      href={agency.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#8dafd8", display: "flex", alignItems: "center", gap: "3px", fontSize: "11px", textDecoration: "none" }}
                    >
                      <span>Website</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: NORMALIZED MULTI-AGENCY LIVE FEEDS */}
        {tab === "live-feeds" && (
          <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "14px", paddingRight: "6px" }}>
            {/* Feed 1: Space Weather */}
            <div style={{ background: "rgba(8, 22, 48, 0.7)", border: "1px solid #173666", borderRadius: "10px", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <b style={{ color: "#fff", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Zap size={16} color="#fbbf24" /> Space Weather Hazard Normalizer
                </b>
                <SpaceDataProvenanceBadge provenance={spaceWeather.provenance} compact />
              </div>
              <p style={{ margin: "0 0 10px", fontSize: "11px", color: "#8dafd8" }}>
                Normalized solar flare & radiation hazard index derived from <b>NASA DONKI</b> and <b>ESA SWE</b>.
              </p>
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "6px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <div><b>Solar Flare Activity:</b> <span style={{ color: "#fbbf24" }}>{spaceWeather.solarFlareClass}</span></div>
                <div><b>Geomagnetic Kp Index:</b> {spaceWeather.geomagneticActivityIndex} / 9</div>
                <div><b>Radiation Hazard Level:</b> <span style={{ color: spaceWeather.radiationBeltHazard === "NOMINAL" ? "#34d399" : "#f87171" }}>{spaceWeather.radiationBeltHazard}</span></div>
                <div><b>Deep Space Comms Risk:</b> {spaceWeather.commsDegradationRisk}% degradation</div>
              </div>
            </div>

            {/* Feed 2: Mars Atmospheric Telemetry */}
            <div style={{ background: "rgba(8, 22, 48, 0.7)", border: "1px solid #173666", borderRadius: "10px", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <b style={{ color: "#fff", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Globe size={16} color="#f87171" /> Mars Diurnal Atmosphere Model
                </b>
                <SpaceDataProvenanceBadge provenance={marsAtmo.provenance} compact />
              </div>
              <p style={{ margin: "0 0 10px", fontSize: "11px", color: "#8dafd8" }}>
                Diurnal atmospheric density profile derived from <b>MBRSC Emirates Mars Mission (Hope Probe)</b> & <b>Spain CAB MEDA</b>.
              </p>
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "6px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <div><b>Surface Atmospheric Pressure:</b> {marsAtmo.surfacePressurePa} Pa (6.36 mbar)</div>
                <div><b>Mean Surface Temperature:</b> {marsAtmo.surfaceTempKelvin} K (-58°C)</div>
                <div><b>Atmospheric Scale Height:</b> {marsAtmo.scaleHeightKm} km</div>
                <div><b>Hydrogen Exosphere Loss Rate:</b> {marsAtmo.exosphereLossRateH2KgSec.toExponential(2)} particles/sec</div>
                <div><b>Dust Optical Depth (Tau):</b> {marsAtmo.dustOpticalDepthTau} (Clear sky)</div>
              </div>
            </div>

            {/* Feed 3: Lunar South Pole Surface Telemetry */}
            <div style={{ background: "rgba(8, 22, 48, 0.7)", border: "1px solid #173666", borderRadius: "10px", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <b style={{ color: "#fff", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Server size={16} color="#38bdf8" /> Lunar South Pole Landing Site
                </b>
                <SpaceDataProvenanceBadge provenance={lunarSouthPole.provenance} compact />
              </div>
              <p style={{ margin: "0 0 10px", fontSize: "11px", color: "#8dafd8" }}>
                In-situ regolith thermal conductivity from <b>ISRO Chandrayaan-3 Vikram (ChaSTE)</b> & <b>KASA Danuri</b>.
              </p>
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "6px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <div><b>Landing Site:</b> {lunarSouthPole.siteName}</div>
                <div><b>Coordinates:</b> {lunarSouthPole.latitudeDeg}°S, {lunarSouthPole.longitudeDeg}°E</div>
                <div><b>Subsurface Temperature (-10cm):</b> {lunarSouthPole.subsurfaceTempKelvin} K (-13°C)</div>
                <div><b>Polar Ice Likelihood (ShadowCam):</b> {lunarSouthPole.permanentlyShadowedWaterIceLikelihood}%</div>
                <div><b>Touchdown Slope Tolerance:</b> {lunarSouthPole.touchdownSlopeMaxDeg}° max slope</div>
              </div>
            </div>

            {/* Feed 4: Asteroid Physical Characteristics */}
            <div style={{ background: "rgba(8, 22, 48, 0.7)", border: "1px solid #173666", borderRadius: "10px", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <b style={{ color: "#fff", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={16} color="#c084fc" /> Asteroid Reconnaissance Model
                </b>
                <SpaceDataProvenanceBadge provenance={ryuguAsteroid.provenance} compact />
              </div>
              <p style={{ margin: "0 0 10px", fontSize: "11px", color: "#8dafd8" }}>
                Sample return trajectory & physical shape models from <b>JAXA Hayabusa2</b> & <b>NASA OSIRIS-REx</b>.
              </p>
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "6px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <div><b>Target Asteroid:</b> {ryuguAsteroid.name}</div>
                <div><b>Spectral Classification:</b> {ryuguAsteroid.spectralType}</div>
                <div><b>Mean Diameter:</b> {ryuguAsteroid.diameterMeters} meters</div>
                <div><b>Bulk Density:</b> {ryuguAsteroid.bulkDensityGPerCm3} g/cm³ (Rubble pile)</div>
                <div><b>Mission Heritage:</b> {ryuguAsteroid.sampleReturnHeritage}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COMPLIANCE & TRANSPARENCY */}
        {tab === "transparency" && (
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px", fontSize: "13px", color: "#b8d2f2", paddingRight: "6px" }}>
            <div style={{ background: "rgba(14, 43, 89, 0.4)", border: "1px solid #1f4f96", borderRadius: "10px", padding: "16px" }}>
              <h4 style={{ margin: "0 0 8px", color: "#fff", display: "flex", alignItems: "center", gap: "8px", fontSize: "15px" }}>
                <Shield size={18} color="#38bdf8" /> Multi-Agency Data Principles & Scientific Integrity
              </h4>
              <p style={{ margin: "0 0 10px", lineHeight: 1.6 }}>
                Mission Forge is developed for the <b>NASA Space Apps Challenge 2026</b> by <b>Team Ghost Hunter</b>.
                In strict adherence to the challenge rules and international open science standards:
              </p>
              <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px", lineHeight: 1.5 }}>
                <li>
                  <b>Zero Data Fabrication:</b> No APIs, endpoints, datasets, or numerical parameters are invented. Every source in the registry reflects an audited public domain or open government data offering from NASA or its 17 official Space Agency Partners.
                </li>
                <li>
                  <b>Explicit Status Transparency:</b> Sources are categorized strictly as <code>LIVE</code>, <code>CACHED</code>, <code>AVAILABLE</code>, <code>DEMO</code>, or <code>UNAVAILABLE</code>. If an agency does not provide a public REST API, it is explicitly cataloged as <em>DISCOVERED — NO VERIFIED PUBLIC API FOUND</em>.
                </li>
                <li>
                  <b>Visual vs. Scientific Decoupling:</b> 3D assets and cylindrical textures from NASA 3D Resources and agency portals provide visual immersion only. Spacecraft delta-v, fuel mass ratios, orbital ephemerides, and solar flux calculations are computed independently via the Tsiolkovsky rocket equation and Keplerian/JPL Horizons mechanics.
                </li>
                <li>
                  <b>Non-Endorsement Statement:</b> NASA and its Space Agency Partners (GGPEN, CONAE, BSA, AEB, CSA, ESA, ISRO, ASI, JAXA, KASA, NASRDA, AEP, ASES, AEE, TUA, MBRSC, UKSA) do not endorse Mission Forge, Team Ghost Hunter, or any non-agency software. Official insignia and emblems remain the property of their respective space organizations.
                </li>
              </ul>
            </div>

            <div style={{ background: "rgba(0, 0, 0, 0.3)", border: "1px solid #142e58", borderRadius: "10px", padding: "16px" }}>
              <h4 style={{ margin: "0 0 6px", color: "#fff", fontSize: "14px" }}>
                Team Ghost Hunter — NASA Space Apps Challenge 2026
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginTop: "10px", fontSize: "12px" }}>
                <div><b>Arefin Khan Siam</b> — Team Lead</div>
                <div><b>Melita Mehzabin Neha</b> — Technical</div>
                <div><b>Angkon Roy</b> — Technical</div>
                <div><b>Taspiha Tabassum</b> — UI/UX + Backend</div>
                <div><b>Rizvi Hasan</b> — Graphics</div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
