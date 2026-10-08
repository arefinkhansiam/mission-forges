import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, ExternalLink, Rocket, Check, ArrowRight, Compass, Shield, Award, Calendar, Radio } from "lucide-react";
import { useMissionStore } from "../../stores/mission-store";
import { REAL_MISSION_PRESETS, type MissionPreset } from "../../lib/mission-registry";
import { SPACECRAFT_REGISTRY, type RegistrySpacecraft } from "../../lib/spacecraft-registry";
import { INSTRUMENT_REGISTRY, type RegistryInstrument } from "../../lib/instrument-registry";
import { sfx } from "../../lib/audio";
import type { MissionId, Instrument } from "../../lib/mission-sim";

interface MissionArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset?: (preset: MissionPreset) => void;
}

export function MissionArchiveModal({ isOpen, onClose, onSelectPreset }: MissionArchiveModalProps) {
  const { t } = useTranslation();
  const s = useMissionStore();

  const [activeTab, setActiveTab] = useState<"missions" | "spacecraft" | "instruments">("missions");
  const [selectedMission, setSelectedMission] = useState<MissionPreset>(REAL_MISSION_PRESETS[0]!);
  const [selectedCraft, setSelectedCraft] = useState<RegistrySpacecraft>(SPACECRAFT_REGISTRY[0]!);
  const [selectedInst, setSelectedInst] = useState<RegistryInstrument>(INSTRUMENT_REGISTRY[0]!);

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const loadReferenceConfiguration = (preset: MissionPreset) => {
    sfx.success();
    const targetMission: MissionId =
      preset.destination === "Europa" ? "Jupiter" :
      preset.destination === "Titan" ? "Saturn" :
      preset.destination;

    const validInstruments: Instrument[] = preset.craftConfiguration.instruments.filter(
      (inst): inst is Instrument => inst === "camera" || inst === "spectrometer" || inst === "radiation"
    );

    s.set({
      mission: targetMission,
      route: preset.route,
      objective: preset.objective,
      craft: preset.craftConfiguration.craft,
      engine: preset.craftConfiguration.engine,
      engines: preset.craftConfiguration.engines,
      tanks: preset.craftConfiguration.tanks,
      wings: preset.craftConfiguration.wings,
      rtgs: preset.craftConfiguration.rtgs,
      antennas: preset.craftConfiguration.antennas,
      shield: preset.craftConfiguration.shield,
      battery: preset.craftConfiguration.battery,
      instruments: validInstruments.length > 0 ? validInstruments : ["camera"],
      budget: preset.craftConfiguration.budget,
    });
    if (onSelectPreset) {
      onSelectPreset(preset);
    } else {
      s.go("build");
    }
    onClose();
  };

  const filteredMissions = REAL_MISSION_PRESETS.filter((m) =>
    searchQuery ? m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.destination.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  const filteredSpacecraft = SPACECRAFT_REGISTRY.filter((c) => {
    const matchCat = filterCategory === "all" || c.category === filterCategory;
    const matchQuery = searchQuery ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.destination.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchCat && matchQuery;
  });

  const filteredInstruments = INSTRUMENT_REGISTRY.filter((inst) => {
    const matchCat = filterCategory === "all" || inst.category === filterCategory;
    const matchQuery = searchQuery ? inst.name.toLowerCase().includes(searchQuery.toLowerCase()) || inst.acronym.toLowerCase().includes(searchQuery.toLowerCase()) || inst.targetBody.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchCat && matchQuery;
  });

  return (
    <div className="gm-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <section
        className="gm-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(96vw, 1080px)",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          background: "#040d22f6",
          border: "1px solid #1a3e75",
          borderRadius: "16px",
          boxShadow: "0 25px 80px rgba(0,0,0,0.85), 0 0 50px rgba(25, 75, 145, 0.4)",
          backdropFilter: "blur(20px)",
          color: "#e6f1ff",
          overflow: "hidden",
        }}
      >
        {/* Top Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #142e58", paddingBottom: "14px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ display: "grid", placeItems: "center", width: "36px", height: "36px", borderRadius: "8px", background: "rgba(37, 99, 235, 0.25)", color: "#60a5fa" }}>
              <Compass size={22} />
            </span>
            <div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#fff" }}>NASA & INTERNATIONAL MISSION ARCHIVES</h2>
              <p style={{ margin: 0, fontSize: "12px", color: "#8dafd8" }}>
                Interactive Exploration of Real Flights, Spacecraft, and Scientific Instruments
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#8dafd8", cursor: "pointer", padding: "6px" }}>
            <X size={22} />
          </button>
        </header>

        {/* Tab & Search Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
          <nav style={{ display: "flex", gap: "8px" }}>
            {[
              { id: "missions", label: "Real Missions & Presets" },
              { id: "spacecraft", label: "Spacecraft Fleet (20+)" },
              { id: "instruments", label: "Instruments Archive" },
            ].map((tItem) => (
              <button
                key={tItem.id}
                onClick={() => {
                  sfx.click();
                  setActiveTab(tItem.id as any);
                  setFilterCategory("all");
                }}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 600,
                  background: activeTab === tItem.id ? "#1d4ed8" : "rgba(10, 28, 59, 0.6)",
                  color: activeTab === tItem.id ? "#ffffff" : "#8dafd8",
                  boxShadow: activeTab === tItem.id ? "0 0 16px rgba(37, 99, 235, 0.4)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                {tItem.label}
              </button>
            ))}
          </nav>

          <input
            type="search"
            placeholder="Search missions, targets, or instruments…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "7px 14px",
              borderRadius: "8px",
              border: "1px solid #1c4580",
              background: "rgba(0, 0, 0, 0.4)",
              color: "#fff",
              fontSize: "12px",
              minWidth: "240px",
            }}
          />
        </div>

        {/* MAIN TAB 1: REAL MISSIONS & PRESETS */}
        {activeTab === "missions" && (
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "300px 1fr", gap: "20px", overflow: "hidden" }}>
            {/* Mission List */}
            <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", paddingRight: "6px" }}>
              {filteredMissions.map((preset) => {
                const isSelected = selectedMission.id === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      sfx.click();
                      setSelectedMission(preset);
                    }}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      background: isSelected ? "rgba(37, 99, 235, 0.25)" : "rgba(8, 24, 52, 0.5)",
                      border: isSelected ? "1.5px solid #3b82f6" : "1px solid #143566",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 700, background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", padding: "2px 6px", borderRadius: "4px" }}>
                        {preset.badge}
                      </span>
                      <small style={{ color: "#749fc9", fontSize: "11px" }}>{preset.launchYear}</small>
                    </div>
                    <b style={{ color: "#fff", fontSize: "14px", display: "block" }}>{preset.name}</b>
                    <span style={{ fontSize: "12px", color: "#8dafd8" }}>Destination: {preset.destination} ({preset.agency})</span>
                  </div>
                );
              })}
            </div>

            {/* Mission Detail & Reference Comparison */}
            <div style={{ overflowY: "auto", background: "rgba(8, 24, 52, 0.6)", border: "1px solid #143566", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#60a5fa" }}>
                    {selectedMission.agency} · Launch: {selectedMission.launchYear}
                  </span>
                  <h3 style={{ margin: "4px 0", fontSize: "22px", color: "#fff" }}>{selectedMission.referenceMission}</h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "#b9d2f0" }}>{selectedMission.summary}</p>
                </div>
                <a
                  href={selectedMission.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#60a5fa", textDecoration: "none", padding: "6px 10px", background: "rgba(37, 99, 235, 0.15)", borderRadius: "6px" }}
                >
                  NASA Docs <ExternalLink size={12} />
                </a>
              </div>

              {/* Historic Science Milestone */}
              <div style={{ background: "rgba(0, 0, 0, 0.35)", border: "1px solid rgba(88, 166, 255, 0.2)", borderRadius: "8px", padding: "12px" }}>
                <b style={{ color: "#7ee787", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <Award size={14} /> HISTORICAL SCIENTIFIC MILESTONE
                </b>
                <p style={{ margin: 0, fontSize: "12px", color: "#c9d1d9", lineHeight: 1.5 }}>
                  {selectedMission.scientificMilestone}
                </p>
              </div>

              {/* Engineering Trade-off */}
              <div style={{ background: "rgba(0, 0, 0, 0.35)", border: "1px solid #143566", borderRadius: "8px", padding: "12px" }}>
                <b style={{ color: "#ffd38a", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <Shield size={14} /> FLIGHT HARDWARE TRADE-OFF
                </b>
                <p style={{ margin: 0, fontSize: "12px", color: "#c9d1d9", lineHeight: 1.5 }}>
                  {selectedMission.engineeringTradeoff}
                </p>
              </div>

              {/* Game Analogue & Load Button */}
              <div style={{ background: "rgba(37, 99, 235, 0.12)", border: "1.5px solid #2563eb", borderRadius: "10px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <div>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      MISSION-INSPIRED GAME CONFIGURATION
                    </span>
                    <h4 style={{ margin: "2px 0 0", fontSize: "15px", color: "#fff" }}>
                      {selectedMission.name} Configuration Profile
                    </h4>
                  </div>
                  <button
                    onClick={() => loadReferenceConfiguration(selectedMission)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      fontWeight: 700,
                      fontSize: "13px",
                      cursor: "pointer",
                      boxShadow: "0 0 15px rgba(37, 99, 235, 0.5)",
                    }}
                  >
                    <Rocket size={15} /> USE AS REFERENCE & MODIFY <ArrowRight size={15} />
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "8px", fontSize: "12px", color: "#c9d1d9" }}>
                  <div><b>Engine:</b> {selectedMission.craftConfiguration.engine}</div>
                  <div><b>Tanks:</b> {selectedMission.craftConfiguration.tanks} units</div>
                  <div><b>Solar:</b> {selectedMission.craftConfiguration.wings} wings</div>
                  <div><b>RTGs:</b> {selectedMission.craftConfiguration.rtgs} units</div>
                  <div><b>Antennas:</b> {selectedMission.craftConfiguration.antennas}x HGA</div>
                  <div><b>Shield:</b> {selectedMission.craftConfiguration.shield ? "Equipped" : "None"}</div>
                  <div><b>Instruments:</b> {selectedMission.craftConfiguration.instruments.join(", ")}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MAIN TAB 2: SPACECRAFT FLEET */}
        {activeTab === "spacecraft" && (
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "300px 1fr", gap: "20px", overflow: "hidden" }}>
            {/* Filter by Category */}
            <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", paddingRight: "6px" }}>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "6px" }}>
                {["all", "lunar", "mars", "asteroids", "jupiter", "saturn", "outer", "telescopes"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      border: "none",
                      cursor: "pointer",
                      background: filterCategory === cat ? "#2563eb" : "rgba(255,255,255,0.06)",
                      color: filterCategory === cat ? "#fff" : "#8dafd8",
                    }}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>

              {filteredSpacecraft.map((craft) => {
                const isSelected = selectedCraft.id === craft.id;
                return (
                  <div
                    key={craft.id}
                    onClick={() => {
                      sfx.click();
                      setSelectedCraft(craft);
                    }}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "8px",
                      background: isSelected ? "rgba(37, 99, 235, 0.25)" : "rgba(8, 24, 52, 0.5)",
                      border: isSelected ? "1.5px solid #3b82f6" : "1px solid #143566",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <b style={{ color: "#fff", fontSize: "13px" }}>{craft.name}</b>
                      <span style={{ fontSize: "11px", color: "#60a5fa" }}>{craft.status}</span>
                    </div>
                    <small style={{ color: "#749fc9", fontSize: "11px" }}>{craft.destination} · {craft.agency}</small>
                  </div>
                );
              })}
            </div>

            {/* Spacecraft Deep Detail */}
            <div style={{ overflowY: "auto", background: "rgba(8, 24, 52, 0.6)", border: "1px solid #143566", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#60a5fa", textTransform: "uppercase" }}>
                    {selectedCraft.agency} · Launch Year: {selectedCraft.launchYear}
                  </span>
                  <h3 style={{ margin: "2px 0", fontSize: "20px", color: "#fff" }}>{selectedCraft.name} ({selectedCraft.craftType})</h3>
                  <p style={{ margin: 0, fontSize: "12px", color: "#8dafd8" }}>{selectedCraft.missionPurpose}</p>
                </div>
                <a
                  href={selectedCraft.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#60a5fa", textDecoration: "none", padding: "6px 10px", background: "rgba(37, 99, 235, 0.15)", borderRadius: "6px" }}
                >
                  NASA Docs <ExternalLink size={12} />
                </a>
              </div>

              {/* Side-by-side: Real vs Game */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ background: "rgba(0,0,0,0.35)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(88, 166, 255, 0.2)" }}>
                  <b style={{ color: "#79c0ff", fontSize: "12px", display: "block", marginBottom: "6px" }}>
                    REAL-WORLD FLIGHT HARDWARE
                  </b>
                  <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <li><b>Launch Mass:</b> {typeof selectedCraft.realSpecs.launchMassKg === "number" ? `${selectedCraft.realSpecs.launchMassKg.toLocaleString()} kg` : selectedCraft.realSpecs.launchMassKg}</li>
                    <li><b>Propulsion:</b> {selectedCraft.realSpecs.propulsion}</li>
                    <li><b>Power:</b> {selectedCraft.realSpecs.power}</li>
                    <li><b>Comms:</b> {selectedCraft.realSpecs.communication}</li>
                  </ul>
                </div>

                <div style={{ background: "rgba(0,0,0,0.35)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(46, 160, 67, 0.3)" }}>
                  <b style={{ color: "#7ee787", fontSize: "12px", display: "block", marginBottom: "6px" }}>
                    MISSION FORGE GAME SIMULATION
                  </b>
                  <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <li><b>Engine Class:</b> {selectedCraft.gameModel.engineClass}</li>
                    <li><b>Mass Tier:</b> {selectedCraft.gameModel.massTier}</li>
                    <li><b>Power System:</b> {selectedCraft.gameModel.powerType}</li>
                    <li><b>Instruments:</b> {selectedCraft.gameModel.instrumentEquivalents.join(", ")}</li>
                  </ul>
                </div>
              </div>

              <div style={{ background: "rgba(35, 116, 225, 0.1)", padding: "10px 14px", borderRadius: "8px", fontSize: "11px", color: "#8dafd8" }}>
                <b>Simulation Model Note:</b> {selectedCraft.gameModel.simulationNotes}
              </div>
            </div>
          </div>
        )}

        {/* MAIN TAB 3: INSTRUMENTS ARCHIVE */}
        {activeTab === "instruments" && (
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "300px 1fr", gap: "20px", overflow: "hidden" }}>
            {/* Instrument List */}
            <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", paddingRight: "6px" }}>
              {filteredInstruments.map((inst) => {
                const isSelected = selectedInst.id === inst.id;
                return (
                  <div
                    key={inst.id}
                    onClick={() => {
                      sfx.click();
                      setSelectedInst(inst);
                    }}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "8px",
                      background: isSelected ? "rgba(37, 99, 235, 0.25)" : "rgba(8, 24, 52, 0.5)",
                      border: isSelected ? "1.5px solid #3b82f6" : "1px solid #143566",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <b style={{ color: "#fff", fontSize: "13px" }}>{inst.acronym}</b>
                      <span style={{ fontSize: "11px", color: "#60a5fa" }}>{inst.category}</span>
                    </div>
                    <small style={{ color: "#749fc9", fontSize: "11px" }}>{inst.hostMission} ({inst.targetBody})</small>
                  </div>
                );
              })}
            </div>

            {/* Instrument Detail */}
            <div style={{ overflowY: "auto", background: "rgba(8, 24, 52, 0.6)", border: "1px solid #143566", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#60a5fa", textTransform: "uppercase" }}>
                    Host: {selectedInst.hostMission} · Target: {selectedInst.targetBody}
                  </span>
                  <h3 style={{ margin: "2px 0", fontSize: "20px", color: "#fff" }}>{selectedInst.acronym} — {selectedInst.name}</h3>
                  <p style={{ margin: 0, fontSize: "12px", color: "#8dafd8" }}>{selectedInst.scientificPurpose}</p>
                </div>
                <a
                  href={selectedInst.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#60a5fa", textDecoration: "none", padding: "6px 10px", background: "rgba(37, 99, 235, 0.15)", borderRadius: "6px" }}
                >
                  NASA Docs <ExternalLink size={12} />
                </a>
              </div>

              {/* Real vs Game */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ background: "rgba(0,0,0,0.35)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(88, 166, 255, 0.2)" }}>
                  <b style={{ color: "#79c0ff", fontSize: "12px", display: "block", marginBottom: "6px" }}>
                    REAL FLIGHT SPECIFICATION
                  </b>
                  <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <li><b>Mass:</b> {selectedInst.realSpecs.massKg} kg</li>
                    <li><b>Power:</b> {selectedInst.realSpecs.powerWatts} W</li>
                    <li><b>Measurement:</b> {selectedInst.measurementType}</li>
                    {selectedInst.realSpecs.resolutionOrBand && <li><b>Band/Res:</b> {selectedInst.realSpecs.resolutionOrBand}</li>}
                  </ul>
                </div>

                <div style={{ background: "rgba(0,0,0,0.35)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(46, 160, 67, 0.3)" }}>
                  <b style={{ color: "#7ee787", fontSize: "12px", display: "block", marginBottom: "6px" }}>
                    MISSION FORGE GAME EQUIVALENT
                  </b>
                  <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <li><b>Slot:</b> {selectedInst.gameParameters.gameId}</li>
                    <li><b>Science Yield:</b> +{selectedInst.gameParameters.scienceYield} pts</li>
                    <li><b>Draw:</b> {selectedInst.gameParameters.kwDraw} kW</li>
                    <li><b>Mass:</b> {selectedInst.gameParameters.massKg} kg</li>
                  </ul>
                </div>
              </div>

              <div style={{ background: "rgba(35, 116, 225, 0.1)", padding: "10px 14px", borderRadius: "8px", fontSize: "11px", color: "#8dafd8" }}>
                <b>Educational Modeling Rationale:</b> {selectedInst.gameParameters.simulationNotes}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
