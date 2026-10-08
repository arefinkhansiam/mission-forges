import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { Design, MissionId } from "../../lib/mission-sim";
import { Nasa3DModel } from "./Nasa3DModel";
import { useMissionStore } from "../../stores/mission-store";

export interface NasaCraftModelInfo {
  url: string;
  name: string;
  agency: string;
  historicalMission: string;
  notes: string;
}

export function getMissionModel(mission: MissionId, variant?: "full" | "lander" | "rescue"): NasaCraftModelInfo {
  if (variant === "lander") {
    switch (mission) {
      case "Mars":
        return {
          url: "/models/viking-lander.glb",
          name: "NASA Viking Surface Lander",
          agency: "NASA / Langley Research Center",
          historicalMission: "Viking 1 & 2 (1976)",
          notes: "First successful operational Mars surface lander with GCMS and biology laboratory.",
        };
      case "Moon":
        return {
          url: "/models/apollo-lunar-module.glb",
          name: "Apollo Lunar Module (LM)",
          agency: "NASA / Grumman Aerospace",
          historicalMission: "Apollo Program (1969-1972)",
          notes: "Two-stage spacecraft designed for descent from lunar orbit to touchdown.",
        };
      case "Ceres":
        return {
          url: "/models/dawn.glb",
          name: "Dawn Ion Asteroid Explorer",
          agency: "NASA / JPL-Caltech",
          historicalMission: "Dawn (2007-2018)",
          notes: "Ion-powered explorer of Vesta and dwarf planet Ceres.",
        };
      case "Jupiter":
        return {
          url: "/models/galileo.glb",
          name: "Galileo Atmospheric Entry Probe",
          agency: "NASA / JPL-Caltech",
          historicalMission: "Galileo (1989-2003)",
          notes: "Carried extreme heatshield for direct descent into Jovian gas envelope.",
        };
      case "Saturn":
        return {
          url: "/models/cassini-huygens.glb",
          name: "Cassini-Huygens Titan Atmospheric Probe",
          agency: "NASA / ESA / ASI",
          historicalMission: "Cassini-Huygens (1997-2017)",
          notes: "Carried Huygens probe through Titan's methane atmosphere and explored Saturn.",
        };
    }
  }

  if (variant === "rescue") {
    return {
      url: "/models/apollo-lunar-module.glb",
      name: "Apollo Autonomous Rescue Craft",
      agency: "NASA / North American Aviation",
      historicalMission: "Apollo CSM/LM Systems",
      notes: "Equipped with active docking interface and reaction control thrusters.",
    };
  }

  switch (mission) {
    case "Moon":
      return {
        url: "/models/apollo-lunar-module.glb",
        name: "Apollo Lunar Module",
        agency: "NASA / Grumman",
        historicalMission: "Apollo Program",
        notes: "Historical NASA lunar landing vehicle with steerable radar and descent engine.",
      };
    case "Mars":
      return {
        url: "/models/mro.glb",
        name: "Mars Reconnaissance Orbiter (MRO)",
        agency: "NASA / JPL-Caltech / Lockheed Martin",
        historicalMission: "MRO (2005-Present)",
        notes: "High-resolution planetary orbiter equipped with 3m high-gain dish and HiRISE camera.",
      };
    case "Ceres":
      return {
        url: "/models/dawn.glb",
        name: "Dawn Asteroid Explorer",
        agency: "NASA / JPL-Caltech / Orbital Sciences",
        historicalMission: "Dawn (2007-2018)",
        notes: "Utilized NSTAR xenon ion propulsion with 19.7m solar arrays.",
      };
    case "Jupiter":
      return {
        url: "/models/galileo.glb",
        name: "Galileo Jupiter Orbiter",
        agency: "NASA / JPL-Caltech",
        historicalMission: "Galileo (1989-2003)",
        notes: "First spacecraft to orbit an outer planet and release an atmospheric probe.",
      };
    case "Saturn":
      return {
        url: "/models/cassini-huygens.glb",
        name: "Cassini-Huygens Saturn Orbiter",
        agency: "NASA / ESA / ASI / JPL",
        historicalMission: "Cassini-Huygens (1997-2017)",
        notes: "Flagship outer-system orbiter with 4-meter high-gain antenna and 3 RTGs.",
      };
    default:
      return {
        url: "/models/mro.glb",
        name: "NASA Deep Space Orbiter",
        agency: "NASA",
        historicalMission: "NASA Planetary Exploration",
        notes: "Official NASA 3D Resource model.",
      };
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
  const info = getMissionModel(design.mission, variant);
  const modelUrl = (variant === "full" && activeNasaModel) ? activeNasaModel : info.url;

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
    </group>
  );
}
