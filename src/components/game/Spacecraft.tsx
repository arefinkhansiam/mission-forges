import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { Design, MissionId } from "../../lib/mission-sim";
import { Nasa3DModel } from "./Nasa3DModel";
import { useMissionStore } from "../../stores/mission-store";

export interface NasaCraftModelInfo {
  id: string;
  url: string;
  name: string;
  classType: "Heavy Rocket" | "Surface Lander" | "Deep Space Orbiter" | "Interstellar Probe" | "Flagship Probe";
  agency: string;
  historicalMission: string;
  launchDate: string;
  destination: string;
  achievements: string;
  specs: {
    dryMass: string;
    propulsion: string;
    power: string;
    payloadCapacity: string;
  };
  notes: string;
}

export const NASA_SPACECRAFT_CATALOG: Record<string, NasaCraftModelInfo> = {
  "saturn-v": {
    id: "saturn-v",
    url: "/models/saturn-v.glb",
    name: "Saturn V / Artemis Heavy Launch System",
    classType: "Heavy Rocket",
    agency: "NASA / Marshall Space Flight Center / Boeing",
    historicalMission: "Apollo & Artemis Deep Space Programs",
    launchDate: "1967 - Present",
    destination: "Translunar Injection & Deep Solar System",
    achievements: "Carried 24 humans to the Moon with 100% mission flight success record (34.5 MN thrust).",
    specs: {
      dryMass: "130,000 kg (Stage 3 + ESM)",
      propulsion: "5 × F-1 RP-1/LOX + 5 × J-2 Hydrolox",
      power: "Fuel Cells & Solar Array Wings (11 kW)",
      payloadCapacity: "45,000 kg to TLI",
    },
    notes: "The most powerful operational rocket ever built for lunar and interplanetary injection.",
  },
  "apollo-lm": {
    id: "apollo-lm",
    url: "/models/apollo-lunar-module.glb",
    name: "Apollo Lunar Descent Module (LM)",
    classType: "Surface Lander",
    agency: "NASA / Grumman Aerospace",
    historicalMission: "Apollo 11, 12, 14, 15, 16, 17",
    launchDate: "1969 - 1972",
    destination: "Lunar Surface (Mare Tranquillitatis, Taurus-Littrow)",
    achievements: "First crewed spacecraft to land on an extraterrestrial body; 6 flawless lunar touchdowns.",
    specs: {
      dryMass: "4,280 kg",
      propulsion: "Throttleable DPS Aerozine-50/NTO (43.9 kN)",
      power: "5 × Silver-Zinc Batteries (28 V, 400 Ah)",
      payloadCapacity: "1,080 kg scientific ALSEP equipment",
    },
    notes: "Two-stage vehicle featuring steerable landing radar and variable-thrust hypergolic descent engine.",
  },
  "mro": {
    id: "mro",
    url: "/models/mro.glb",
    name: "Mars Reconnaissance Orbiter (MRO)",
    classType: "Deep Space Orbiter",
    agency: "NASA / JPL-Caltech / Lockheed Martin",
    historicalMission: "Mars Reconnaissance Orbiter (2005 - Active)",
    launchDate: "August 12, 2005",
    destination: "Mars Sun-Synchronous Polar Orbit (250-320 km)",
    achievements: "Mapped over 99% of Mars in high-resolution; detected active subsurface ice glaciers and gullies.",
    specs: {
      dryMass: "1,031 kg",
      propulsion: "6 × 170N Monopropellant Hydrazine Thrusters",
      power: "2 × Solar Arrays (20 m², 7.5 kW at 1 AU)",
      payloadCapacity: "139 kg optical/radar science package",
    },
    notes: "Equipped with the 0.5m aperture HiRISE telescope and SHARAD subsurface ice radar sounder.",
  },
  "viking": {
    id: "viking",
    url: "/models/viking-lander.glb",
    name: "Viking Mars Exobiology Lander",
    classType: "Surface Lander",
    agency: "NASA / Langley Research Center / Martin Marietta",
    historicalMission: "Viking 1 & 2 (1975 - 1982)",
    launchDate: "August 20, 1975",
    destination: "Mars Chryse Planitia & Utopia Planitia",
    achievements: "First operational long-duration Mars surface laboratory; performed first biological soil tests.",
    specs: {
      dryMass: "572 kg",
      propulsion: "3 × 2,800N Hydrazine Terminal Descent Thrusters",
      power: "2 × SNAP-19 Radioisotope Generators (70 W RTG)",
      payloadCapacity: "91 kg robotic GCMS science suite",
    },
    notes: "Pioneered planetary protection, hypersonic aeroshell entry, and robotic soil sample scoop extraction.",
  },
  "cassini": {
    id: "cassini",
    url: "/models/cassini-huygens.glb",
    name: "Cassini-Huygens Flagship Explorer",
    classType: "Flagship Probe",
    agency: "NASA / ESA / ASI / JPL-Caltech",
    historicalMission: "Cassini-Huygens (1997 - 2017)",
    launchDate: "October 15, 1997",
    destination: "Saturnian System & Titan Atmospheric Descent",
    achievements: "Discovered Enceladus water geysers, Titan liquid methane lakes, and completed Grand Finale dives.",
    specs: {
      dryMass: "2,523 kg",
      propulsion: "2 × 445N Bi-propellant NTO/MMH Engines",
      power: "3 × GPHS-RTG Plutonium-238 Generators (885 W)",
      payloadCapacity: "382 kg 12-instrument science suite",
    },
    notes: "Carried a 4-meter Cassegrain high-gain dish and 11 km/s atmospheric entry probe to Titan.",
  },
  "dawn": {
    id: "dawn",
    url: "/models/dawn.glb",
    name: "Dawn Xenon Ion Asteroid Cruiser",
    classType: "Deep Space Orbiter",
    agency: "NASA / JPL-Caltech / Orbital Sciences",
    historicalMission: "Dawn (2007 - 2018)",
    launchDate: "September 27, 2007",
    destination: "Asteroid Vesta & Dwarf Planet Ceres",
    achievements: "First spacecraft to orbit two different extraterrestrial bodies in deep space.",
    specs: {
      dryMass: "747 kg",
      propulsion: "3 × NSTAR Electrostatic Xenon Ion Thrusters (Isp 3100 s)",
      power: "2 × 19.7m Ultra-High Efficiency Solar Wings (10 kW)",
      payloadCapacity: "45 kg framing cameras & spectrometer",
    },
    notes: "Demonstrated continuous low-thrust ion propulsion across 6.9 billion kilometers of interplanetary cruising.",
  },
  "galileo": {
    id: "galileo",
    url: "/models/galileo.glb",
    name: "Galileo Jovian Atmospheric Orbiter",
    classType: "Deep Space Orbiter",
    agency: "NASA / JPL-Caltech / Messerschmitt-Bölkow-Blohm",
    historicalMission: "Galileo (1989 - 2003)",
    launchDate: "October 18, 1989",
    destination: "Jupiter & Galilean Moons (Europa, Ganymede, Io)",
    achievements: "First spacecraft to orbit Jupiter; deployed entry probe that withstood 228 g deceleration and 155,000°C shock layer.",
    specs: {
      dryMass: "2,223 kg",
      propulsion: "400N Main Engine + 12 × 10N RCS Thrusters",
      power: "2 × GPHS-RTG Radioisotope Units (570 W)",
      payloadCapacity: "339 kg probe + 118 kg orbiter science",
    },
    notes: "Discovered subsurface liquid oceans on Europa and confirmed intense volcanic activity on Io.",
  },
  "voyager": {
    id: "voyager",
    url: "/models/voyager-probe.glb",
    name: "Voyager Interstellar Mission Probe",
    classType: "Interstellar Probe",
    agency: "NASA / JPL-Caltech",
    historicalMission: "Voyager 1 & 2 (1977 - Active)",
    launchDate: "August 20 / September 5, 1977",
    destination: "Jupiter, Saturn, Uranus, Neptune & Interstellar Space",
    achievements: "Most distant human-made object in existence (>24 billion km from Earth); crossed heliopause into interstellar space.",
    specs: {
      dryMass: "773 kg",
      propulsion: "Hydrazine Monopropellant Thrusters (Catalytic)",
      power: "3 × Multi-Hundred-Watt MHW-RTGs (470 W)",
      payloadCapacity: "105 kg science payload + Golden Record",
    },
    notes: "Carries the Golden Record cultural time capsule and continues sending telemetry via the Deep Space Network.",
  },
};

