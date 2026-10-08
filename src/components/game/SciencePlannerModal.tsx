import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Sparkles, Check, ArrowRight, Shield, Zap, Scale, Info } from "lucide-react";
import { useMissionStore } from "../../stores/mission-store";
import { INSTRUMENT_REGISTRY, type RegistryInstrument } from "../../lib/instrument-registry";
import { INSTRUMENTS, type Instrument } from "../../lib/mission-sim";
import { sfx } from "../../lib/audio";

interface SciencePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type ScienceObjective =
  | "surface"
  | "composition"
  | "atmosphere"
  | "magnetic"
  | "radiation"
  | "subsurface"
  | "geology"
  | "climate";

const OBJECTIVES: { id: ScienceObjective; label: string; icon: string; desc: string; instruments: Instrument[] }[] = [
  { id: "surface", label: "Surface Geology & Morphology", icon: "🏔️", desc: "Map rock formations, impact craters, sedimentary beds, and dune migrations.", instruments: ["camera"] },
  { id: "composition", label: "Chemical & Mineral Composition", icon: "🧪", desc: "Identify salts, clay minerals, organic molecules, and isotopic ratios.", instruments: ["spectrometer", "camera"] },
  { id: "atmosphere", label: "Atmospheric & Smog Dynamics", icon: "💨", desc: "Sample volatile gas species, aerosol smog, circulation, and weather cycles.", instruments: ["spectrometer"] },
  { id: "subsurface", label: "Subsurface Ice & Oceans", icon: "🧊", desc: "Sound through icy shells and crusts to detect liquid water and brine pockets.", instruments: ["spectrometer", "radiation"] },
  { id: "radiation", label: "Radiation & Space Weather", icon: "☢️", desc: "Quantify cosmic ray dosage, solar particle storms, and biological hazard levels.", instruments: ["radiation"] },
  { id: "magnetic", label: "Magnetic Dynamo & Magnetosphere", icon: "🧲", desc: "Measure internal core dynamo harmonics and induced ocean conductivities.", instruments: ["spectrometer", "radiation"] },
  { id: "geology", label: "Deep Crustal & Seismic Structure", icon: "🌋", desc: "Probe quakes, tectonic rifting, and volcanic activity.", instruments: ["camera", "spectrometer"] },
  { id: "climate", label: "Past Habitability & Climate Evolution", icon: "☀️", desc: "Determine how the planet transitioned from wet to dry over billions of years.", instruments: ["spectrometer", "radiation", "camera"] },
];

