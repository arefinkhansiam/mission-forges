import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Design, EngineId, Instrument, MissionId, Outcome, RouteId } from "../lib/mission-sim";

export type Phase =
  | "city"
  | "menu"
  | "missions"
  | "brief"
  | "route"
  | "routePreview"
  | "objectives"
  | "budget"
  | "fuel"
  | "power"
  | "comms"
  | "instruments"
  | "overview"
  | "craft"
  | "build"
  | "check"
  | "launch"
  | "flight"
  | "encounter"
  | "failure"
  | "rescue"
  | "docking"
  | "landing"
  | "lunar-recon"
  | "report";

export type { MissionId, RouteId };
export type Lang = "en" | "bn" | "hi" | "es" | "ar" | "fr";
export type UserMode = "kid" | "cadet" | "commander";

type State = Design & {
  phase: Phase;
  cam: "chase" | "cockpit";
  quality: "high" | "low";
  referenceModel: boolean;
  activeNasaModel?: string | undefined;
  activeCityZone: string | null;
  antiGravityLift: number;
  touchMove?: { x: number; z: number };
  isTouchSprinting?: boolean;
  classroomVisited: boolean;
  lunarSurveyCompleted: boolean;
  lunarSiteSelected: string | null;
  lunarSurveyData?: any;
  outcome: Outcome | null;
  rescueKit: string[];
  rescued: boolean;
  landing: number;
  landingErrors: number;
  dvSpent: number;
  attempts: number;
  craft: "explorer" | "surveyor" | "guardian";
  budget: number;
  objective: "surface" | "orbit" | "survey";
  lang: Lang;
  userMode: UserMode;
  muted: boolean;
  captions: boolean;
  learn: string | null;
  ayeshaSeen: string[];
  status: { id: number; text: string; tone: "info" | "ok" | "warn" | "danger" }[];
  set: (p: Partial<State>) => void;
  setUserMode: (mode: UserMode) => void;
  go: (phase: Phase) => void;
  toggleInstrument: (i: Instrument) => void;
  say: (text: string, tone?: "info" | "ok" | "warn" | "danger") => void;
  newRun: (phase?: Phase) => void;
};

const run = {
  outcome: null,
  rescueKit: [],
  rescued: false,
  landing: 0,
  landingErrors: 0,
  dvSpent: 0,
  antiGravityLift: 0.5,
  lunarSurveyCompleted: false,
  lunarSiteSelected: null,
  lunarSurveyData: null,
};

const ship: Design = {
  mission: "Moon",
  route: "safe",
  engine: "chemical" as EngineId,
  engines: 1,
  tanks: 4,
  wings: 4,
  rtgs: 0,
  antennas: 1,
  shield: true,
  battery: false,
  instruments: ["camera"],
  fuel: 100,
};

let sid = 0;

export const useMissionStore = create<State>()(
  persist(
    (set) => ({
      ...ship,
      ...run,
      phase: "menu", // Starts in the sleek Deep Space Mission Operations Deck
      lang: "en",
      userMode: "cadet",
      muted: false,
      captions: true,
      learn: null,
      ayeshaSeen: [],
      cam: "chase",
      quality: "high",
      attempts: 0,
      craft: "explorer",
      budget: 2,
      objective: "surface",
      status: [],
      referenceModel: false,
      activeNasaModel: undefined,
      activeCityZone: null,
      touchMove: { x: 0, z: 0 },
      isTouchSprinting: false,
      classroomVisited: false,
      set: (p) => set(p as never),
      setUserMode: (userMode) => set({ userMode }),
      go: (phase) => set({ phase, referenceModel: false }),
      toggleInstrument: (i) =>
        set((s) => ({
          instruments: s.instruments.includes(i) ? s.instruments.filter((x) => x !== i) : [...s.instruments, i],
        })),
      say: (text, tone = "info") =>
        set((s) => ({ status: [{ id: ++sid, text, tone }, ...s.status].slice(0, 4) })),
      newRun: (phase = "missions") =>
        set((s) => ({
          ...run,
          phase,
          attempts: s.attempts + 1,
          status: [{ id: ++sid, text: "New mission flight plan initialized", tone: "ok" }],
        })),
    }),
    {
      name: "mission-forge-v5-nexus",
      partialize: (s) => {
        const { status, set: _a, go: _b, toggleInstrument: _c, say: _d, newRun: _e, ...rest } = s;
        void status;
        return rest as never;
      },
      // Mid-animation phases resume at a safe checkpoint
      merge: (p, c) => {
        const s = { ...c, ...(p as object) } as State;
        if (s.phase === "city") s.phase = "menu";
        if (["launch", "docking"].includes(s.phase)) s.phase = s.phase === "launch" ? "check" : "rescue";
        if (s.phase === "encounter" && !s.outcome) s.phase = "flight";
        return s;
      },
    },
  ),
);

export const designOf = (s: Design): Design => ({
  mission: s.mission,
  route: s.route,
  engine: s.engine,
  engines: s.engines,
  tanks: s.tanks,
  wings: s.wings,
  rtgs: s.rtgs,
  antennas: s.antennas,
  shield: s.shield,
  battery: s.battery,
  instruments: s.instruments,
  fuel: s.fuel,
  antiGravityLift: s.antiGravityLift ?? 0,
});

export const useMission = useMissionStore;