export function getMissionModel(mission: MissionId, variant?: "full" | "lander" | "rescue"): NasaCraftModelInfo {
  if (variant === "lander") {
    switch (mission) {
      case "Mars":
        return NASA_SPACECRAFT_CATALOG["viking"]!;
      case "Moon":
        return NASA_SPACECRAFT_CATALOG["apollo-lm"]!;
      case "Ceres":
        return NASA_SPACECRAFT_CATALOG["dawn"]!;
      case "Jupiter":
        return NASA_SPACECRAFT_CATALOG["galileo"]!;
      case "Saturn":
        return NASA_SPACECRAFT_CATALOG["cassini"]!;
    }
  }

  if (variant === "rescue") {
    return {
      ...NASA_SPACECRAFT_CATALOG["apollo-lm"]!,
      name: "Apollo Autonomous Rescue Craft",
      historicalMission: "Apollo CSM/LM Docking Systems",
      notes: "Equipped with active docking interface and reaction control thrusters.",
    };
  }

  switch (mission) {
    case "Moon":
      return NASA_SPACECRAFT_CATALOG["saturn-v"]!;
    case "Mars":
      return NASA_SPACECRAFT_CATALOG["mro"]!;
    case "Ceres":
      return NASA_SPACECRAFT_CATALOG["dawn"]!;
    case "Jupiter":
      return NASA_SPACECRAFT_CATALOG["galileo"]!;
    case "Saturn":
      return NASA_SPACECRAFT_CATALOG["cassini"]!;
    default:
      return NASA_SPACECRAFT_CATALOG["saturn-v"]!;
  }
}

