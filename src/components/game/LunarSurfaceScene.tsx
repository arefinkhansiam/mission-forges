import { useState, useMemo } from "react";
import * as THREE from "three";
import { Stars } from "@react-three/drei";
import { useMissionStore } from "../../stores/mission-store";
import { Spacecraft } from "./Spacecraft";
import { designOf } from "../../stores/mission-store";
import { Button } from "../ui/button";
import { Check, Sparkles, Compass, ArrowRight, ShieldCheck, Microscope } from "lucide-react";

const lunarRegolithMaterial = new THREE.MeshStandardMaterial({
  color: "#555b62",
  roughness: 0.95,
  metalness: 0.05,
});

export interface LunarCandidateSite {
  id: string;
  name: string;
  type: string;
  pos: [number, number, number];
  waterIce: boolean;
  scientificValue: number;
  description: string;
}

export const LUNAR_SCIENCE_SITES: LunarCandidateSite[] = [
  {
    id: "shackleton",
    name: "Shackleton Crater Rim",
    type: "South Pole Volatile Trap",
    pos: [0, 0, -8],
    waterIce: true,
    scientificValue: 98,
    description: "Permanently shadowed depression. Spectrometer registers hydrogen signatures indicative of subsurface water-ice deposits.",
  },
  {
    id: "procellarum",
    name: "Oceanus Procellarum",
    type: "Smooth Basaltic Plain",
    pos: [-18, 0, 8],
    waterIce: false,
    scientificValue: 74,
    description: "Extensive mare volcanic basalt. High landing safety margin; low slope angle suitable for long-term habitats.",
  },
  {
    id: "serenitatis",
    name: "Mare Serenitatis Highlands",
    type: "Crustal Anorthosite Massif",
    pos: [18, 0, 8],
    waterIce: false,
    scientificValue: 82,
    description: "Ancient pristine crustal highland rocks dating back 4.4 billion years to magma ocean crystallization.",
  },
];

const DEFAULT_LUNAR_SITE: LunarCandidateSite = LUNAR_SCIENCE_SITES[0]!;

