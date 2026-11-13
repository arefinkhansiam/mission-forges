import React from "react";
import { useMissionStore } from "../../stores/mission-store";
import { BODIES } from "../../lib/nasa-data";
import { analyze, MISSIONS } from "../../lib/mission-sim";
import { designOf } from "../../stores/mission-store";
import { Rocket, Satellite, Compass, Flame, Check, Globe, Eye, EyeOff, Volume2, VolumeX } from "lucide-react";
import { sfx } from "../../lib/audio";

interface MissionTopMapProps {
  onToggleOverlay?: () => void;
  isOverlayHidden?: boolean;
  onOpenAcademy?: (lessonId?: string) => void;
}

export function MissionTopMap({ onToggleOverlay, isOverlayHidden = false, onOpenAcademy }: MissionTopMapProps) {
  const s = useMissionStore();
  const d = designOf(s);
  const a = analyze(d);
  const currentMission = MISSIONS[s.mission];
  const currentBody = BODIES[currentMission.body];

  // Define orbital milestone trajectory nodes
  const nodes = [
    {
      id: "spaceport",
      label: "1. SPACEPORT",
      icon: <Globe size={11} />,
      active: ["menu", "missions", "build", "check", "launch"].includes(s.phase),
      done: ["flight", "encounter", "docking", "landing", "report"].includes(s.phase),
    },
    {
      id: "orbit",
      label: "2. LEO ORBIT",
      icon: <Satellite size={11} />,
      active: s.phase === "launch" && a.dv > 0,
      done: ["flight", "encounter", "docking", "landing", "report"].includes(s.phase),
    },
    {
      id: "transit",
      label: "3. TRANSIT",
      icon: <Flame size={11} />,
      active: s.phase === "flight" || s.phase === "encounter",
      done: ["docking", "landing", "report"].includes(s.phase),
    },
    {
      id: "target",
      label: `4. ${s.mission.toUpperCase()}`,
      icon: <Compass size={11} />,
      active: ["docking", "landing", "lunar-recon", "report"].includes(s.phase),
      done: s.phase === "report",
    },
  ];

  return (
    <header className="pointer-events-auto fixed top-2 inset-x-2 z-20 sm:top-3 sm:inset-x-4 flex items-center justify-between gap-2 rounded-xl border border-[#162746] bg-[#050B18]/95 px-3 py-1.5 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.85)] select-none">
      {/* Brand & Mission Badge */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            sfx.click();
            s.go("menu");
          }}
          className="flex items-center gap-2 text-left group cursor-pointer"
        >
          <div className="flex size-7 items-center justify-center rounded-lg border border-[#00F0FF]/50 bg-[#081226] text-[#00F0FF] shadow-[0_0_12px_rgba(53,185,255,0.3)] group-hover:brightness-125 transition">
            <Rocket size={13} className="transform -rotate-45" />
          </div>
          <div className="hidden xs:block leading-none">
            <span className="text-[11px] font-bold tracking-widest text-[#F3F7FF] block">
              MISSION<span className="text-[#00F0FF]">FORGE</span>
            </span>
            <span className="text-[8px] font-mono text-[#00F0FF] tracking-widest">
              {s.mission.toUpperCase()} OPERATIONS
            </span>
          </div>
        </button>
      </div>

      {/* Center: Interactive Orbital Mission Map */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-[10px] font-mono py-0.5 scrollbar-none">
        {nodes.map((node, i) => (
          <React.Fragment key={node.id}>
            <div
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border transition-all ${
                node.active
                  ? "border-[#00F0FF] bg-[#00F0FF]/15 text-[#00F0FF] font-bold shadow-[0_0_12px_rgba(53,185,255,0.3)] animate-pulse"
                  : node.done
                  ? "border-[#35D39A]/40 bg-[#35D39A]/10 text-[#35D39A]"
                  : "border-[#162746] bg-[#070B14]/60 text-[#A6B4C8]/50"
              }`}
            >
              {node.done ? <Check size={10} className="text-[#35D39A]" /> : node.icon}
              <span className="whitespace-nowrap">{node.label}</span>
            </div>
            {i < nodes.length - 1 && (
              <span className="text-[10px] text-[#162746] font-bold hidden sm:inline">➔</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Right: Telemetry, Academy & View Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Real-time Telemetry Pill - clickable for Tsiolkovsky equation */}
        <button
          onClick={() => {
            sfx.click();
            onOpenAcademy?.("rocket-equation");
          }}
          title="Click to learn about Delta-V & Tsiolkovsky Rocket Equation"
          className="hidden md:flex items-center gap-2 text-[10px] font-mono rounded-lg border border-[#162746] hover:border-cyan-400/50 bg-[#081226] hover:bg-[#16243B] px-2.5 py-1 text-[#00F0FF] transition active:scale-95 cursor-pointer"
        >
          <span>Δv: <strong className="text-[#F3F7FF]">{a.dv.toFixed(1)} km/s</strong></span>
          <span className="text-[#162746]">|</span>
          <span>DIST: <strong className="text-[#F3F7FF]">{currentBody.au} AU</strong></span>
        </button>

        {/* 3D City Hub Switcher */}
        <button
          onClick={() => {
            sfx.click();
            s.go("city");
          }}
          title="Explore 3D Forge City Campus"
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg border border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-blue-600/30 text-cyan-300 hover:border-cyan-300 hover:text-white transition active:scale-95 text-[11px] font-bold cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.25)]"
        >
          <span>🌆</span>
          <span className="hidden sm:inline">3D City</span>
        </button>

        {/* Academy Lesson Quiz Button */}
        {onOpenAcademy && (
          <button
            onClick={() => {
              sfx.click();
              onOpenAcademy();
            }}
            title="Open STEM Academy & Quizzes"
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50 hover:text-white transition active:scale-95 text-[11px] font-bold cursor-pointer"
          >
            <span>🎓</span>
            <span className="hidden xs:inline">Academy</span>
          </button>
        )}

        {/* User Mode (Kid / Cadet / Commander) Switcher */}
        <button
          onClick={() => {
            sfx.click();
            const nextMode =
              s.userMode === "cadet" ? "kid" : s.userMode === "kid" ? "commander" : "cadet";
            s.setUserMode(nextMode);
            s.say(`Switched flight mode to ${nextMode.toUpperCase()}`, "ok");
          }}
          title="Switch User Mode (Kid / Cadet / Commander)"
          className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition active:scale-95 text-[11px] font-bold cursor-pointer ${
            s.userMode === "kid"
              ? "border-amber-400/60 bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.3)] font-kid"
              : s.userMode === "commander"
              ? "border-purple-500/50 bg-purple-950/40 text-purple-300 font-mono"
              : "border-[#162746] bg-[#081226] text-[#A6B4C8] hover:text-[#F3F7FF]"
          }`}
        >
          <span>{s.userMode === "kid" ? "🎈" : s.userMode === "commander" ? "🎖️" : "🚀"}</span>
          <span className="capitalize">{s.userMode}</span>
        </button>

        {/* 3D Scene View / Hide HUD Toggle (Unblocks Viewport Completely) */}
        {onToggleOverlay && (
          <button
            onClick={() => {
              sfx.click();
              onToggleOverlay();
            }}
            title={isOverlayHidden ? "Show Mission HUD" : "Hide HUD (Full 3D View)"}
            className={`flex size-7 sm:size-8 items-center justify-center rounded-lg border transition active:scale-95 cursor-pointer ${
              isOverlayHidden
                ? "border-[#00F0FF] bg-[#00F0FF]/20 text-[#00F0FF] shadow-[0_0_12px_rgba(53,185,255,0.4)]"
                : "border-[#162746] bg-[#081226] text-[#A6B4C8] hover:border-[#00F0FF]/50 hover:text-[#F3F7FF]"
            }`}
          >
            {isOverlayHidden ? <EyeOff size={14} className="text-[#00F0FF]" /> : <Eye size={14} />}
          </button>
        )}

        {/* Audio Mute/Unmute */}
        <button
          onClick={() => {
            sfx.click();
            s.set({ muted: !s.muted });
          }}
          title={s.muted ? "Unmute Audio" : "Mute Audio"}
          className="flex size-7 sm:size-8 items-center justify-center rounded-lg border border-[#162746] bg-[#081226] text-[#A6B4C8] transition hover:border-[#00F0FF]/50 hover:text-[#F3F7FF] active:scale-95 cursor-pointer"
        >
          {s.muted ? <VolumeX size={14} className="text-[#A6B4C8]/50" /> : <Volume2 size={14} className="text-[#00F0FF]" />}
        </button>
      </div>
    </header>
  );
}
