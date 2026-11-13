import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useMissionStore, designOf, type MissionId } from "../../stores/mission-store";
import { BODIES, SOURCES } from "../../lib/nasa-data";
import { analyze, ENGINES, MISSIONS, ROUTES } from "../../lib/mission-sim";
import { sfx } from "../../lib/audio";
import { voiceMentor } from "../../lib/voice-mentor";
import {
  Rocket,
  Compass,
  Wrench,
  ShieldCheck,
  Zap,
  Volume2,
  VolumeX,
  Database,
  Settings,
  ChevronRight,
  Sparkles,
  Award,
  Radio,
  Sliders,
  Check,
  X,
  RefreshCcw,
  GraduationCap,
  Building2,
  Globe2,
  Gauge,
  Activity,
  Orbit,
} from "lucide-react";
import { CurriculumModal } from "./CurriculumModal";

export function AAALobbyHUD() {
  const s = useMissionStore();
  const d = designOf(s);
  const a = analyze(d);
  const go = s.go;
  const currentMission = MISSIONS[s.mission];
  const currentBody = BODIES[currentMission.body];

  const [activeModal, setActiveModal] = useState<"targets" | "antigravity" | "data" | "settings" | "academy" | null>(null);
  const [academyLessonId, setAcademyLessonId] = useState<string | undefined>(undefined);
  const [claimedReward, setClaimedReward] = useState(false);

  // Keyboard accessibility: Escape closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll when modal is active
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeModal]);

  const toggleSound = () => {
    sfx.click();
    s.set({ muted: !s.muted });
  };

  const handleVoiceBrief = () => {
    sfx.blip();
    voiceMentor.speak(
      `Welcome to Flight Operations! Active target is ${s.mission}. Surface gravity is ${currentBody.gravity} meters per second squared. Adjust Anti-Gravity lift to optimize Delta-V requirements!`,
      true
    );
  };

  const handleClaimReward = () => {
    if (!claimedReward) {
      sfx.success();
      setClaimedReward(true);
      s.say("Challenge #13 Mission Bonus Claimed: +2,500 Science Points!", "ok");
    }
  };

  // Speed-of-light communications latency (499 seconds per AU)
  const lightLagSec = Math.round(currentBody.au * 499);
  const lightLagMin = (lightLagSec / 60).toFixed(1);

  const destinationList: MissionId[] = ["Moon", "Mars", "Ceres", "Jupiter", "Saturn"];

  return (
    <div className={`pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3 sm:p-5 select-none font-sans ${s.userMode === "kid" ? "font-kid" : ""}`}>
      {/* ================= 1. TOP COMMAND DECK ================= */}
      <header className="pointer-events-auto flex flex-wrap items-center justify-between gap-3 cyber-glass-panel px-4 py-2.5 shadow-2xl">
        {/* Brand & Agency Badge */}
        <div className="flex items-center gap-3">
          <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <Rocket className="size-5 transform -rotate-45 text-slate-950 font-black" />
            <span className="absolute -bottom-1 -right-1 flex size-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-3 bg-emerald-400"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-widest text-white uppercase sm:text-base font-title">
                MISSION<span className="text-cyan-400">FORGE</span>
              </h1>
              <span className="rounded-md bg-cyan-500/20 px-2 py-0.5 text-[9px] font-mono font-bold text-cyan-300 border border-cyan-400/30">
                NASA SPACE APPS
              </span>
            </div>
            <div className="text-[10px] font-mono tracking-wider text-cyan-300/80 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              FLIGHT OPERATIONS · LIVE TELEMETRY
            </div>
          </div>
        </div>

        {/* Center: Planetary Target Quick-Selector Carousel */}
        <div className="hidden md:flex items-center gap-1.5 rounded-xl border border-cyan-500/20 bg-slate-950/60 p-1 backdrop-blur-md">
          {destinationList.map((id) => {
            const m = MISSIONS[id];
            const b = BODIES[m.body];
            const isSelected = s.mission === id;
            return (
              <button
                key={id}
                onClick={() => {
                  sfx.click();
                  s.set({ mission: id });
                  s.say(`Active Target: ${id.toUpperCase()}`, "ok");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-105"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <span
                  className="size-2.5 rounded-full shadow-sm"
                  style={{ backgroundColor: b.color }}
                />
                <span className="uppercase tracking-wider">{id}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Quick Action cluster */}
        <div className="flex items-center gap-2">
          {/* 3D City Switcher */}
          <button
            onClick={() => {
              sfx.click();
              s.go("city");
            }}
            title="Explore 3D Forge City Campus"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-blue-600/30 text-cyan-300 hover:border-cyan-300 hover:text-white transition active:scale-95 text-xs font-bold cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.25)]"
          >
            <Building2 className="size-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">3D City</span>
          </button>

          {/* Academy Quiz & STEM Lessons */}
          <button
            onClick={() => {
              sfx.click();
              setActiveModal("academy");
            }}
            title="STEM Academy & Physics Quizzes"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-500/40 bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 hover:text-white transition active:scale-95 text-xs font-bold cursor-pointer"
          >
            <GraduationCap className="size-3.5 text-purple-400" />
            <span className="hidden sm:inline">Academy</span>
          </button>

          {/* Flight Mode: Kid / Cadet / Commander */}
          <button
            onClick={() => {
              sfx.click();
              const nextMode =
                s.userMode === "cadet" ? "kid" : s.userMode === "kid" ? "commander" : "cadet";
              s.setUserMode(nextMode);
              s.say(`Mode: ${nextMode.toUpperCase()}`, "ok");
            }}
            title="Toggle Kid Mode / Cadet / Commander"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition active:scale-95 text-xs font-bold cursor-pointer ${
              s.userMode === "kid"
                ? "border-amber-400/60 bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.3)] font-kid"
                : s.userMode === "commander"
                ? "border-cyan-500/50 bg-cyan-950/40 text-cyan-300 font-mono"
                : "border-slate-700 bg-slate-900/80 text-slate-300 hover:text-white"
            }`}
          >
            <span>{s.userMode === "kid" ? "🎈" : s.userMode === "commander" ? "🎖️" : "🚀"}</span>
            <span className="hidden xs:inline capitalize">{s.userMode}</span>
          </button>

          {/* Audio Voice Mentor Button */}
          <button
            onClick={handleVoiceBrief}
            title="Dr. Ayesha Voice Briefing"
            className="flex size-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 text-cyan-400 transition hover:bg-slate-800 active:scale-95 cursor-pointer"
          >
            <Volume2 className="size-4 animate-pulse" />
          </button>

          {/* Mute/Unmute */}
          <button
            onClick={toggleSound}
            title={s.muted ? "Unmute Audio" : "Mute Audio"}
            className="flex size-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 text-slate-300 transition hover:bg-slate-800 active:scale-95 cursor-pointer"
          >
            {s.muted ? <VolumeX className="size-4 text-slate-500" /> : <Zap className="size-4 text-amber-400" />}
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={() => {
              sfx.click();
              setActiveModal("settings");
            }}
            title="System Settings"
            className="flex size-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 text-slate-300 transition hover:bg-slate-800 active:scale-95 cursor-pointer"
          >
            <Settings className="size-4" />
          </button>
        </div>
      </header>

      {/* ================= 2. FLOATING TELEMETRY WINGS ================= */}
      <div className="my-auto flex flex-col justify-between gap-4 pointer-events-none lg:flex-row lg:items-center">
        {/* Left Wing: Target Telemetry & Delta-V HUD */}
        <div className="pointer-events-auto max-w-sm cyber-glass-panel p-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
                TARGET TELEMETRY
              </span>
            </div>
            <button
              onClick={() => {
                sfx.click();
                setActiveModal("targets");
              }}
              className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 hover:bg-cyan-400/20 transition cursor-pointer"
            >
              CHANGE WORLD
            </button>
          </div>

          <div className="mt-3 flex items-start gap-3">
            <div
              className="size-11 shrink-0 rounded-full shadow-lg border border-white/20"
              style={{ background: `radial-gradient(circle at 35% 35%, ${currentBody.color}, ${currentBody.color2})` }}
            />
            <div>
              <h2 className="text-lg font-black text-white tracking-wide font-title">
                {currentMission.title}
              </h2>
              <p className="text-xs text-slate-400 leading-snug line-clamp-2">
                {currentMission.brief}
              </p>
            </div>
          </div>

          {/* Planetary Parameters Matrix */}
          <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="rounded-xl bg-slate-950/70 p-2.5 border border-cyan-500/15">
              <span className="text-slate-400 block text-[9px] font-bold">SURFACE GRAVITY</span>
              <span className="font-bold text-cyan-300">{currentBody.gravity} m/s²</span>
            </div>
            <div className="rounded-xl bg-slate-950/70 p-2.5 border border-cyan-500/15">
              <span className="text-slate-400 block text-[9px] font-bold">SOLAR DISTANCE</span>
              <span className="font-bold text-cyan-300">{currentBody.au} AU</span>
            </div>
            <div className="rounded-xl bg-slate-950/70 p-2.5 border border-cyan-500/15">
              <span className="text-slate-400 block text-[9px] font-bold">LIGHT LAG (RTT)</span>
              <span className="font-bold text-amber-400">{lightLagMin} MIN</span>
            </div>
            <div className="rounded-xl bg-slate-950/70 p-2.5 border border-cyan-500/15">
              <span className="text-slate-400 block text-[9px] font-bold">ATMOSPHERE</span>
              <span className="font-bold text-emerald-400 uppercase">{currentBody.atmosphere}</span>
            </div>
          </div>

          {/* Delta-V Rocket Performance Gauge */}
          <div className="mt-3.5 rounded-xl border border-cyan-500/20 bg-slate-950/70 p-2.5">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <Gauge className="size-3" /> TSIOLKOVSKY ΔV
              </span>
              <span className={`font-bold ${a.dvMargin < 0 ? "text-rose-400" : "text-emerald-400"}`}>
                {a.dv.toFixed(1)} / {a.required.toFixed(1)} km/s
              </span>
            </div>
            {/* Progress Bar */}
            <div className="mt-2 h-2 w-full rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  a.dvMargin < 0
                    ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                    : "bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                }`}
                style={{ width: `${Math.min(100, Math.max(10, (a.dv / Math.max(1, a.required)) * 100))}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[9px] font-mono text-slate-400">
              <span>{a.dvMargin < 0 ? "⚠️ PROPULSION DEFICIT" : "✓ SUFFICIENT ΔV"}</span>
              <span className="text-cyan-300">{Math.round((a.dv / Math.max(1, a.required)) * 100)}% CAPACITY</span>
            </div>
          </div>

          {/* Anti-Gravity Scalar Quick Widget */}
          <div className="mt-3 rounded-xl border border-cyan-500/20 bg-slate-950/70 p-2.5">
            <div className="flex justify-between text-[10px] font-mono text-cyan-400 font-bold">
              <span>ANTI-GRAVITY LIFT ASSIST</span>
              <span className="text-white">{Math.round((s.antiGravityLift ?? 0.5) * 100)}%</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round((s.antiGravityLift ?? 0.5) * 100)}
                onChange={(e) => {
                  s.set({ antiGravityLift: +e.target.value / 100 });
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <button
                onClick={() => {
                  sfx.click();
                  setActiveModal("antigravity");
                }}
                title="Configure Anti-Gravity Matrix"
                className="size-6 shrink-0 grid place-items-center rounded-lg border border-slate-700 bg-slate-900 text-cyan-400 hover:bg-slate-800 transition cursor-pointer"
              >
                <Sliders className="size-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Wing: NASA Space Weather & Flight Directives */}
        <div className="hidden lg:block pointer-events-auto max-w-xs cyber-glass-panel p-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Radio className="size-4 text-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-white">
                LIVE SPACE WEATHER
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">NOAA SWPC</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="rounded-xl bg-slate-950/70 p-2.5 border border-cyan-500/15">
              <span className="text-slate-400 block text-[9px] font-bold">GEOMAGNETIC KP</span>
              <span className="font-bold text-emerald-400">1.6 · NOMINAL</span>
            </div>
            <div className="rounded-xl bg-slate-950/70 p-2.5 border border-cyan-500/15">
              <span className="text-slate-400 block text-[9px] font-bold">SOLAR WIND SPEED</span>
              <span className="font-bold text-cyan-300">466 KM/S</span>
            </div>
          </div>

          <h3 className="mt-3.5 text-xs font-bold text-white uppercase tracking-wider font-title flex items-center gap-1.5">
            <Award className="size-3.5 text-amber-400" /> MISSION DIRECTIVES
          </h3>

          <div className="mt-2.5 space-y-2 text-xs">
            <div className="flex items-center gap-2 rounded-xl bg-slate-950/70 p-2.5 border border-cyan-500/15">
              <span className="grid size-5 place-items-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Check className="size-3" />
              </span>
              <span className="text-slate-200 text-[11px]">Calibrate RL10 Cryogenic Isp (462s)</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-950/70 p-2.5 border border-cyan-500/15">
              <span className="grid size-5 place-items-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Check className="size-3" />
              </span>
              <span className="text-slate-200 text-[11px]">Deploy Whipple Debris Shielding</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-950/70 p-2.5 border border-cyan-500/15">
              <span className="grid size-5 place-items-center rounded-full bg-cyan-500/20 text-cyan-400">
                <Rocket className="size-3" />
              </span>
              <span className="text-slate-200 text-[11px]">Execute Safe Surface Touchdown</span>
            </div>
          </div>

          <button
            onClick={handleClaimReward}
            disabled={claimedReward}
            className={`mt-4 w-full rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider transition active:scale-95 cursor-pointer ${
              claimedReward
                ? "bg-slate-950 text-slate-500 border border-slate-800 cursor-not-allowed"
                : "border border-amber-400/50 bg-amber-400/20 text-amber-300 hover:bg-amber-400/30"
            }`}
          >
            {claimedReward ? "RECON BONUS CLAIMED" : "CLAIM RECON BONUS (+2500 PTS)"}
          </button>
        </div>
      </div>

      {/* ================= 3. HERO BOTTOM LAUNCH CONSOLE ================= */}
      <footer className="pointer-events-auto flex flex-col items-center gap-3">
        {/* Giant Futuristic Launch Button */}
        <button
          onClick={() => {
            sfx.click();
            s.go("missions");
          }}
          className="group relative flex items-center justify-center gap-3.5 overflow-hidden rounded-2xl cyber-btn-launch px-10 py-4 cursor-pointer"
        >
          <Rocket className="size-6 transform -rotate-45 text-slate-950 font-black animate-pulse" />
          <div className="text-left leading-tight">
            <div className="text-[10px] font-mono font-bold tracking-widest uppercase opacity-90 text-slate-950">
              NASA SPACE APPS · CHALLENGE 13
            </div>
            <div className="text-base sm:text-lg font-black tracking-wider uppercase text-slate-950 font-title">
              INITIATE SPACE MISSION DESIGN ➔
            </div>
          </div>
          <ChevronRight className="size-6 transition-transform group-hover:translate-x-1.5 text-slate-950" />
        </button>

        {/* Bottom Navigation Matrix Dock */}
        <div className="flex w-full max-w-xl items-center justify-around rounded-2xl cyber-glass-panel py-2 px-4 shadow-2xl">
          {/* Worlds / Destination Modal */}
          <button
            onClick={() => {
              sfx.click();
              setActiveModal("targets");
            }}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300 hover:text-cyan-400 transition active:scale-95 cursor-pointer"
          >
            <Compass className="size-4 text-cyan-400" />
            <span>WORLDS</span>
          </button>

          {/* Spacecraft Forge */}
          <button
            onClick={() => {
              sfx.click();
              go("build");
            }}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300 hover:text-cyan-400 transition active:scale-95 cursor-pointer"
          >
            <Wrench className="size-4 text-cyan-400" />
            <span>FORGE</span>
          </button>

          {/* 3D City Hub */}
          <button
            onClick={() => {
              sfx.click();
              go("city");
            }}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-cyan-300 hover:text-white transition active:scale-95 cursor-pointer"
          >
            <Building2 className="size-4 text-cyan-400 animate-pulse" />
            <span>3D CITY</span>
          </button>

          {/* Anti-Gravity Lab */}
          <button
            onClick={() => {
              sfx.click();
              setActiveModal("antigravity");
            }}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300 hover:text-amber-400 transition active:scale-95 cursor-pointer"
          >
            <Zap className="size-4 text-amber-400" />
            <span>ANTI-GRAV</span>
          </button>

          {/* Live NASA Telemetry */}
          <button
            onClick={() => {
              sfx.click();
              setActiveModal("data");
            }}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300 hover:text-cyan-400 transition active:scale-95 cursor-pointer"
          >
            <Database className="size-4 text-cyan-400" />
            <span>NASA DATA</span>
          </button>

          {/* Go / Flight Poll */}
          <button
            onClick={() => {
              sfx.click();
              go("check");
            }}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300 hover:text-emerald-400 transition active:scale-95 cursor-pointer"
          >
            <ShieldCheck className="size-4 text-emerald-400" />
            <span>POLL</span>
          </button>
        </div>
      </footer>

      {/* ================= 4. INTERACTIVE MODALS ================= */}

      {/* Destination / Worlds Modal */}
      {activeModal === "targets" && (
        <div
          className="pointer-events-auto fixed inset-0 z-40 grid place-items-center bg-slate-950/85 p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative z-50 w-full max-w-lg cyber-glass-panel p-5 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 font-title">
                <Compass className="size-4 text-cyan-400" /> SELECT MISSION DESTINATION
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-4 grid gap-2.5 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
              {(Object.keys(MISSIONS) as MissionId[]).map((id) => {
                const m = MISSIONS[id];
                const b = BODIES[m.body];
                const isSelected = s.mission === id;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      sfx.click();
                      s.set({ mission: id });
                      s.say(`Target: ${m.body}`, "ok");
                      setActiveModal(null);
                    }}
                    className={`flex items-center justify-between rounded-xl p-3 text-left border transition cursor-pointer ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                        : "border-slate-800 bg-slate-950/70 hover:border-cyan-400/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="size-9 rounded-full shadow-inner border border-white/20"
                        style={{ background: `radial-gradient(circle at 35% 35%, ${b.color}, ${b.color2})` }}
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{m.title}</div>
                        <div className="text-[11px] text-slate-400">{b.kind} · {b.gravity} m/s² · {b.au} AU</div>
                      </div>
                    </div>
                    <div className="text-right font-mono text-[11px] text-cyan-400">
                      <div>{m.dv} km/s</div>
                      <div className="text-[10px] text-slate-400">{m.days} days</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Anti-Gravity Field Matrix Modal */}
      {activeModal === "antigravity" && (
        <div
          className="pointer-events-auto fixed inset-0 z-40 grid place-items-center bg-slate-950/85 p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative z-50 w-full max-w-lg cyber-glass-panel p-6 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 font-title">
                <Zap className="size-4 text-amber-400" /> ANTI-GRAVITY PROPULSION MATRIX
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Speculative negative-mass harmonic field generator. Reduces atmospheric gravitational drag and cuts required orbital launch $\Delta v$ by up to 40%.
              </p>

              <div className="rounded-xl border border-cyan-500/20 bg-slate-950/80 p-4">
                <div className="flex justify-between text-xs font-mono text-cyan-400 font-bold">
                  <span>LIFT HARMONIC FIELD:</span>
                  <span className="text-amber-400">{Math.round((s.antiGravityLift ?? 0.5) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round((s.antiGravityLift ?? 0.5) * 100)}
                  onChange={(e) => s.set({ antiGravityLift: +e.target.value / 100 })}
                  className="mt-3 w-full accent-cyan-400 cursor-pointer"
                />
                <div className="mt-2 flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Standard 1.0g Rocket</span>
                  <span>Max Speculative Lift (0.6g)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ΔV REDUCTION</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    -{((s.antiGravityLift ?? 0.5) * 22).toFixed(1)}%
                  </span>
                </div>
                <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">PAYLOAD CAPACITY</span>
                  <span className="text-cyan-300 font-bold text-sm">
                    +{Math.round((s.antiGravityLift ?? 0.5) * 1400)} KG
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-full rounded-xl bg-cyan-500 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 hover:bg-cyan-400 transition cursor-pointer"
              >
                APPLY CALIBRATION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NASA Live Data Explorer Modal */}
      {activeModal === "data" && (
        <div
          className="pointer-events-auto fixed inset-0 z-40 grid place-items-center bg-slate-950/85 p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative z-50 w-full max-w-xl cyber-glass-panel p-6 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 font-title">
                <Database className="size-4 text-cyan-400" /> NASA & NOAA OPEN SCIENCE FEEDS
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div className="rounded-xl bg-slate-950/80 p-3.5 border border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">NOAA Space Weather Prediction Center</span>
                  <span className="text-[10px] font-mono text-emerald-400">● LIVE</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Planetary K-index (Kp 1.6), Solar Wind bulk speed (466 km/s from DSCOVR satellite at Lagrange Point 1).
                </p>
              </div>

              <div className="rounded-xl bg-slate-950/80 p-3.5 border border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">NASA JPL Horizons Ephemeris</span>
                  <span className="text-[10px] font-mono text-emerald-400">● COMPUTED</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Real-time heliocentric coordinates, light travel latency, and transfer Delta-V requirements for all 9 celestial targets.
                </p>
              </div>

              <div className="rounded-xl bg-slate-950/80 p-3.5 border border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">NASA NSSDCA Master Catalog</span>
                  <span className="text-[10px] font-mono text-cyan-400">● VERIFIED SNAPSHOT</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Planetary mass, surface gravity, escape velocity, and atmospheric scale heights.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Link
                  to="/status"
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white"
                >
                  Provider Health Monitor
                </Link>
                <Link
                  to="/credits"
                  className="rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400"
                >
                  View Science Credits
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {activeModal === "settings" && (
        <div
          className="pointer-events-auto fixed inset-0 z-40 grid place-items-center bg-slate-950/85 p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative z-50 w-full max-w-md cyber-glass-panel p-6 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 font-title">
                <Settings className="size-4 text-cyan-400" /> SYSTEM SETTINGS
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Graphics Quality</span>
                <button
                  onClick={() => s.set({ quality: s.quality === "high" ? "low" : "high" })}
                  className="rounded-lg border border-cyan-400/40 bg-cyan-500/20 px-3 py-1 font-mono font-bold text-cyan-300 uppercase cursor-pointer"
                >
                  {s.quality}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Closed Captions</span>
                <button
                  onClick={() => s.set({ captions: !s.captions })}
                  className={`rounded-lg border px-3 py-1 font-mono font-bold uppercase cursor-pointer ${
                    s.captions ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-300" : "border-slate-700 bg-slate-900 text-slate-400"
                  }`}
                >
                  {s.captions ? "ENABLED" : "DISABLED"}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Master Sound</span>
                <button
                  onClick={toggleSound}
                  className={`rounded-lg border px-3 py-1 font-mono font-bold uppercase cursor-pointer ${
                    !s.muted ? "border-cyan-400/50 bg-cyan-500/20 text-cyan-300" : "border-slate-700 bg-slate-900 text-slate-400"
                  }`}
                >
                  {!s.muted ? "ACTIVE" : "MUTED"}
                </button>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="mt-2 w-full rounded-xl bg-cyan-500 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 hover:bg-cyan-400 transition cursor-pointer"
              >
                SAVE & CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEM Curriculum Academy Modal */}
      <CurriculumModal
        isOpen={activeModal === "academy"}
        initialLessonId={academyLessonId}
        onClose={() => {
          setActiveModal(null);
          setAcademyLessonId(undefined);
        }}
      />
    </div>
  );
}
