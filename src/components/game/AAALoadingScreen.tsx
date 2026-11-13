import React, { useState, useEffect } from "react";
import { sfx } from "../../lib/audio";
import { useMissionStore } from "../../stores/mission-store";
import { Radio, Rocket, Sparkles, ChevronRight, Play, ShieldAlert, Cpu } from "lucide-react";

interface AAALoadingScreenProps {
  onComplete: () => void;
}

const BOOT_STEPS = [
  "CONNECTING NASA DEEP SPACE NETWORK (DSN 70M)...",
  "PARSING JPL HORIZONS EPHEMERIS VECTORS...",
  "INITIALIZING TSIOLKOVSKY PROPULSION MATRIX...",
  "CALIBRATING ANTI-GRAVITY QUANTUM FIELD...",
  "SYNCHRONIZING CAPE CANAVERAL LAUNCH TELEMETRY...",
  "SYSTEM NOMINAL // READY FOR MISSION OPERATIONS",
];

export const AAALoadingScreen: React.FC<AAALoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const s = useMissionStore();

  useEffect(() => {
    // Snappy, fast boot sequence (completes in ~1.4 seconds)
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsReady(true);
          sfx.success();
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 10) + 6;
        const currentStep = Math.min(
          BOOT_STEPS.length - 1,
          Math.floor((next / 100) * BOOT_STEPS.length)
        );
        setStepIndex(currentStep);
        if (next % 20 < 8) sfx.blip();
        return Math.min(100, next);
      });
    }, 45);

    return () => clearInterval(timer);
  }, []);

  const handleStartMission = () => {
    sfx.click();
    s.newRun("missions");
    s.say("Flight operations initialized. Select destination target.", "ok");
    onComplete();
  };

  const handleQuickLaunch = () => {
    sfx.click();
    s.go("launch");
    s.say("Spaceport launch sequence active! Cape Canaveral Pad 39A ready.", "ok");
    onComplete();
  };

  const handleSkip = () => {
    sfx.click();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#070B14] p-5 text-[#F3F7FF] select-none sm:p-10 overflow-hidden font-mono">
      {/* Background Subtle Gradient & Anamorphic Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(53,185,255,0.12)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#35b9ff15_1px,transparent_1px),linear-gradient(to_bottom,#35b9ff15_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(7,11,20,0.92)_100%)]" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#26364D] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl border border-[#35B9FF]/50 bg-[#111C2E] shadow-[0_0_12px_rgba(53,185,255,0.25)]">
            <Radio className="size-4 animate-pulse text-[#35B9FF]" />
          </div>
          <div>
            <div className="text-[10px] tracking-[0.25em] text-[#35B9FF] uppercase font-bold">
              NASA SPACE APPS 2026 // CHALLENGE #13
            </div>
            <div className="text-xs sm:text-sm font-bold tracking-wider text-[#F3F7FF] uppercase">
              MISSION FORGE // AEROSPACE ENGINE v5.0
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#A6B4C8]">
          <span className="size-2 rounded-full bg-[#35D39A] shadow-[0_0_8px_#35D39A]" />
          <span className="hidden sm:inline">DSN LINK: GOLDSTONE NOMINAL</span>
        </div>
      </div>

      {/* Center Cinematic Emblem & Loading Arc */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
        {/* Animated Cyber Hologram Ring */}
        <div className="relative flex size-36 sm:size-48 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#35B9FF]/30 animate-[spin_18s_linear_infinite]" />
          <div className="absolute inset-2 sm:inset-3 rounded-full border border-[#26364D] animate-[spin_10s_linear_infinite_reverse]" />
          <div className="absolute inset-5 sm:inset-6 rounded-full border-2 border-[#35B9FF]/50 shadow-[0_0_25px_rgba(53,185,255,0.3)]" />

          {/* Central Reactor Core */}
          <div className="flex size-20 sm:size-24 items-center justify-center rounded-full bg-gradient-to-tr from-[#35B9FF] to-[#0284C7] shadow-[0_0_35px_rgba(53,185,255,0.5)]">
            <Rocket className="size-8 sm:size-10 text-[#070B14] transform -rotate-45" />
          </div>

          <div className="absolute -top-1 right-4">
            <Sparkles className="size-4 sm:size-5 text-[#FFB547] animate-bounce" />
          </div>
        </div>

        {/* Title & Tagline */}
        <h1 className="mt-6 text-3xl font-extrabold tracking-[0.28em] text-[#F3F7FF] sm:text-5xl">
          MISSION<span className="text-[#35B9FF]">FORGE</span>
        </h1>
        <p className="mt-1 text-[11px] tracking-[0.3em] text-[#A6B4C8] uppercase">
          AUTONOMOUS SPACE ENGINEERING & EXPLORATION SUITE
        </p>

        {/* Progress Bar Container */}
        <div className="mt-6 w-full max-w-md">
          <div className="flex justify-between text-[11px] text-[#35B9FF]">
            <span className="animate-pulse truncate max-w-[80%] font-bold">{BOOT_STEPS[stepIndex]}</span>
            <span className="font-bold text-[#F3F7FF]">{progress}%</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full border border-[#26364D] bg-[#0B1220] p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#35B9FF] to-[#0284C7] transition-all duration-100 shadow-[0_0_12px_rgba(53,185,255,0.7)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Launch Actions */}
      <div className="relative z-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-between border-t border-[#26364D] pt-4">
        <div className="text-[10px] text-[#A6B4C8] text-center sm:text-left">
          VERIFIED NASA DATA · ZERO LAG ARCHITECTURE · 60 FPS WEBGL
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Direct Launch to Mission Button */}
          <button
            onClick={handleStartMission}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] transition-all active:scale-95 cursor-pointer ${
              isReady
                ? "border border-[#35B9FF] bg-gradient-to-r from-[#35B9FF] to-[#0284C7] text-[#070B14] shadow-[0_0_20px_rgba(53,185,255,0.4)] hover:brightness-110"
                : "border border-[#35B9FF]/40 bg-[#111C2E] text-[#35B9FF]"
            }`}
          >
            <Play size={13} className="fill-current" />
            <span>START MISSION</span>
          </button>

          {/* Quick Spaceport Launch */}
          <button
            onClick={handleQuickLaunch}
            className="flex items-center gap-1.5 rounded-xl border border-[#FFB547]/50 bg-[#FFB547]/15 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FFB547] hover:bg-[#FFB547]/25 transition active:scale-95 shadow-[0_0_15px_rgba(255,181,71,0.2)] cursor-pointer"
          >
            <Rocket size={13} />
            <span>3D LAUNCH</span>
          </button>

          {/* Skip Intro */}
          <button
            onClick={handleSkip}
            className="rounded-xl border border-[#26364D] bg-[#0B1220] px-4 py-2.5 text-xs font-bold text-[#A6B4C8] hover:text-[#F3F7FF] hover:bg-[#16243B] transition active:scale-95 cursor-pointer"
          >
            SKIP
          </button>
        </div>
      </div>
    </div>
  );
};
