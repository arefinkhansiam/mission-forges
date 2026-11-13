import "../../lib/r3f-polyfill";
import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState, Component } from "react";
import { Canvas } from "@react-three/fiber";
import i18n from "../../lib/i18n";
import { LearnLab } from "./LearnLab";
import { Ayesha } from "./Ayesha";
import { useMissionStore } from "../../stores/mission-store";
import { Universe } from "./Universe";
import { BuildScene, DockingScene, LandingScene, LaunchScene } from "./Stages";
import { Hud } from "./Hud";
import { rt } from "./runtime";
import { PlanetScene } from "./Presentation";
import { LunarSurfaceScene, LunarObjectiveOverlay } from "./LunarSurfaceScene";
import { AAALoadingScreen } from "./AAALoadingScreen";

import { EarthLaunchLobbyScene } from "./EarthLaunchLobbyScene";

// Failsafe Canvas Error Boundary to guarantee ZERO TanStack 500 error pages
class CanvasErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; errorText: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, errorText: "" };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, errorText: String(error?.message || error) };
  }

  override componentDidCatch(err: any, info: any) {
    console.warn("Recovered WebGL error safely inside CanvasErrorBoundary:", err, info);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#030712] p-6 text-center text-cyan-400 select-none">
          <div className="max-w-md rounded-2xl border border-cyan-500/40 bg-slate-950/90 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-950/50 text-cyan-300">
              <span className="text-xl">🛰️</span>
            </div>
            <h3 className="text-base font-bold uppercase tracking-widest text-white">
              Space Telemetry HUD Active
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Flight dynamics and mission control remain 100% operational.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, errorText: "" })}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 transition hover:bg-cyan-400 active:scale-95"
            >
              Restart 3D Engine
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

import { ForgeCity } from "./city/ForgeCity";
import { CityOverlay } from "./city/CityOverlay";

export function Game() {
  // Instant boot as requested: bypass long loading screens
  const [bootLoaded, setBootLoaded] = useState(true);
  const phase = useMissionStore((s) => s.phase);
  const mission = useMissionStore((s) => s.mission);
  const lunarDone = useMissionStore((s) => s.lunarSurveyCompleted);
  const cam = useMissionStore((s) => s.cam);
  const quality = useMissionStore((s) => s.quality);
  const lang = useMissionStore((s) => s.lang);
  const go = useMissionStore((s) => s.go);

  useEffect(() => {
    void i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const drag = useRef<{ x: number; y: number } | null>(null);
  const cockpit = cam === "cockpit" && (phase === "flight" || phase === "encounter");

  // Determine which 3D scene to render in WebGL
  // Show 3D Rocket in center during craft, build, fuel, power, comms, and instruments!
  const sceneKey =
    phase === "city"
      ? "city"
      : phase === "menu"
      ? "earth-lobby"
      : ["craft", "build", "fuel", "power", "comms", "instruments", "check"].includes(phase)
      ? "hangar"
      : ["missions", "brief"].includes(phase)
      ? "planet"
      : phase === "launch"
      ? "launch"
      : phase === "docking"
      ? "docking"
      : phase === "landing" && mission === "Moon" && !lunarDone
      ? "lunar-recon"
      : phase === "landing" || phase === "report"
      ? "landing"
      : "universe";

  const scene =
    sceneKey === "city" ? (
      <ForgeCity />
    ) : sceneKey === "earth-lobby" ? (
      <EarthLaunchLobbyScene />
    ) : sceneKey === "lunar-recon" ? (
      <LunarSurfaceScene />
    ) : sceneKey === "hangar" ? (
      <BuildScene />
    ) : sceneKey === "planet" ? (
      <PlanetScene />
    ) : sceneKey === "launch" ? (
      <LaunchScene />
    ) : sceneKey === "docking" ? (
      <DockingScene />
    ) : sceneKey === "landing" ? (
      <LandingScene />
    ) : (
      <Universe />
    );

  return (
    <div className="mf-game-stage fixed inset-0 h-[100dvh] w-screen overflow-hidden bg-[#030712]">
      <div className="mf-game-viewport relative h-full w-full overflow-hidden" data-phase={phase}>
        <div
          className="absolute inset-0 touch-none select-none overflow-hidden"
          onPointerDown={(e) => {
            if (cockpit && e.target instanceof HTMLCanvasElement)
              drag.current = { x: e.clientX, y: e.clientY };
          }}
          onPointerMove={(e) => {
            if (!drag.current || !cockpit) return;
            let dx = e.clientX - drag.current.x,
              dy = e.clientY - drag.current.y;
            drag.current = { x: e.clientX, y: e.clientY };
            rt.yaw = Math.max(-1.6, Math.min(1.6, rt.yaw - dx * 0.004));
            rt.pitch = Math.max(-0.9, Math.min(0.9, rt.pitch - dy * 0.004));
          }}
          onPointerUp={() => {
            drag.current = null;
          }}
          onPointerCancel={() => {
            drag.current = null;
          }}
          onPointerLeave={() => {
            drag.current = null;
          }}
        >
          {/* Resilient 3D WebGL Canvas with Error Isolation */}
          <CanvasErrorBoundary>
            <div className="absolute inset-0 z-0">
              <Canvas
                dpr={quality === "high" ? [1, 1.5] : 1}
                camera={{ position: [0, 3, 8], fov: 55, near: 0.005, far: 2000 }}
                gl={{
                  antialias: quality === "high",
                  powerPreference: "high-performance",
                  toneMapping: THREE.ACESFilmicToneMapping,
                  toneMappingExposure: 1.25,
                }}
              >
                <Suspense fallback={null}>
                  <group key={sceneKey}>{scene}</group>
                </Suspense>
              </Canvas>
            </div>
          </CanvasErrorBoundary>

          {/* 2D HUD and Dynamic Responsive Overlay System */}
          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
            {phase === "city" ? (
              <CityOverlay />
            ) : sceneKey === "lunar-recon" ? (
              <LunarObjectiveOverlay />
            ) : (
              <Hud />
            )}
            <Ayesha />
            <LearnLab />
          </div>
        </div>
      </div>
    </div>
  );
}