export function Flame({ power = 1, length = 1.4, radius = 0.22, y = 0 }: { power?: number; length?: number; radius?: number; y?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const f = 0.85 + Math.sin(clock.elapsedTime * 60) * 0.08 + Math.sin(clock.elapsedTime * 23) * 0.07;
    g.scale.set(1, Math.max(0.001, power * f), 1);
    g.visible = power > 0.01;
  });
  return (
    <group ref={ref} position-y={y}>
      <mesh position-y={-length / 2}>
        <coneGeometry args={[radius, length, 20, 1, true]} />
        <meshBasicMaterial color="#ffb35a" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position-y={-length * 0.3} rotation-x={Math.PI}>
        <coneGeometry args={[radius * 0.55, length * 0.6, 16, 1, true]} />
        <meshBasicMaterial color="#cfe8ff" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

// 3D Visual Holographic Mounting Marker for Installed Scientific Sensors
function InstrumentMarker({ index, total, name }: { index: number; total: number; name: string }) {
  const angle = (index / total) * Math.PI * 2;
  const radius = 1.55;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = -0.2 + (index % 3) * 0.35;

  return (
    <group position={[x, y, z]}>
      {/* Sensor Pod Marker */}
      <mesh>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} metalness={0.9} />
      </mesh>
      {/* Sensor Connector Stalk */}
      <line>
        <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(-x * 0.45, 0, -z * 0.45),
        ])} />
        <lineBasicMaterial attach="material" color="#38bdf8" transparent opacity={0.5} />
      </line>
      {/* Pulsing Holo Ring */}
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry args={[0.11, 0.14, 24]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function Spacecraft({
  design,
  deploy = 1,
  thrust = 0,
  variant = "full",
  targetSize = 2.4,
}: {
  design: Design;
  deploy?: number;
  thrust?: number;
  variant?: "full" | "lander" | "rescue";
  targetSize?: number;
}) {
  const activeNasaModel = useMissionStore((s) => s.activeNasaModel);
  // Ensure the spacecraft model selected by the user is preserved across all flight and landing phases
  const info = getMissionModel(design.mission, variant === "rescue" ? "rescue" : "full");
  const modelUrl = activeNasaModel ? activeNasaModel : info.url;

  const isIon = design.engine === "ion";
  const flameLength = isIon ? 1.0 : 1.7;
  const flameRadius = isIon ? 0.14 : 0.26;
  const flameY = variant === "lander" ? -0.8 : -1.2;

  return (
    <group>
      {/* Authentic NASA 3D Spacecraft Model */}
      <Nasa3DModel
        modelUrl={modelUrl}
        targetSize={targetSize}
        autoRotate={false}
      />

      {/* Dynamic Thruster Propulsion Plume */}
      {thrust > 0.01 && (
        <Flame
          power={thrust}
          y={flameY}
          length={flameLength}
          radius={flameRadius}
        />
      )}

      {/* Active Scientific Instrument Nodes Mounted on Spacecraft */}
      {design.instruments && design.instruments.length > 0 && (
        <group>
          {design.instruments.map((inst, i) => (
            <InstrumentMarker
              key={inst}
              index={i}
              total={design.instruments.length}
              name={inst}
            />
          ))}
        </group>
      )}
    </group>
  );
}
