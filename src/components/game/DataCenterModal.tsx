import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, ExternalLink, Globe, Rocket, Compass, Radio, Shield, AlertTriangle, Database, Info, Sparkles, Box } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { getNasa, type NasaResult, type NasaSource } from "../../lib/nasa.functions";
import { NASA_SPACECRAFT_ARCHIVE, NASA_INSTRUMENTS_ARCHIVE, type SpacecraftRecord, type InstrumentRecord } from "../../lib/archives";
import { NASA_3D_ASSETS, NASA_PLANET_TEXTURES, AUDITED_REJECTED_ASSETS } from "../../lib/nasa-3d-registry";
import { SpaceDataSourcesModal } from "./SpaceDataSourcesModal";

interface DataCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "feeds" | "spacecraft" | "instruments" | "nasa3d" | "transparency";
}

type FeedItem = { result: NasaResult | null; parsed: any; loading: boolean };
type FeedKey = "apod" | "neo" | "donki" | "epic" | "mars" | "sbdb" | "sentry";
type FeedState = Record<FeedKey, FeedItem>;

export function DataCenterModal({ isOpen, onClose, initialTab = "feeds" }: DataCenterModalProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"feeds" | "spacecraft" | "instruments" | "nasa3d" | "transparency">(initialTab);
  const [globalDataOpen, setGlobalDataOpen] = useState(false);
  const callNasa = useServerFn(getNasa);

  // Live feed state
  const [feedData, setFeedData] = useState<FeedState>({
    apod: { result: null, parsed: null, loading: false },
    neo: { result: null, parsed: null, loading: false },
    donki: { result: null, parsed: null, loading: false },
    epic: { result: null, parsed: null, loading: false },
    mars: { result: null, parsed: null, loading: false },
    sbdb: { result: null, parsed: null, loading: false },
    sentry: { result: null, parsed: null, loading: false },
  });

  const [selectedCraft, setSelectedCraft] = useState<SpacecraftRecord>(NASA_SPACECRAFT_ARCHIVE[0]!);
  const [selectedInst, setSelectedInst] = useState<InstrumentRecord>(NASA_INSTRUMENTS_ARCHIVE[0]!);

  useEffect(() => {
    if (!isOpen) return;
    const fetchSource = async (source: FeedKey, arg?: string) => {
      setFeedData((prev) => ({ ...prev, [source]: { ...prev[source], loading: true } }));
      try {
        const res = await callNasa({ data: { source, arg } });
        let parsed = null;
        try {
          parsed = JSON.parse(res.data);
        } catch {
          parsed = null;
        }
        setFeedData((prev) => ({ ...prev, [source]: { result: res, parsed, loading: false } }));
      } catch {
        setFeedData((prev) => ({
          ...prev,
          [source]: {
            result: { source, live: false, cached: false, fetchedAt: new Date().toISOString(), data: "{}" },
            parsed: null,
            loading: false,
          },
        }));
      }
    };

    fetchSource("apod");
    fetchSource("neo");
    fetchSource("donki");
    fetchSource("epic");
    fetchSource("mars");
    fetchSource("sbdb", "Ceres");
    fetchSource("sentry");
  }, [isOpen, callNasa]);

  if (!isOpen) return null;

  return (
    <div className="gm-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="datacenter-title">
      <section
        className="gm-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(96vw, 980px)",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          background: "#050f24f2",
          border: "1px solid #1c3d73",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(16,78,168,0.3)",
          backdropFilter: "blur(20px)",
          color: "#e6f1ff",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #142e58", paddingBottom: "16px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ display: "grid", placeItems: "center", width: "36px", height: "36px", borderRadius: "8px", background: "rgba(35, 116, 225, 0.2)", color: "#4da3ff", border: "1px solid rgba(77, 163, 255, 0.3)" }}>
              <Database size={20} />
            </span>
            <div>
              <h2 id="datacenter-title" style={{ margin: 0, fontSize: "20px", fontWeight: 700, letterSpacing: "0.05em", color: "#fff" }}>
                NASA MISSION DATA CENTER & ARCHIVES
              </h2>
              <p style={{ margin: 0, fontSize: "12px", color: "#8dafd8" }}>
                NASA Space Apps Challenge 2026 · Scientific Telemetry & Provenance Hub
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => setGlobalDataOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "6px",
                background: "rgba(56, 189, 248, 0.15)",
                border: "1px solid rgba(56, 189, 248, 0.4)",
                color: "#38bdf8",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Globe size={13} />
              <span>18 Agency Partners</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close Data Center"
              style={{ background: "transparent", border: "none", color: "#8dafd8", cursor: "pointer", padding: "6px", borderRadius: "6px" }}
            >
              <X size={22} />
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav style={{ display: "flex", gap: "8px", borderBottom: "1px solid #142e58", paddingBottom: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
          {[
            { id: "feeds", label: "Live NASA APIs", icon: <Radio size={15} /> },
            { id: "spacecraft", label: "Spacecraft Library", icon: <Rocket size={15} /> },
            { id: "instruments", label: "Science Instruments", icon: <Sparkles size={15} /> },
            { id: "nasa3d", label: "NASA 3D Resources", icon: <Box size={15} /> },
            { id: "transparency", label: "Scientific Transparency", icon: <Info size={15} /> },
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

        {/* Main Content Area */}
        <div style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}>
          {/* TAB 1: LIVE NASA FEEDS */}
          {tab === "feeds" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "16px" }}>
              {/* APOD Card */}
              <FeedCard
                title="Astronomy Picture of the Day (APOD)"
                badge={feedData.apod.result}
                loading={feedData.apod.loading}
                sourceUrl="https://apod.nasa.gov/"
              >
                {feedData.apod.parsed?.title ? (
                  <div>
                    <b style={{ color: "#74b3ff", fontSize: "14px", display: "block", marginBottom: "4px" }}>
                      {feedData.apod.parsed.title}
                    </b>
                    <p style={{ fontSize: "12px", color: "#a5c2e8", margin: 0, maxHeight: "80px", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {feedData.apod.parsed.explanation}
                    </p>
                  </div>
                ) : (
                  <p style={{ fontSize: "12px", color: "#8dafd8" }}>Loading NASA APOD feed…</p>
                )}
              </FeedCard>

              {/* NeoWs Card */}
              <FeedCard
                title="Near-Earth Objects (NASA NeoWs)"
                badge={feedData.neo.result}
                loading={feedData.neo.loading}
                sourceUrl="https://cneos.jpl.nasa.gov/"
              >
                {feedData.neo.parsed ? (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "12px", color: "#8dafd8" }}>Objects tracked today:</span>
                      <b style={{ fontSize: "14px", color: "#fff" }}>{feedData.neo.parsed.element_count ?? 0}</b>
                    </div>
                    {feedData.neo.parsed.objects?.[0] && (
                      <div style={{ padding: "8px", background: "rgba(0,0,0,0.3)", borderRadius: "6px", fontSize: "11px", color: "#b9d4f6" }}>
                        <div><b>Name:</b> {feedData.neo.parsed.objects[0].name}</div>
                        <div><b>Max Diameter:</b> {feedData.neo.parsed.objects[0].diameter_m} m</div>
                        <div><b>Velocity:</b> {feedData.neo.parsed.objects[0].velocity_kms.toFixed(2)} km/s</div>
                        <div style={{ color: feedData.neo.parsed.objects[0].hazardous ? "#ff7b72" : "#7ee787" }}>
                          <b>Hazard Status:</b> {feedData.neo.parsed.objects[0].hazardous ? "Potentially Hazardous" : "Non-Hazardous"}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={{ fontSize: "12px", color: "#8dafd8" }}>Querying JPL Small-Body Database…</p>
                )}
              </FeedCard>

              {/* DONKI Space Weather */}
              <FeedCard
                title="Space Weather (DONKI Flares & CMEs)"
                badge={feedData.donki.result}
                loading={feedData.donki.loading}
                sourceUrl="https://kauai.ccmc.gsfc.nasa.gov/DONKI/"
              >
                {feedData.donki.parsed ? (
                  <div>
                    <span style={{ fontSize: "12px", color: "#8dafd8", display: "block", marginBottom: "6px" }}>
                      Recent Solar Flare Events:
                    </span>
                    {feedData.donki.parsed.events?.length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        {feedData.donki.parsed.events.slice(-3).map((e: any, idx: number) => (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", padding: "4px 8px", background: "rgba(224, 165, 58, 0.15)", borderRadius: "4px", color: "#ffd38a" }}>
                            <span>{e.type} Class {e.classType ?? "Unclassified"}</span>
                            <span style={{ color: "#8dafd8" }}>{e.time?.slice(0, 10) ?? "Recent"}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: "12px", color: "#7ee787" }}>Solar activity quiet. No major coronal events in the last 14 days.</p>
                    )}
                  </div>
                ) : (
                  <p style={{ fontSize: "12px", color: "#8dafd8" }}>Checking NASA Space Weather Database…</p>
                )}
              </FeedCard>

              {/* DSCOVR EPIC Earth */}
              <FeedCard
                title="DSCOVR Earth Polychromatic (EPIC)"
                badge={feedData.epic.result}
                loading={feedData.epic.loading}
                sourceUrl="https://epic.gsfc.nasa.gov/"
              >
                {feedData.epic.parsed?.images?.[0] ? (
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <img
                      src={feedData.epic.parsed.images[0].url}
                      alt="DSCOVR EPIC Earth"
                      style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", border: "1px solid #3366aa" }}
                    />
                    <div style={{ fontSize: "11px", color: "#a5c2e8" }}>
                      <b style={{ color: "#fff", display: "block" }}>Lagrange L1 Earth Imagery</b>
                      <span>Acquired: {feedData.epic.parsed.images[0].date}</span>
                      <p style={{ margin: "4px 0 0", color: "#8dafd8" }}>{feedData.epic.parsed.images[0].caption ?? "Natural color Earth observation"}</p>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: "12px", color: "#8dafd8" }}>Loading DSCOVR L1 imagery…</p>
                )}
              </FeedCard>

              {/* JPL Small-Body Database (SBDB) */}
              <FeedCard
                title="JPL Small-Body Database (SBDB)"
                badge={feedData.sbdb.result}
                loading={feedData.sbdb.loading}
                sourceUrl="https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html"
              >
                {feedData.sbdb.parsed ? (
                  <div style={{ fontSize: "12px", color: "#a5c2e8" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span>Target:</span>
                      <b style={{ color: "#fff" }}>{feedData.sbdb.parsed.object?.fullname ?? "1 Ceres"}</b>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span>Semi-major Axis (a):</span>
                      <b>{feedData.sbdb.parsed.elements?.a_au ?? "2.77"} AU</b>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Eccentricity (e):</span>
                      <b>{feedData.sbdb.parsed.elements?.e ?? "0.0785"}</b>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: "12px", color: "#8dafd8" }}>Querying JPL Horizons / SBDB ephemeris…</p>
                )}
              </FeedCard>

              {/* Sentry Impact Risk Data */}
              <FeedCard
                title="JPL Sentry: Earth Impact Monitoring"
                badge={feedData.sentry.result}
                loading={feedData.sentry.loading}
                sourceUrl="https://cneos.jpl.nasa.gov/sentry/"
              >
                {feedData.sentry.parsed ? (
                  <div style={{ fontSize: "12px", color: "#a5c2e8" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>Potential Impactors Monitored:</span>
                      <b style={{ color: "#fff" }}>{feedData.sentry.parsed.count ?? "0"}</b>
                    </div>
                    <p style={{ margin: 0, fontSize: "11px", color: "#8dafd8" }}>
                      Automated hazard evaluation using JPL optical orbit determination models.
                    </p>
                  </div>
                ) : (
                  <p style={{ fontSize: "12px", color: "#8dafd8" }}>Checking Sentry risk database…</p>
                )}
              </FeedCard>
            </div>
          )}

          {/* TAB 2: SPACECRAFT LIBRARY */}
          {tab === "spacecraft" && (
            <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "20px" }}>
              {/* Spacecraft List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {NASA_SPACECRAFT_ARCHIVE.map((craft) => (
                  <button
                    key={craft.id}
                    onClick={() => setSelectedCraft(craft)}
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      background: selectedCraft.id === craft.id ? "rgba(35, 116, 225, 0.3)" : "rgba(10, 29, 61, 0.4)",
                      borderLeft: selectedCraft.id === craft.id ? "3px solid #388bfd" : "3px solid transparent",
                      color: selectedCraft.id === craft.id ? "#ffffff" : "#a5c2e8",
                    }}
                  >
                    <b style={{ display: "block", fontSize: "13px" }}>{craft.name}</b>
                    <small style={{ color: "#749fc9", fontSize: "11px" }}>{craft.target} · {craft.status}</small>
                  </button>
                ))}
              </div>

              {/* Spacecraft Detail & Side-by-Side Comparison */}
              <div style={{ background: "rgba(8, 24, 52, 0.6)", padding: "18px", borderRadius: "12px", border: "1px solid #143566" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div>
                    <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#61a8ff", fontWeight: 700 }}>
                      {selectedCraft.agency} · Launch: {selectedCraft.launchDate}
                    </span>
                    <h3 style={{ margin: "4px 0", fontSize: "20px", color: "#fff" }}>{selectedCraft.name}</h3>
                    <p style={{ margin: 0, fontSize: "12px", color: "#a5c2e8" }}>{selectedCraft.significance}</p>
                  </div>
                  <a
                    href={selectedCraft.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#58a6ff", textDecoration: "none", padding: "6px 10px", background: "rgba(35, 116, 225, 0.15)", borderRadius: "6px" }}
                  >
                    NASA Docs <ExternalLink size={12} />
                  </a>
                </div>

                {/* Side-by-side Table: Real vs Game Simulation */}
                <h4 style={{ fontSize: "13px", color: "#dbe8ff", textTransform: "uppercase", letterSpacing: "0.08em", margin: "14px 0 8px" }}>
                  System Architecture: Real-World Specs vs. Mission Forge Model
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {/* Real Specs */}
                  <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(88, 166, 255, 0.2)" }}>
                    <b style={{ color: "#79c0ff", fontSize: "12px", display: "block", marginBottom: "6px" }}>
                      REAL-WORLD NASA FLIGHT HARDWARE
                    </b>
                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <li><b>Launch Mass:</b> {selectedCraft.realSpecs.launchMassKg.toLocaleString()} kg</li>
                      <li><b>Propulsion:</b> {selectedCraft.realSpecs.propulsionType}</li>
                      {selectedCraft.realSpecs.propellantMassKg && <li><b>Propellant Load:</b> {selectedCraft.realSpecs.propellantMassKg.toLocaleString()} kg</li>}
                      <li><b>Power Architecture:</b> {selectedCraft.realSpecs.primaryPower}</li>
                    </ul>
                  </div>

                  {/* Simulation Model */}
                  <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(46, 160, 67, 0.3)" }}>
                    <b style={{ color: "#7ee787", fontSize: "12px", display: "block", marginBottom: "6px" }}>
                      MISSION FORGE SIMULATION ANALOGUE
                    </b>
                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <li><b>Engine Mapping:</b> {selectedCraft.simulationModel.engineEquivalent}</li>
                      <li><b>Mass Class:</b> {selectedCraft.simulationModel.massTier}</li>
                      <li><b>Power System:</b> {selectedCraft.simulationModel.powerSource}</li>
                      <li><b>Instruments:</b> {selectedCraft.simulationModel.gameInstruments.join(", ")}</li>
                    </ul>
                  </div>
                </div>

                <div style={{ marginTop: "12px", padding: "10px", background: "rgba(35, 116, 225, 0.1)", borderRadius: "6px", fontSize: "11px", color: "#8dafd8" }}>
                  <b>Simulation Fidelity Note:</b> {selectedCraft.simulationModel.simplificationNote}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCIENCE INSTRUMENTS */}
          {tab === "instruments" && (
            <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "20px" }}>
              {/* Instrument List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {NASA_INSTRUMENTS_ARCHIVE.map((inst) => (
                  <button
                    key={inst.id}
                    onClick={() => setSelectedInst(inst)}
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      background: selectedInst.id === inst.id ? "rgba(35, 116, 225, 0.3)" : "rgba(10, 29, 61, 0.4)",
                      borderLeft: selectedInst.id === inst.id ? "3px solid #388bfd" : "3px solid transparent",
                      color: selectedInst.id === inst.id ? "#ffffff" : "#a5c2e8",
                    }}
                  >
                    <b style={{ display: "block", fontSize: "13px" }}>{inst.acronym}</b>
                    <small style={{ color: "#749fc9", fontSize: "11px" }}>{inst.hostMission} ({inst.targetBody})</small>
                  </button>
                ))}
              </div>

              {/* Instrument Detail */}
              <div style={{ background: "rgba(8, 24, 52, 0.6)", padding: "18px", borderRadius: "12px", border: "1px solid #143566" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div>
                    <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#61a8ff", fontWeight: 700 }}>
                      Host: {selectedInst.hostMission} · Target: {selectedInst.targetBody}
                    </span>
                    <h3 style={{ margin: "4px 0", fontSize: "20px", color: "#fff" }}>
                      {selectedInst.acronym} — {selectedInst.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: "12px", color: "#a5c2e8" }}>{selectedInst.primaryDiscovery}</p>
                  </div>
                  <a
                    href={selectedInst.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#58a6ff", textDecoration: "none", padding: "6px 10px", background: "rgba(35, 116, 225, 0.15)", borderRadius: "6px" }}
                  >
                    NASA Docs <ExternalLink size={12} />
                  </a>
                </div>

                {/* Specs comparison */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ background: "rgba(0,0,0,0.35)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(88, 166, 255, 0.2)" }}>
                    <b style={{ color: "#79c0ff", fontSize: "12px", display: "block", marginBottom: "6px" }}>
                      REAL INSTRUMENT SPECIFICATION
                    </b>
                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <li><b>Flight Mass:</b> {selectedInst.realSpecs.massKg} kg</li>
                      <li><b>Power Consumption:</b> {selectedInst.realSpecs.powerWatts} W</li>
                      <li><b>Detection:</b> {selectedInst.realSpecs.measurementType}</li>
                      {selectedInst.realSpecs.resolutionOrBand && <li><b>Resolution / Band:</b> {selectedInst.realSpecs.resolutionOrBand}</li>}
                    </ul>
                  </div>

                  <div style={{ background: "rgba(0,0,0,0.35)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(46, 160, 67, 0.3)" }}>
                    <b style={{ color: "#7ee787", fontSize: "12px", display: "block", marginBottom: "6px" }}>
                      MISSION FORGE GAME EQUIVALENT
                    </b>
                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <li><b>Mapped Instrument:</b> {selectedInst.simulationMapping.gameInstrumentId}</li>
                      <li><b>Science Yield:</b> +{selectedInst.simulationMapping.gameSciencePoints} pts</li>
                      <li><b>Power Draw:</b> {selectedInst.simulationMapping.gameKwDraw} kW</li>
                      <li><b>Installed Mass:</b> {selectedInst.simulationMapping.gameMassKg} kg</li>
                    </ul>
                  </div>
                </div>

                <div style={{ marginTop: "12px", padding: "10px", background: "rgba(35, 116, 225, 0.1)", borderRadius: "6px", fontSize: "11px", color: "#8dafd8" }}>
                  <b>Modeling Rationale:</b> {selectedInst.simulationMapping.fidelityComparison}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NASA 3D RESOURCES */}
          {tab === "nasa3d" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "13px", color: "#b8d2f2" }}>
              <div style={{ background: "rgba(14, 43, 89, 0.4)", border: "1px solid #1f4f96", borderRadius: "10px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "8px" }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px", color: "#fff", display: "flex", alignItems: "center", gap: "8px", fontSize: "16px" }}>
                      <Box size={18} color="#38bdf8" /> NASA 3D Resources Integration
                    </h4>
                    <p style={{ margin: 0, fontSize: "12px", color: "#8dafd8" }}>
                      Official NASA 3D models, textures, and visualization resources contributed by NASA Centers
                    </p>
                  </div>
                  <a
                    href="https://github.com/nasa/NASA-3D-Resources"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      background: "rgba(56, 189, 248, 0.15)",
                      border: "1px solid rgba(56, 189, 248, 0.4)",
                      color: "#38bdf8",
                      fontSize: "12px",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    <span>View NASA Repository</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <p style={{ margin: "8px 0 12px", lineHeight: 1.6, color: "#d0e4ff" }}>
                  Mission Forge integrates official 3D assets from <code>nasa/NASA-3D-Resources</code>, a public repository
                  maintained by NASA containing models, textures, and imagery from multiple NASA installations.
                </p>

                {/* Contributing Centers Grid */}
                <b style={{ color: "#74b3ff", fontSize: "12px", display: "block", marginBottom: "6px" }}>
                  VERIFIED NASA CONTRIBUTING CENTERS
                </b>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "8px", marginBottom: "16px" }}>
                  {[
                    { center: "NASA Ames Research Center (ARC)", spec: "Planetary exploration & science craft" },
                    { center: "NASA Goddard Space Flight Center (GSFC)", spec: "Astrophysics & Hubble space telescope" },
                    { center: "NASA Jet Propulsion Laboratory (JPL)", spec: "Voyager, Cassini, Galileo, Mars rovers" },
                    { center: "NASA Johnson Space Center (JSC)", spec: "Human exploration & Apollo lunar module" },
                    { center: "NASA / JPL-Caltech", spec: "Deep space navigation & Dawn ion propulsion" },
                    { center: "NASA Solar System Simulator", spec: "Cylindrical planetary surface projection maps" },
                  ].map((c) => (
                    <div key={c.center} style={{ background: "rgba(6, 20, 46, 0.6)", padding: "8px 12px", borderRadius: "6px", border: "1px solid #163666" }}>
                      <div style={{ fontWeight: 600, color: "#fff", fontSize: "12px" }}>{c.center}</div>
                      <div style={{ color: "#7da4d4", fontSize: "11px" }}>{c.spec}</div>
                    </div>
                  ))}
                </div>

                {/* NASA Media Guidelines & Disclaimer */}
                <div style={{ background: "rgba(217, 119, 6, 0.12)", border: "1px solid rgba(245, 158, 11, 0.35)", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
                  <b style={{ color: "#fbbf24", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <Shield size={14} /> NASA Brand Center & Media Usage Guidelines
                  </b>
                  <p style={{ margin: 0, fontSize: "12px", color: "#fde68a", lineHeight: 1.5 }}>
                    NASA material is not protected by copyright and may be used for educational or informational purposes without explicit permission.
                    In strict accordance with <a href="https://www.nasa.gov/nasa-brand-center/images-and-media" target="_blank" rel="noopener noreferrer" style={{ color: "#fef08a", textDecoration: "underline" }}>NASA Brand Guidelines</a>,
                    NASA does not endorse Mission Forge, Team Ghost Hunter, or any non-NASA service. The NASA insignia is not co-opted.
                  </p>
                </div>

                {/* Separation of Concerns Callout */}
                <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
                  <b style={{ color: "#34d399", fontSize: "12px", display: "block", marginBottom: "4px" }}>
                    STRICT SEPARATION: VISUAL REPRESENTATION vs. SCIENTIFIC COMPUTATION
                  </b>
                  <p style={{ margin: 0, fontSize: "12px", color: "#a7f3d0", lineHeight: 1.5 }}>
                    Visual 3D models and planetary cylindrical textures are visual representations only. Flight mechanics,
                    orbital mechanics, delta-v budgets, and spacecraft subsystem margins are independently computed via
                    the Tsiolkovsky rocket equation and NASA/JPL Horizons mean orbital elements (J2000 epoch).
                  </p>
                </div>

                {/* Model Inventory Table */}
                <b style={{ color: "#74b3ff", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                  INTEGRATED NASA 3D ASSETS IN MISSION FORGE (11 MODELS · 8 TEXTURES)
                </b>
                <div style={{ overflowX: "auto", marginBottom: "16px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", color: "#c9d1d9" }}>
                    <thead>
                      <tr style={{ background: "rgba(15, 37, 74, 0.8)", borderBottom: "1px solid #1c4585", textAlign: "left" }}>
                        <th style={{ padding: "6px 10px" }}>Asset Name</th>
                        <th style={{ padding: "6px 10px" }}>Repository Origin</th>
                        <th style={{ padding: "6px 10px" }}>Format</th>
                        <th style={{ padding: "6px 10px" }}>Contributing NASA Center</th>
                        <th style={{ padding: "6px 10px" }}>Mission Forge Use</th>
                      </tr>
                    </thead>
                    <tbody>
                      {NASA_3D_ASSETS.map((asset, i) => (
                        <tr key={asset.id} style={{ borderBottom: "1px solid rgba(28, 69, 133, 0.4)", background: i % 2 === 0 ? "transparent" : "rgba(8, 25, 54, 0.4)" }}>
                          <td style={{ padding: "6px 10px", fontWeight: 600, color: "#e2f1ff" }}>{asset.name}</td>
                          <td style={{ padding: "6px 10px", color: "#8dafd8", fontFamily: "monospace" }}>{asset.originalPath}</td>
                          <td style={{ padding: "6px 10px", color: "#38bdf8" }}>{asset.webFormat}</td>
                          <td style={{ padding: "6px 10px", color: "#a5c2e8" }}>{asset.organization}</td>
                          <td style={{ padding: "6px 10px", color: "#10b981" }}>{asset.usedIn.join(", ")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Audited & Rejected Assets Ledger */}
                <b style={{ color: "#f87171", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                  AUDITED & FORMALLY REJECTED ASSETS (SAFETY, MEMORY & COMPATIBILITY LEDGER)
                </b>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", color: "#c9d1d9" }}>
                    <thead>
                      <tr style={{ background: "rgba(60, 20, 20, 0.6)", borderBottom: "1px solid #852222", textAlign: "left" }}>
                        <th style={{ padding: "6px 10px" }}>Resource</th>
                        <th style={{ padding: "6px 10px" }}>Format</th>
                        <th style={{ padding: "6px 10px" }}>Issue Identified</th>
                        <th style={{ padding: "6px 10px" }}>Audit Decision</th>
                      </tr>
                    </thead>
                    <tbody>
                      {AUDITED_REJECTED_ASSETS.map((rej, i) => (
                        <tr key={rej.name} style={{ borderBottom: "1px solid rgba(133, 34, 34, 0.3)", background: i % 2 === 0 ? "transparent" : "rgba(40, 15, 15, 0.4)" }}>
                          <td style={{ padding: "6px 10px", fontWeight: 600, color: "#fca5a5" }}>{rej.name}</td>
                          <td style={{ padding: "6px 10px", fontFamily: "monospace", color: "#fca5a5" }}>{rej.originalFormat}</td>
                          <td style={{ padding: "6px 10px", color: "#f87171" }}>{rej.rejectionReason}</td>
                          <td style={{ padding: "6px 10px", color: "#fecaca", fontStyle: "italic" }}>{rej.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SCIENTIFIC TRANSPARENCY */}
          {tab === "transparency" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "13px", color: "#b8d2f2" }}>
              <div style={{ background: "rgba(14, 43, 89, 0.4)", border: "1px solid #1f4f96", borderRadius: "10px", padding: "16px" }}>
                <h4 style={{ margin: "0 0 8px", color: "#fff", display: "flex", alignItems: "center", gap: "8px", fontSize: "15px" }}>
                  <Shield size={18} color="#4da3ff" /> Scientific Transparency & Modeling Boundaries
                </h4>
                <p style={{ margin: "0 0 10px", lineHeight: 1.6 }}>
                  Mission Forge is an interactive educational space mission engineering simulator developed for the <b>NASA Space Apps Challenge 2026</b> by <b>Team Ghost Hunter</b>.
                  To balance high scientific fidelity with accessibility in an interactive browser environment:
                </p>
                <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px", lineHeight: 1.5 }}>
                  <li>
                    <b>Orbital Physics:</b> Planetary ephemerides are computed from NASA/JPL approximate mean orbital elements (J2000 epoch). Interplanetary paths display simplified flight arcs for intuitive navigation rather than full N-body numerical integration.
                  </li>
                  <li>
                    <b>Tsiolkovsky Rocket Equation:</b> All delta-v calculations dynamically obey Δv = Isp · g₀ · ln(m₀ / m_f). Mass and engine parameters correspond to genuine aerospace benchmarks (e.g. Aerojet Rocketdyne RL10 hydrolox, NSTAR xenon ion).
                  </li>
                  <li>
                    <b>NERVA & Nuclear Thermal:</b> The NERVA engine is presented strictly as a <em>Historical / Educational Concept</em> based on NASA Glenn research (1960s–1970s).
                  </li>
                  <li>
                    <b>Linear Aerospike:</b> Aerospike engines are labeled as <em>Experimental / Historical Reference</em> based on NASA Marshall flight test programs.
                  </li>
                  <li>
                    <b>Flight Rules & GO/NO-GO Override:</b> The launch GO/NO-GO poll evaluates genuine pre-launch safety criteria (Δv margins, power balance, comms redundancy). The override option is explicitly designated as a <em>Simulation Mode</em> allowing players to experience downstream flight hazards.
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
        </div>
        <SpaceDataSourcesModal isOpen={globalDataOpen} onClose={() => setGlobalDataOpen(false)} />
      </section>
    </div>
  );
}

function FeedCard({ title, badge, loading, sourceUrl, children }: { title: string; badge: NasaResult | null | undefined; loading: boolean; sourceUrl: string; children: React.ReactNode }) {
  const isLive = badge?.live === true;
  const isCached = badge?.cached === true;
  const tagColor = isLive ? "#2ea043" : isCached ? "#d29922" : "#8b949e";
  const tagText = loading ? "FETCHING…" : isLive ? (isCached ? "CACHED LIVE" : "LIVE NASA API") : "OFFLINE FALLBACK";

  return (
    <div style={{ background: "rgba(8, 24, 52, 0.6)", border: "1px solid #143566", borderRadius: "10px", padding: "14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: `${tagColor}25`, color: tagColor, border: `1px solid ${tagColor}60` }}>
            {tagText}
          </span>
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#58a6ff", fontSize: "11px", display: "flex", alignItems: "center", gap: "2px", textDecoration: "none" }}>
            API <ExternalLink size={10} />
          </a>
        </div>
        <h4 style={{ margin: "0 0 8px", fontSize: "13px", color: "#fff" }}>{title}</h4>
        {children}
      </div>
      {badge?.fetchedAt && (
        <small style={{ color: "#5c7eab", fontSize: "10px", marginTop: "10px", display: "block" }}>
          Updated: {badge.fetchedAt.slice(0, 19).replace("T", " ")} UTC
        </small>
      )}
    </div>
  );
}
