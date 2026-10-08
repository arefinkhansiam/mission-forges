import { X, ExternalLink, Info, Scale, Zap, Shield, HelpCircle } from "lucide-react";
import { ENGINES, INSTRUMENTS, type EngineId, type Instrument } from "../../lib/mission-sim";
import { SOURCES } from "../../lib/nasa-data";

export type ComponentDetailType =
  | { kind: "engine"; id: EngineId }
  | { kind: "instrument"; id: Instrument }
  | { kind: "power"; item: "solar" | "rtg" | "battery" }
  | { kind: "tank" }
  | { kind: "comms" }
  | { kind: "shield" };

interface ComponentDetailDrawerProps {
  item: ComponentDetailType | null;
  onClose: () => void;
}

export function ComponentDetailDrawer({ item, onClose }: ComponentDetailDrawerProps) {
  if (!item) return null;

  let title = "";
  let subtitle = "";
  let realReference = "";
  let gameModel = "";
  let whyItMatters = "";
  let physicsCalculation: { formula: string; explanation: string; isRealPhysics: boolean } | null = null;
  let source = "";
  let sourceUrl = "https://www.nasa.gov/";

  if (item.kind === "engine") {
    const e = ENGINES[item.id];
    title = e.name;
    subtitle = `${e.isp} s Isp · ${e.thrust} · ${e.mass} kg`;
    source = e.source;

    if (item.id === "chemical") {
      realReference = "The Aerojet Rocketdyne RL10 is a cryogenic liquid hydrogen / liquid oxygen engine with over 50 years of flight heritage, powering the Centaur upper stage and SLS Interim Cryogenic Propulsion Stage (ICPS).";
      gameModel = "In Mission Forge, chemical engines offer high instantaneous thrust (110 kN) enabling rapid burn arcs, but have lower fuel efficiency (Isp 462 s), requiring larger propellant reserves.";
      whyItMatters = "Essential for planetary orbital insertion and landing burns where high thrust-to-weight ratio (TWR) is mandatory to overcome gravitational acceleration.";
      physicsCalculation = {
        formula: "Δv = Isp · g₀ · ln(m₀ / m_f)",
        explanation: "Tsiolkovsky Rocket Equation. Acceleration is proportional to exhaust velocity (Isp · g₀), but payload mass penalizes overall velocity logarithmically.",
        isRealPhysics: true,
      };
      sourceUrl = "https://www.nasa.gov/centers-and-facilities/glenn/";
    } else if (item.id === "ion") {
      realReference = "NASA's 30 cm NSTAR gridded electrostatic ion thruster powered the Deep Space 1 and Dawn spacecraft, ionizing xenon propellant and accelerating it through high-voltage electrostatic grids.";
      gameModel = "In Mission Forge, ion propulsion offers extraordinary specific impulse (3,100 s), drastically cutting fuel mass, but delivers micro-thrust (0.09 N) and demands 2.3 kW of electricity per engine.";
      whyItMatters = "Enables rendezvous with multiple deep-space bodies (like Dawn orbiting both Vesta and Ceres) on a fraction of the propellant mass required by chemical engines.";
      physicsCalculation = {
        formula: "Thrust = 2 · η · Power / (Isp · g₀)",
        explanation: "Electric propulsion efficiency relationship. High exhaust velocity demands significant electrical power for relatively modest instantaneous thrust.",
        isRealPhysics: true,
      };
      sourceUrl = "https://science.nasa.gov/mission/dawn/";
    } else if ((item.id as string) === "hall") {
      realReference = "The High Output Electric Propulsion (HERMeS) / Advanced Electric Propulsion System (AEPS) 12 kW Hall-effect thruster developed by NASA Glenn and Aerojet Rocketdyne for the Lunar Gateway Power and Propulsion Element (PPE).";
      gameModel = "Provides intermediate thrust (0.6 N) with high Isp (3,000 s), requiring 3.2 kW of power. Represents modern commercial and NASA Gateway electric propulsion.";
      whyItMatters = "Bridges the gap between ultra-low thrust ion engines and heavy chemical systems, optimal for cargo transit and stationkeeping in cis-lunar space.";
      physicsCalculation = {
        formula: "F = ṁ · v_e",
        explanation: "Hall-effect acceleration utilizes crossed electric and magnetic fields to trap electrons and accelerate xenon plasma.",
        isRealPhysics: true,
      };
      sourceUrl = "https://www.nasa.gov/humans-in-space/gateway/";
    } else if ((item.id as string) === "aerospike") {
      realReference = "NASA Marshall Space Flight Center tested the Linear Aerospike SR-71 flight experiments (LASRE) and X-33 subscale demonstrators in the late 1990s. The spike nozzle allows self-compensation for changing ambient atmospheric pressure.";
      gameModel = "Labeled 'Experimental Reference'. Features high atmospheric efficiency across all pressure regimes, but has a higher dry structural mass (450 kg).";
      whyItMatters = "Eliminates bell-nozzle flow separation at low altitudes and over-expansion at vacuum, providing near-ideal expansion from sea level to orbit.";
      physicsCalculation = {
        formula: "C_F = f(P_ambient / P_chamber)",
        explanation: "Nozzle thrust coefficient self-adjusts along the open wedge or spike as ambient atmospheric pressure changes with altitude.",
        isRealPhysics: true,
      };
      sourceUrl = "https://www.nasa.gov/centers-and-facilities/marshall/";
    } else if (item.id === "nuclear") {
      realReference = "The Nuclear Engine for Rocket Vehicle Application (NERVA) was a joint NASA/AEC program (1968–1972) that ground-tested nuclear thermal reactors using liquid hydrogen propellant heated to extreme temperatures in a solid uranium core.";
      gameModel = "Labeled 'Educational Concept'. Features exceptional Isp (841 s) and high thrust (333 kN), but comes with an enormous dry engine mass (10,000 kg), penalizing small spacecraft.";
      whyItMatters = "Historic technological benchmark demonstrating that nuclear fission heat transfer can double chemical specific impulse for human interplanetary travel.";
      physicsCalculation = {
        formula: "Isp ∝ √(T_chamber / Molecular_Weight)",
        explanation: "Using pure hydrogen (molecular weight ~2) heated to 2,500 K yields double the exhaust velocity of hydrogen/oxygen combustion (molecular weight ~18).",
        isRealPhysics: true,
      };
      sourceUrl = "https://www.nasa.gov/history/";
    }
  } else if (item.kind === "instrument") {
    const inst = INSTRUMENTS[item.id];
    title = inst.name;
    subtitle = `Mass: ${inst.mass} kg · Power Demand: ${inst.kw} kW · Yield: +${inst.science} pts`;
    source = SOURCES.factsheet;

    if (item.id === "camera") {
      realReference = "Based on planetary imaging systems such as HiRISE (MRO), Mastcam-Z (Perseverance), and LROC (LRO), utilizing multispectral charge-coupled device (CCD) and complementary metal-oxide-semiconductor (CMOS) sensors.";
      gameModel = "Baseline optical survey payload. Grants +35 science points for minimal mass (150 kg) and power (0.05 kW).";
      whyItMatters = "Images reveal surface geology, landing hazard topography, crater distribution, and provide direct navigational tracking.";
      physicsCalculation = {
        formula: "Resolution = 1.22 · λ · Distance / Aperture",
        explanation: "Diffraction-limited optical angular resolution governed by Rayleigh criterion across optical wavelengths.",
        isRealPhysics: true,
      };
    } else if (item.id === "spectrometer") {
      realReference = "Based on imaging spectrometers including MISE (Europa Clipper), CRISM (MRO), and VIMS (Cassini), dispersing light to identify characteristic atomic absorption lines.";
      gameModel = "Essential for chemical and mineral analysis. Grants +45 science points; requires 320 kg mass allowance and 0.1 kW power.";
      whyItMatters = "Detects water ice, carbonates, phyllosilicates, salts, and organic compounds without requiring physical ground contact.";
      physicsCalculation = {
        formula: "E = h · ν = h · c / λ",
        explanation: "Quantum molecular vibrational and electronic transitions absorb specific discrete wavelengths of reflected solar radiation.",
        isRealPhysics: true,
      };
    } else if (item.id === "radiation") {
      realReference = "Modeled after Curiosity's Radiation Assessment Detector (RAD) and Van Allen Probes energetic particle sensors measuring galactic cosmic rays and solar proton events.";
      gameModel = "Reduces flight hazard impact from solar storms and cosmic rays while yielding +15 science points for only 90 kg mass.";
      whyItMatters = "Characterizes biological and electronic ionizing radiation environments, vital for crew safety and electronics shielding.";
      physicsCalculation = {
        formula: "Absorbed Dose D = dE / dm",
        explanation: "Energy deposited by ionizing radiation per unit mass of detector material (measured in Grays or Sieverts).",
        isRealPhysics: true,
      };
    } else if (item.id === "radar") {
      realReference = "Based on ice-penetrating radar sounders such as REASON (Europa Clipper), MARSIS (Mars Express), and SHARAD (MRO), transmitting high-power RF pulses.";
      gameModel = "Unlocks subsurface science (+50 points). Weighs 190 kg and draws 0.08 kW.";
      whyItMatters = "Pierces through opaque dust, regolith, and kilometers of cryogenic water ice to map internal structural layers and subsurface oceans.";
      physicsCalculation = {
        formula: "Depth = c · Δt / (2 · √ε_r)",
        explanation: "Radar echo delay time Δt reveals subsurface dielectric permittivity interface depth (e.g. ice-water boundaries).",
        isRealPhysics: true,
      };
    } else if (item.id === "drone") {
      realReference = "Inspired by NASA's Ingenuity Mars Helicopter and the upcoming Dragonfly Titan rotorcraft, using dual counter-rotating coaxial rotors to fly through planetary atmospheres.";
      gameModel = "High-tier atmospheric exploration payload (+65 science points). Weighs 280 kg and draws 0.18 kW.";
      whyItMatters = "Provides aerial mobility across tens of kilometers of rugged terrain impassable to wheeled surface rovers.";
      physicsCalculation = {
        formula: "Lift = 0.5 · ρ · v² · S · C_L",
        explanation: "Rotor aerodynamic lift depends directly on atmospheric density ρ, requiring high blade tip speeds in thin air (Mars) or modest speeds in dense smog (Titan).",
        isRealPhysics: true,
      };
    }
  } else if (item.kind === "power") {
    if (item.item === "solar") {
      title = "High-Efficiency Solar Arrays";
      subtitle = "2.75 kW per wing at 1 AU · 190 kg mass";
      realReference = "NASA Orion ESM uses 4 solar wings with triple-junction gallium arsenide (GaAs) solar cells, generating over 11 kW at Earth.";
      gameModel = "Primary power source for inner solar system missions. Power output degrades strictly according to the inverse-square law with distance from the Sun.";
      whyItMatters = "Clean, sustainable power without nuclear fuel, but requires massive array surface area at Jupiter (~4% solar flux) and is ineffective at Saturn (~1%).";
      physicsCalculation = {
        formula: "P(d) = P_Earth / (d / 1 AU)²",
        explanation: "Inverse-Square Law of Solar Radiation. Solar flux decreases with the square of distance from the Sun.",
        isRealPhysics: true,
      };
      source = SOURCES.orion;
    } else if (item.item === "rtg") {
      title = "Multi-Mission Radioisotope Thermoelectric Generator (MMRTG)";
      subtitle = "110 W electrical output · 45 kg mass";
      realReference = "Utilized on Curiosity, Perseverance, Cassini, Galileo, and Voyager. Converts decay heat from plutonium-238 dioxide pellets into electricity using solid-state thermocouples.";
      gameModel = "Provides constant, reliable base power independent of solar distance or planetary day/night cycles. Essential for outer solar system destinations.";
      whyItMatters = "Keeps instruments warm in the cryogenic cold of deep space (-200°C) and operates uninterrupted for decades through dust storms and eclipses.";
      physicsCalculation = {
        formula: "Q(t) = Q₀ · (1/2)^(t / 87.7 yr)",
        explanation: "Radioactive decay law of Plutonium-238. Half-life is 87.7 years, ensuring continuous thermal and electric power over multi-decade flights.",
        isRealPhysics: true,
      };
      source = SOURCES.mmrtg;
    } else if (item.item === "battery") {
      title = "Secondary Lithium-Ion Energy Storage";
      subtitle = "Rechargeable peak load buffer";
      realReference = "High-specific-energy space-qualified lithium-ion cells with ceramic separators and thermal runaway containment.";
      gameModel = "Buffers peak electrical demand during intense engine burns and landing maneuvers, preventing brownouts.";
      whyItMatters = "Ensures critical navigation computers and transmitters remain operational during shadow transits and high-power radar sounding.";
      physicsCalculation = {
        formula: "Energy Capacity = Voltage · Current · Time (Wh)",
        explanation: "Electrochemical storage of electrical energy with charge/discharge Coulombic efficiency > 95%.",
        isRealPhysics: true,
      };
      source = SOURCES.factsheet;
    }
  } else if (item.kind === "tank") {
    title = "Composite Cryogenic Propellant Tanks";
    subtitle = "9,000 kg propellant capacity · 900 kg dry tank structure";
    realReference = "Carbon-fiber-reinforced polymer (CFRP) overwrapped pressure vessels with internal aluminum/titanium impermeable liners.";
    gameModel = "Each installed tank adds 9,000 kg of liquid propellant and 900 kg of dry structural mass, directly affecting the mass ratio in the Tsiolkovsky equation.";
    whyItMatters = "Stores cryogenic liquid hydrogen, liquid oxygen, or storable hypergols under high pressure and thermal insulation.",
    physicsCalculation = {
      formula: "m₀ / m_f = (m_dry + m_prop) / m_dry",
      explanation: "Propellant mass fraction. As tanks are added, wet mass m₀ increases, determining the natural logarithm factor in Δv.",
      isRealPhysics: true,
    };
    source = SOURCES.orion;
  } else if (item.kind === "shield") {
    title = "Multilayer Whipple Meteoroid & Radiation Shield";
    subtitle = "Nextel / Kevlar bumper + thermal vacuum blanket";
    realReference = "Invented by Fred Whipple for space missions; standoff bumper sheets vaporize hypervelocity micrometeoroids before they reach the pressure hull.";
    gameModel = "Absorbs route hazard impacts by 50% and provides thermal insulation against intense solar flux (>2.5x) near Mercury.";
    whyItMatters = "A single 2mm micrometeorite traveling at 20 km/s carries the kinetic energy of an anti-tank shell; standoff shields disperse this impact into harmless vapor.";
    physicsCalculation = {
      formula: "Kinetic Energy E_k = 0.5 · m · v²",
      explanation: "Hypervelocity impact physics. At interplanetary speeds (10–70 km/s), impacts are hydrodynamic, vaporizing projectile and bumper alike.",
      isRealPhysics: true,
    };
    source = SOURCES.factsheet;
  } else if (item.kind === "comms") {
    title = "High Gain Parabolic Dish Antenna (HGA)";
    subtitle = "Deep Space Network (DSN) Transceiver";
    realReference = "Dual-reflector Cassegrain parabolic reflector operating in X-band and Ka-band frequencies, tracking NASA DSN 70-meter ground stations.";
    gameModel = "Redundancy protection: equipping 2 antennas satisfies pre-launch flight rules and prevents communications blackout during solar storms.";
    whyItMatters = "Enables high-bandwidth telemetry and imagery downlink across millions of kilometers of interplanetary space.";
    physicsCalculation = {
      formula: "Gain G = (π · D / λ)² · η",
      explanation: "Parabolic antenna gain proportional to dish diameter D squared over wavelength λ squared.",
      isRealPhysics: true,
    };
    source = SOURCES.orion;
  }

  return (
    <div
      className="mf-component-drawer-backdrop"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        background: "rgba(0, 4, 14, 0.65)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <aside
        className="mf-component-drawer"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(92vw, 480px)",
          height: "100%",
          background: "#050f24f9",
          borderLeft: "1px solid #1c4580",
          boxShadow: "-10px 0 40px rgba(0,0,0,0.8)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          color: "#e6f1ff",
          overflowY: "auto",
        }}
      >
        {/* Drawer Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #153363", paddingBottom: "14px" }}>
          <div>
            <span style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#61a8ff", fontWeight: 700 }}>
              ENGINEERING COMPONENT SPECIFICATION
            </span>
            <h2 style={{ margin: "4px 0", fontSize: "20px", color: "#fff" }}>{title}</h2>
            <p style={{ margin: 0, fontSize: "12px", color: "#8dafd8" }}>{subtitle}</p>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#8dafd8", cursor: "pointer", padding: "4px" }}>
            <X size={20} />
          </button>
        </div>

        {/* Section 1: Real-World Reference */}
        <div style={{ background: "rgba(8, 24, 52, 0.6)", border: "1px solid #143566", borderRadius: "10px", padding: "14px" }}>
          <b style={{ color: "#79c0ff", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
            <Info size={14} /> REAL-WORLD NASA / AEROSPACE REFERENCE
          </b>
          <p style={{ margin: 0, fontSize: "13px", color: "#c9d1d9", lineHeight: 1.5 }}>
            {realReference}
          </p>
        </div>

        {/* Section 2: Mission Forge Game Model */}
        <div style={{ background: "rgba(8, 24, 52, 0.6)", border: "1px solid rgba(46, 160, 67, 0.3)", borderRadius: "10px", padding: "14px" }}>
          <b style={{ color: "#7ee787", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
            <Scale size={14} /> MISSION FORGE SIMULATION MODEL
          </b>
          <p style={{ margin: 0, fontSize: "13px", color: "#c9d1d9", lineHeight: 1.5 }}>
            {gameModel}
          </p>
        </div>

        {/* Section 3: Why This Matters */}
        <div style={{ background: "rgba(8, 24, 52, 0.6)", border: "1px solid #143566", borderRadius: "10px", padding: "14px" }}>
          <b style={{ color: "#ffd38a", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
            <Zap size={14} /> WHY DOES THIS COMPONENT MATTER?
          </b>
          <p style={{ margin: 0, fontSize: "13px", color: "#c9d1d9", lineHeight: 1.5 }}>
            {whyItMatters}
          </p>
        </div>

        {/* Section 4: Physics & How is this calculated */}
        {physicsCalculation && (
          <div style={{ background: "rgba(14, 43, 89, 0.4)", border: "1px solid #1f4f96", borderRadius: "10px", padding: "14px" }}>
            <b style={{ color: "#a5c2e8", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
              <HelpCircle size={14} /> HOW IS THIS CALCULATED? ({physicsCalculation.isRealPhysics ? "PHYSICS EQUATION" : "GAME ESTIMATE"})
            </b>
            <div style={{ fontFamily: "monospace", fontSize: "13px", background: "rgba(0,0,0,0.4)", padding: "6px 10px", borderRadius: "6px", color: "#74b3ff", margin: "6px 0" }}>
              {physicsCalculation.formula}
            </div>
            <p style={{ margin: 0, fontSize: "12px", color: "#8dafd8", lineHeight: 1.4 }}>
              {physicsCalculation.explanation}
            </p>
          </div>
        )}

        {/* Footer: Official Source Link */}
        <div style={{ marginTop: "auto", paddingTop: "14px", borderTop: "1px solid #153363", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color: "#749fc9" }}>
            Source: {source}
          </span>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#58a6ff", textDecoration: "none" }}
          >
            Documentation <ExternalLink size={12} />
          </a>
        </div>
      </aside>
    </div>
  );
}