export function LunarSurfaceScene() {
  const s = useMissionStore();
  const d = designOf(s);
  const setStore = useMissionStore((st) => st.set);
  const go = useMissionStore((st) => st.go);
  const say = useMissionStore((st) => st.say);

  const [selectedSiteId, setSelectedSiteId] = useState<string>("shackleton");
  const [surveyed, setSurveyed] = useState(s.lunarSurveyCompleted || false);
  const selectedSite = LUNAR_SCIENCE_SITES.find((site) => site.id === selectedSiteId) ?? DEFAULT_LUNAR_SITE;

  // Procedural Lunar Cratering Geometry
  const lunarTerrain = useMemo(() => {
    const geo = new THREE.PlaneGeometry(160, 160, 64, 64);
    const pos = geo.getAttribute("position");
    if (pos) {
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        // Crater depressions and undulating hills
        const r1 = Math.sqrt(x * x + y * y);
        const crater = Math.exp(-Math.pow(r1 - 12, 2) / 25) * -1.8;
        const noise = Math.sin(x * 0.15) * Math.cos(y * 0.15) * 0.9;
        pos.setZ(i, crater + noise);
      }
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const handleCompleteSurvey = () => {
    setSurveyed(true);
    setStore({
      lunarSurveyCompleted: true,
      lunarSiteSelected: selectedSite.name,
      lunarSurveyData: {
        site: selectedSite.name,
        waterIce: selectedSite.waterIce,
        score: selectedSite.scientificValue,
        description: selectedSite.description,
      },
    });
    say(`Survey complete at ${selectedSite.name}! Science data acquired.`, "ok");
  };

  return (
    <>
      {/* 3D Lunar Environment */}
      <color attach="background" args={["#000002"]} />
      <fog attach="fog" args={["#000002", 50, 180]} />
      <Stars radius={120} depth={50} count={3500} factor={4} fade />
      <ambientLight intensity={0.25} color="#60A5FA" />
      <directionalLight position={[30, 45, 20]} intensity={2.8} color="#FFFFFF" castShadow />

      {/* Earth Hanging in the Black Lunar Sky */}
      <group position={[-35, 42, -50]}>
        <mesh>
          <sphereGeometry args={[7.5, 48, 48]} />
          <meshStandardMaterial
            color="#2563EB"
            emissive="#1D4ED8"
            emissiveIntensity={0.2}
            roughness={0.7}
          />
        </mesh>
        {/* Atmospheric Blue Halo */}
        <mesh scale={1.04}>
          <sphereGeometry args={[7.5, 32, 32]} />
          <meshBasicMaterial color="#60A5FA" transparent opacity={0.25} side={THREE.BackSide} />
        </mesh>
      </group>

      {/* Lunar Surface Regolith Terrain */}
      <mesh
        geometry={lunarTerrain}
        material={lunarRegolithMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        receiveShadow
      />

      {/* Scattered Regolith Boulders */}
      {Array.from({ length: 30 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * 9.3) * 45,
            0.2,
            Math.cos(i * 5.7) * 45,
          ]}
          scale={0.4 + (i % 4) * 0.3}
          material={lunarRegolithMaterial}
        >
          <dodecahedronGeometry args={[1, 0]} />
        </mesh>
      ))}

      {/* 3 Candidate Reconnaissance Sites (Waypoints) */}
      {LUNAR_SCIENCE_SITES.map((site) => {
        const isCurrent = site.id === selectedSiteId;
        return (
          <group key={site.id} position={site.pos}>
            {/* Beacon Light Cylinder */}
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 5, 8]} />
              <meshBasicMaterial color={isCurrent ? "#00E5FF" : "#94A3B8"} />
            </mesh>
            {/* Glowing Waypoint Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
              <ringGeometry args={[3.0, 3.6, 32]} />
              <meshBasicMaterial
                color={isCurrent ? "#00E5FF" : "#64748B"}
                transparent
                opacity={isCurrent ? 0.8 : 0.4}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}

      {/* Landed Spacecraft on Lunar Surface */}
      <group position={[0, 0.6, 0]}>
        <Spacecraft design={d} variant="lander" targetSize={3.0} />
      </group>
    </>
  );
}

/**
 * 2D HUD Overlay for the Moon Reconnaissance Mission
 */
export function LunarObjectiveOverlay() {
  const s = useMissionStore();
  const go = useMissionStore((st) => st.go);
  const setStore = useMissionStore((st) => st.set);
  const say = useMissionStore((st) => st.say);

  const [selectedSiteId, setSelectedSiteId] = useState<string>("shackleton");
  const [surveyed, setSurveyed] = useState(s.lunarSurveyCompleted || false);
  const selectedSite = LUNAR_SCIENCE_SITES.find((site) => site.id === selectedSiteId) ?? DEFAULT_LUNAR_SITE;

  const handleConductRecon = () => {
    setSurveyed(true);
    setStore({
      lunarSurveyCompleted: true,
      lunarSiteSelected: selectedSite.name,
      lunarSurveyData: {
        site: selectedSite.name,
        waterIce: selectedSite.waterIce,
        score: selectedSite.scientificValue,
        description: selectedSite.description,
      },
    });
    say(`Survey complete at ${selectedSite.name}! Telemetry secured.`, "ok");
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Mission Telemetry Bar */}
      <div className="pointer-events-auto flex items-start justify-between gap-4">
        <div className="rounded-xl border border-cyan-500/40 bg-slate-950/85 p-3.5 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-cyan-400">
            <Compass className="size-4 animate-spin-slow" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              LUNAR RECONNAISSANCE · SURFACE SCIENTIFIC SURVEY
            </span>
          </div>
          <h2 className="mt-0.5 text-base font-extrabold text-slate-100 sm:text-lg">
            Moon: South Pole Reconnaissance
          </h2>
          <p className="text-[11px] text-slate-400">
            Gravity: 1.62 m/s² · Atmosphere: Vacuum · Objective: Find a Safe Science Site
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => go("menu")}
          className="pointer-events-auto border-cyan-500/40 bg-slate-950/80 text-xs text-cyan-300 hover:text-white"
        >
          Mission Control
        </Button>
      </div>

      {/* Bottom Objective Interaction Card */}
      <div className="pointer-events-auto mx-auto w-full max-w-xl rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Microscope className="size-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Candidate Landing & Science Sites
            </span>
          </div>
          {surveyed ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
              <Check className="size-3.5" /> Objective Completed
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-amber-400 animate-pulse">
              Select Site to Survey
            </span>
          )}
        </div>

        {/* Site Selection Buttons */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {LUNAR_SCIENCE_SITES.map((site) => {
            const isChosen = site.id === selectedSiteId;
            return (
              <button
                key={site.id}
                onClick={() => setSelectedSiteId(site.id)}
                className={`flex flex-col rounded-xl border p-2.5 text-left transition-all ${
                  isChosen
                    ? "border-cyan-400 bg-cyan-950/40 shadow-sm"
                    : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/60"
                }`}
              >
                <span className="text-xs font-bold text-slate-100">{site.name}</span>
                <span className="text-[10px] text-cyan-300">{site.type}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Site Details */}
        <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">{selectedSite.name}</span>
            <span className="font-mono text-xs font-extrabold text-cyan-400">
              Score Value: {selectedSite.scientificValue} / 100
            </span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
            {selectedSite.description}
          </p>
          {selectedSite.waterIce && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-emerald-300">
              <Sparkles className="size-3.5 text-emerald-400" />
              Subsurface volatile water-ice detected! Critical Artemis resource.
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">
          {!surveyed ? (
            <Button
              onClick={handleConductRecon}
              className="bg-cyan-500 font-bold text-slate-950 hover:bg-cyan-400 text-xs"
            >
              <Microscope className="mr-1.5 size-4" /> Conduct Scientific Survey
            </Button>
          ) : (
            <Button
              onClick={() => go("report")}
              className="bg-emerald-500 font-bold text-slate-950 hover:bg-emerald-400 text-xs"
            >
              <ShieldCheck className="mr-1.5 size-4" /> View Mission Results Report
              <ArrowRight className="ml-1 size-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => go("menu")}
            className="text-xs text-slate-400 hover:text-white"
          >
            Mission Control
          </Button>
        </div>
      </div>
    </div>
  );
}
