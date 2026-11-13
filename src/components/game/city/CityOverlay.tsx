import React, { useState } from "react";
import { useMissionStore } from "../../../stores/mission-store";
import { FORGE_CITY_DISTRICTS } from "./city-data";
import { GITCITY_REPO_BUILDINGS } from "./GitCityRepoDistrict";
import { Button } from "../../ui/button";
import {
  Compass,
  ChevronRight,
  Rocket,
  Building2,
  ExternalLink,
  Code2,
  FolderTree,
  GitBranch,
  X,
  Layers,
  MapPin,
} from "lucide-react";

export function CityOverlay() {
  const activeZoneId = useMissionStore((s) => s.activeCityZone);
  const go = useMissionStore((s) => s.go);
  const activeZone = FORGE_CITY_DISTRICTS.find((z) => z.id === activeZoneId);
  const [showGitCityModal, setShowGitCityModal] = useState(false);
  const [repoInput, setRepoInput] = useState("ethanplusai/gitcity.co");
  const [selectedFile, setSelectedFile] = useState<string | null>(GITCITY_REPO_BUILDINGS[0]?.path ?? null);

  const activeBuilding = GITCITY_REPO_BUILDINGS.find((b) => b.path === selectedFile);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-5">
      {/* Top Header Card & Minimap */}
      <header className="flex items-start justify-between gap-3">
        {/* District Compass Card */}
        <div className="pointer-events-auto rounded-xl border border-cyan-500/30 bg-slate-950/80 p-3 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-cyan-400">
            <Compass className="size-4 animate-spin-slow" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              FORGE CITY · EARTH SPACEPORT & TECH HUB
            </span>
          </div>
          <h2 className="mt-0.5 text-base font-extrabold text-slate-100 sm:text-lg">
            {activeZone ? activeZone.name : "Central City Plaza"}
          </h2>
          <p className="text-[11px] text-slate-400">
            {activeZone ? activeZone.sub : "Navigable Pedestrian Campus & Open-Source Code World"}
          </p>
        </div>

        {/* Top Right Controls & Minimap Radar */}
        <div className="pointer-events-auto flex items-start gap-2.5">
          {/* GitCity District Quick-Open Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGitCityModal(true)}
            className="border-violet-500/50 bg-slate-950/80 text-xs font-semibold text-violet-300 hover:border-violet-400 hover:bg-violet-950/40 hover:text-white"
          >
            <Code2 className="mr-1.5 size-3.5 text-violet-400" />
            GitCity Repo
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => go("menu")}
            className="border-slate-700 bg-slate-900/80 text-xs text-slate-200 hover:text-white"
          >
            Flight Plan
          </Button>
          <Button
            size="sm"
            onClick={() => go("missions")}
            className="bg-cyan-500 text-xs font-bold text-slate-950 hover:bg-cyan-400"
          >
            <Rocket className="mr-1 size-3.5" /> Launch Ops
          </Button>

          {/* Interactive Minimap Radar */}
          <div className="hidden rounded-xl border border-slate-700/60 bg-slate-950/85 p-2 shadow-xl backdrop-blur-md md:block">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1 text-[10px] font-bold text-slate-300">
              <span className="flex items-center gap-1">
                <MapPin className="size-3 text-cyan-400" /> DISTRICT RADAR
              </span>
              <span className="font-mono text-cyan-400">N ↑</span>
            </div>
            {/* 2D Schematic Radar Grid */}
            <div className="relative mt-1.5 h-24 w-28 rounded-lg border border-slate-800/80 bg-slate-900/90 overflow-hidden">
              {/* Radar Rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-16 w-16 rounded-full border border-cyan-500/10" />
                <div className="absolute h-8 w-8 rounded-full border border-cyan-500/20" />
                <div className="absolute h-full w-px bg-cyan-500/10" />
                <div className="absolute h-px w-full bg-cyan-500/10" />
              </div>

              {/* Districts represented on radar */}
              {FORGE_CITY_DISTRICTS.map((d) => {
                // Map coordinates [-30..30] to [0..100%]
                // Center is (0, 0) -> (50%, 50%)
                const left = 50 + (d.pos[0] / 60) * 100;
                const top = 50 + (d.pos[2] / 120) * 100;
                const isSelected = activeZoneId === d.id;

                return (
                  <div
                    key={d.id}
                    title={d.name}
                    style={{ left: `${left}%`, top: `${top}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-150 ${
                      isSelected ? "scale-125 z-10" : ""
                    }`}
                  >
                    <div
                      className="size-2 rounded-full shadow-sm ring-1 ring-white/50"
                      style={{ backgroundColor: d.color }}
                    />
                  </div>
                );
              })}

              {/* Center Plaza Marker */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="size-1.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Exploration Controls Indicator */}
      <div className="pointer-events-auto self-start rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-[11px] text-slate-400 backdrop-blur-sm">
        <span className="font-semibold text-slate-200">Exploration Controls:</span> Use{" "}
        <kbd className="rounded bg-slate-800 px-1 py-0.5 font-mono text-cyan-300">W</kbd>
        <kbd className="rounded bg-slate-800 px-1 py-0.5 font-mono text-cyan-300">A</kbd>
        <kbd className="rounded bg-slate-800 px-1 py-0.5 font-mono text-cyan-300">S</kbd>
        <kbd className="rounded bg-slate-800 px-1 py-0.5 font-mono text-cyan-300">D</kbd> or Arrow Keys. Hold{" "}
        <kbd className="rounded bg-slate-800 px-1 py-0.5 font-mono text-cyan-300">Shift</kbd> to sprint.
      </div>

      {/* Proximity Interaction Prompt & Fast-Travel */}
      <footer className="flex flex-col items-center">
        {activeZone ? (
          <div className="pointer-events-auto flex max-w-lg animate-bounce-subtle items-center justify-between gap-4 rounded-2xl border border-cyan-400/60 bg-slate-950/90 p-4 shadow-[0_0_30px_rgba(0,229,255,0.25)] backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeZone.icon}</span>
              <div>
                <h3 className="text-sm font-bold text-slate-100">{activeZone.name}</h3>
                <p className="text-[11px] text-cyan-200">{activeZone.sub}</p>
              </div>
            </div>
            {activeZone.id === "gitcity" ? (
              <Button
                onClick={() => setShowGitCityModal(true)}
                className="bg-violet-600 font-bold text-white hover:bg-violet-500 text-xs"
              >
                Press <span className="mx-1 rounded bg-slate-950 px-1.5 py-0.5 text-xs text-violet-300">E</span> Repo City
                <ChevronRight className="ml-1 size-4" />
              </Button>
            ) : activeZone.targetPhase ? (
              <Button
                onClick={() => go(activeZone.targetPhase as never)}
                className="bg-cyan-400 font-bold text-slate-950 hover:bg-cyan-300 text-xs"
              >
                Press <span className="mx-1 rounded bg-slate-950 px-1.5 py-0.5 text-xs text-cyan-300">E</span> Enter
                <ChevronRight className="ml-1 size-4" />
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/75 px-4 py-2 text-xs text-slate-300 backdrop-blur-sm">
            <Building2 className="size-3.5 text-cyan-400" />
            <span>Walk toward any district (Space Center, Academy, Hangar, Spaceport, or GitCity) to explore.</span>
          </div>
        )}

        {/* District Fast-Travel Strip */}
        <div className="pointer-events-auto mt-3 flex flex-wrap items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950/90 p-1.5 backdrop-blur-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => go("missions")}
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-cyan-400"
          >
            🚀 Space Center
          </Button>
          <div className="h-3.5 w-px bg-slate-800" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => go("build")}
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-orange-400"
          >
            🔧 Assembly Hangar
          </Button>
          <div className="h-3.5 w-px bg-slate-800" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => go("check")}
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-rose-400"
          >
            🔥 Launch Complex 39X
          </Button>
          <div className="h-3.5 w-px bg-slate-800" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGitCityModal(true)}
            className="flex items-center gap-1 text-xs font-semibold text-violet-300 hover:text-violet-200"
          >
            🏙️ GitCity Repo
          </Button>
        </div>
      </footer>

      {/* GitCity Modal: 3D Repository Explorer & Code City Terminal */}
      {showGitCityModal && (
        <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-violet-500/40 bg-slate-950 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 ring-1 ring-violet-500/40">
                  <Code2 className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-100 sm:text-lg">
                      GitCity Software District
                    </h3>
                    <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-300 ring-1 ring-violet-500/40">
                      Live 3D Repo Neighborhood
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Integrated reference repository:{" "}
                    <a
                      href="https://github.com/ethanplusai/gitcity.co"
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-violet-400 underline underline-offset-2 hover:text-violet-300"
                    >
                      github.com/ethanplusai/gitcity.co
                    </a>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGitCityModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 sm:grid-cols-12 sm:p-5">
              {/* Left Column: Repository File Hierarchy (Neighborhood Buildings) */}
              <div className="sm:col-span-5 flex flex-col gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FolderTree className="size-3.5 text-violet-400" />
                  3D Source Buildings
                </span>
                <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[300px] pr-1">
                  {GITCITY_REPO_BUILDINGS.map((b) => {
                    const isSelected = selectedFile === b.path;
                    return (
                      <button
                        key={b.path}
                        onClick={() => setSelectedFile(b.path)}
                        className={`flex flex-col items-start rounded-lg border p-2.5 text-left transition-all ${
                          isSelected
                            ? "border-violet-500 bg-violet-950/40 shadow-sm"
                            : "border-slate-800/80 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="font-mono text-xs font-semibold text-slate-200 truncate">
                            {b.path}
                          </span>
                          <span className="text-[10px] text-violet-400 font-mono">
                            {b.lines}L
                          </span>
                        </div>
                        <span className="mt-1 text-[11px] text-slate-400 line-clamp-1">
                          {b.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Architectural Inspector & Repo Stats */}
              <div className="sm:col-span-7 flex flex-col gap-3">
                {activeBuilding ? (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                          3D Structure Profile
                        </span>
                        <h4 className="font-mono text-sm font-bold text-slate-100">
                          {activeBuilding.path}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400">Complexity</span>
                        <p className="font-mono text-xs font-extrabold text-cyan-400">
                          Score {activeBuilding.complexity} / 100
                        </p>
                      </div>
                    </div>

                    <p className="mt-2.5 text-xs leading-relaxed text-slate-300">
                      {activeBuilding.description}
                    </p>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-slate-950/80 p-2 text-center border border-slate-800">
                        <span className="text-[10px] text-slate-400">Height</span>
                        <p className="font-mono text-xs font-bold text-slate-200">
                          {activeBuilding.size[1]}m
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-950/80 p-2 text-center border border-slate-800">
                        <span className="text-[10px] text-slate-400">Footprint</span>
                        <p className="font-mono text-xs font-bold text-slate-200">
                          {activeBuilding.size[0]}×{activeBuilding.size[2]}m
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-950/80 p-2 text-center border border-slate-800">
                        <span className="text-[10px] text-slate-400">Material</span>
                        <p className="font-mono text-[11px] font-bold text-violet-300">
                          Limestone & Glass
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* GitCity Architecture Info Card */}
                <div className="rounded-xl border border-violet-500/20 bg-violet-950/20 p-3.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 font-bold text-violet-300 mb-1">
                    <Layers className="size-4 text-violet-400" />
                    How GitCity Maps Repositories to Urban Space
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
                    <li><strong className="text-slate-200">Organizations:</strong> Represent entire metropolitan cities.</li>
                    <li><strong className="text-slate-200">Repositories:</strong> Form interconnected urban neighborhoods.</li>
                    <li><strong className="text-slate-200">Directories:</strong> Form city blocks and pedestrian courtyards.</li>
                    <li><strong className="text-slate-200">Source Files:</strong> Erect 3D buildings scaled by lines of code and complexity.</li>
                  </ul>
                </div>

                {/* Direct GitHub Link */}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <a
                    href="https://github.com/ethanplusai/gitcity.co"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-400 hover:text-violet-300"
                  >
                    View ethanplusai/gitcity.co on GitHub <ExternalLink className="size-3.5" />
                  </a>
                  <Button
                    size="sm"
                    onClick={() => setShowGitCityModal(false)}
                    className="bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white"
                  >
                    Close Explorer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