export function SciencePlannerModal({ isOpen, onClose }: SciencePlannerModalProps) {
  const { t } = useTranslation();
  const s = useMissionStore();

  const [primary, setPrimary] = useState<ScienceObjective>("composition");
  const [secondary, setSecondary] = useState<ScienceObjective>("subsurface");

  if (!isOpen) return null;

  // Determine recommended instrument list
  const primaryObj = OBJECTIVES.find((o) => o.id === primary)!;
  const secondaryObj = OBJECTIVES.find((o) => o.id === secondary)!;

  const combinedInstruments = Array.from(new Set([...primaryObj.instruments, ...secondaryObj.instruments]));

  // Calculate stats
  const totalMass = combinedInstruments.reduce((acc, id) => acc + INSTRUMENTS[id].mass, 0);
  const totalPower = combinedInstruments.reduce((acc, id) => acc + INSTRUMENTS[id].kw, 0);
  const totalScience = combinedInstruments.reduce((acc, id) => acc + INSTRUMENTS[id].science, 0);

  const applyPackage = () => {
    sfx.success();
    s.set({ instruments: combinedInstruments });
    onClose();
  };

  return (
    <div className="gm-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <section
        className="gm-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(94vw, 840px)",
          maxHeight: "86vh",
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          background: "#050f24f5",
          border: "1px solid #1c4580",
          borderRadius: "16px",
          boxShadow: "0 25px 70px rgba(0,0,0,0.85), 0 0 50px rgba(28,69,128,0.4)",
          backdropFilter: "blur(20px)",
          color: "#e6f1ff",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #153363", paddingBottom: "14px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ display: "grid", placeItems: "center", width: "34px", height: "34px", borderRadius: "8px", background: "rgba(35, 116, 225, 0.25)", color: "#58a6ff" }}>
              <Sparkles size={20} />
            </span>
            <div>
              <h2 style={{ margin: 0, fontSize: "19px", fontWeight: 700, color: "#fff" }}>SCIENCE MISSION PLANNER</h2>
              <p style={{ margin: 0, fontSize: "12px", color: "#8dafd8" }}>
                Target: <b>{s.mission}</b> · Configure Science Objectives & Payload Architecture
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#8dafd8", cursor: "pointer", padding: "6px" }}>
            <X size={22} />
          </button>
        </header>

        {/* Content scroll area */}
        <div style={{ flex: 1, overflowY: "auto", paddingRight: "6px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <h3 style={{ margin: "0 0 8px", fontSize: "14px", color: "#61a8ff", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              1. What are you trying to discover? (Select Primary & Secondary Focus)
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
              {OBJECTIVES.map((obj) => {
                const isPrimary = primary === obj.id;
                const isSecondary = secondary === obj.id;
                const isSelected = isPrimary || isSecondary;

                return (
                  <div
                    key={obj.id}
                    onClick={() => {
                      sfx.click();
                      if (isPrimary) return;
                      if (isSecondary) {
                        setSecondary(primary);
                        setPrimary(obj.id);
                      } else {
                        setSecondary(obj.id);
                      }
                    }}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      border: isSelected ? "1.5px solid #388bfd" : "1px solid #143566",
                      background: isSelected ? "rgba(35, 116, 225, 0.2)" : "rgba(8, 24, 52, 0.5)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "18px" }}>{obj.icon}</span>
                      {isPrimary && (
                        <span style={{ fontSize: "10px", fontWeight: 700, background: "#238636", color: "#fff", padding: "2px 8px", borderRadius: "10px" }}>
                          PRIMARY
                        </span>
                      )}
                      {isSecondary && (
                        <span style={{ fontSize: "10px", fontWeight: 700, background: "#1f6feb", color: "#fff", padding: "2px 8px", borderRadius: "10px" }}>
                          SECONDARY
                        </span>
                      )}
                    </div>
                    <b style={{ fontSize: "13px", color: "#fff", display: "block", marginBottom: "4px" }}>{obj.label}</b>
                    <p style={{ margin: 0, fontSize: "11px", color: "#8dafd8", lineHeight: 1.4 }}>{obj.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Payload Recommendation */}
          <div style={{ background: "rgba(10, 30, 66, 0.6)", border: "1px solid #1c4580", borderRadius: "12px", padding: "16px" }}>
            <h3 style={{ margin: "0 0 10px", fontSize: "14px", color: "#7ee787", display: "flex", alignItems: "center", gap: "6px" }}>
              <Check size={16} /> Recommended Scientific Payload Package
            </h3>
            <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#b9d2f0" }}>
              To satisfy <b>{primaryObj.label}</b> and <b>{secondaryObj.label}</b> at <b>{s.mission}</b>, Mission Forge recommends equipping:
            </p>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              {combinedInstruments.map((id) => (
                <div
                  key={id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(0, 0, 0, 0.4)",
                    border: "1px solid rgba(88, 166, 255, 0.3)",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                >
                  <b style={{ color: "#fff" }}>{INSTRUMENTS[id].name}</b>
                  <span style={{ color: "#749fc9", fontSize: "11px" }}>
                    {INSTRUMENTS[id].mass} kg · {INSTRUMENTS[id].kw} kW
                  </span>
                </div>
              ))}
            </div>

            {/* Trade-offs Analysis */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "12px" }}>
              <div>
                <span style={{ fontSize: "11px", color: "#8dafd8", display: "block" }}>TOTAL SCIENCE YIELD</span>
                <b style={{ fontSize: "16px", color: "#7ee787" }}>+{totalScience} pts</b>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "#8dafd8", display: "block" }}>ADDED MASS (PENALIZES Δv)</span>
                <b style={{ fontSize: "16px", color: "#ffd38a" }}>+{totalMass} kg</b>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "#8dafd8", display: "block" }}>ELECTRICAL POWER DEMAND</span>
                <b style={{ fontSize: "16px", color: "#79c0ff" }}>+{totalPower.toFixed(2)} kW</b>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #153363", paddingTop: "14px", marginTop: "14px" }}>
          <span style={{ fontSize: "11px", color: "#749fc9" }}>
            Mission Forge Educational Trade-off Model · Physics: Δv ∝ ln(m₀ / m_f)
          </span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={onClose}
              style={{ padding: "8px 16px", borderRadius: "6px", background: "transparent", border: "1px solid #285494", color: "#8dafd8", fontSize: "13px", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              onClick={applyPackage}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 20px",
                borderRadius: "6px",
                background: "#2563eb",
                color: "#ffffff",
                border: "none",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                boxShadow: "0 0 15px rgba(37, 99, 235, 0.4)",
              }}
            >
              Apply Science Payload <ArrowRight size={15} />
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
