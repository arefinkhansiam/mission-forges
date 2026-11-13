import { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, BookOpen, Check, Compass, Eye, EyeOff, Menu, Rocket, Settings2, UserRound, X, Zap, Shield, Flame, Activity, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { BODIES, SOURCES } from "../../lib/nasa-data";
import { analyze, ENGINES, fmt, INSTRUMENTS, MISSIONS, ROUTES, type EngineId, type Instrument, type MissionId, type RouteId } from "../../lib/mission-sim";
import { designOf, useMissionStore, type Phase } from "../../stores/mission-store";
import { LivePositions } from "./LivePositions";
import { LANGS } from "../../locales/resources";
import { AyeshaAvatar } from "./Ayesha";
import { useVoice, VoiceBar } from "./voice";
import { SceneControls } from "./Presentation";
import { getMissionModel, NASA_SPACECRAFT_CATALOG, type NasaCraftModelInfo } from "./Spacecraft";
import { MissionTopMap } from "./MissionTopMap";
import { CurriculumModal } from "./CurriculumModal";
import { sfx } from "../../lib/audio";

interface FramePanelContextType {
  hidePanel: boolean;
  setHidePanel: React.Dispatch<React.SetStateAction<boolean>>;
}

const FramePanelContext = createContext<FramePanelContextType>({
  hidePanel: false,
  setHidePanel: () => {},
});

const useFramePanel = () => useContext(FramePanelContext);

const ids: MissionId[] = ["Moon", "Mars", "Ceres", "Jupiter", "Saturn"];

// Verified NASA Planetary Exploration Targets & Scientific Imagery
const NASA_WORLD_DATA: Record<MissionId, { img: string; landingTarget: string; hazard: string; scienceNote: string }> = {
  Moon: {
    img: "/images/nasa-moon.svg",
    landingTarget: "Shackleton Crater · Lunar South Pole",
    hazard: "Extreme thermal swing (-246°C to 120°C) & abrasive regolith",
    scienceNote: "Volatile water-ice trapping in permanently shadowed regions (PSR) for sustained Artemis operations.",
  },
  Mars: {
    img: "/images/nasa-mars.svg",
    landingTarget: "Jezero Crater Delta · Olympus Mons",
    hazard: "Atmospheric entry dust storms & 0.006 bar low density",
    scienceNote: "Sedimentary ancient lake delta core sampling for bio-signature preservation.",
  },
  Ceres: {
    img: "/images/nasa-ceres.svg",
    landingTarget: "Occator Crater Central Dome (Cerealia Facula)",
    hazard: "Microgravity anchoring (0.029 g) & deep space solar flux",
    scienceNote: "Hydrothermal subterranean brine reservoirs and sodium carbonate salt deposits.",
  },
  Jupiter: {
    img: "/images/nasa-jupiter.svg",
    landingTarget: "Great Red Spot Convective Atmospheric Column",
    hazard: "Severe radiation belt (>100 krad) & 24.8 m/s² gravity well",
    scienceNote: "Deep atmospheric entry probe measuring hydrogen/helium isotopic ratios.",
  },
  Saturn: {
    img: "/images/nasa-saturn.svg",
    landingTarget: "Cassini Division & Titan Smog Boundary",
    hazard: "Ring particle debris impacts & cryogenic transit duration",
    scienceNote: "Ring particle dynamics and prebiotic organic chemistry in liquid methane lakes.",
  },
};

function Frame({ phase, children }: { phase: Phase; children: ReactNode }) {
  const s = useMissionStore();
  const { t } = useTranslation();
  const [menu, setMenu] = useState(false);
  const [mentor, setMentor] = useState(false);
  const [hidePanel, setHidePanel] = useState(false);
  const [academyOpen, setAcademyOpen] = useState(false);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        setMentor(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <FramePanelContext.Provider value={{ hidePanel, setHidePanel }}>
      <div className={`pointer-events-none absolute inset-0 z-20 select-none overflow-hidden ${s.userMode === "kid" ? "font-kid" : ""}`}>
        {/* Top Interactive Mission Map Bar */}
        <MissionTopMap
          onToggleOverlay={() => setHidePanel((p) => !p)}
          isOverlayHidden={hidePanel}
          onOpenAcademy={() => setAcademyOpen(true)}
        />

        {/* Academy Lessons Modal */}
        <CurriculumModal
          isOpen={academyOpen}
          onClose={() => setAcademyOpen(false)}
        />

        {/* Main Screen Content with one-sided dock */}
        <div className="absolute inset-0 pt-12">
          {children}
        </div>

      {/* Options Dialog Modal */}
      {menu && (
        <div className="pointer-events-auto fixed inset-0 z-40 grid place-items-center bg-[#070B14]/85 p-4 backdrop-blur-md animate-fade-in" onClick={() => setMenu(false)}>
          <section className="relative z-50 w-full max-w-md rounded-2xl border border-[#26364D] bg-[#111C2E] p-6 shadow-2xl text-[#F3F7FF] flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#26364D] pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#35B9FF]">{t("ui.game.options")}</h2>
              <button aria-label={t("ui.learn.close")} onClick={() => setMenu(false)} className="text-[#A6B4C8] hover:text-[#F3F7FF] cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <label className="text-xs text-[#A6B4C8] flex flex-col gap-1.5">
              {t("ui.voice.language")}
              <select value={s.lang} onChange={(e) => s.set({ lang: e.target.value as typeof s.lang })} className="rounded-lg bg-[#0B1220] border border-[#26364D] p-2 text-xs text-[#F3F7FF]">
                {LANGS.map((l) => (
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>
            </label>
            <Button variant="secondary" onClick={() => s.set({ quality: s.quality === "high" ? "low" : "high" })} className="justify-start gap-2 bg-[#0B1220] border border-[#26364D] text-[#F3F7FF] hover:bg-[#16243B]">
              <Settings2 size={15} className="text-[#35B9FF]" /> {t("ui.game.graphics")}: {s.quality}
            </Button>
            <Button variant="secondary" onClick={() => { s.set({ learn: "index" }); setMenu(false); }} className="justify-start gap-2 bg-[#0B1220] border border-[#26364D] text-[#F3F7FF] hover:bg-[#16243B]">
              <BookOpen size={15} className="text-[#35B9FF]" /> {t("ui.learn.title")}
            </Button>
            <p className="text-[10px] text-[#A6B4C8] mt-1">NASA NSSDCA · NASA/JPL Horizons · NASA 3D Vault</p>
          </section>
        </div>
      )}

      {mentor && <Mentor onClose={() => setMentor(false)} />}
      </div>
    </FramePanelContext.Provider>
  );
}

function Mentor({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const voice = useVoice();
  const text = t("ayeshaTips.build");
  return (
    <div className="pointer-events-auto fixed inset-0 z-40 grid place-items-center bg-[#070B14]/85 p-4 backdrop-blur-md animate-fade-in" onClick={() => { voice.stop(); onClose(); }}>
      <section className="relative z-50 w-full max-w-md rounded-2xl border border-[#26364D] bg-[#111C2E] p-6 shadow-2xl text-[#F3F7FF] flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#26364D] pb-3">
          <div className="flex items-center gap-2.5">
            <AyeshaAvatar />
            <div>
              <h2 className="text-sm font-bold text-[#F3F7FF]">{t("ui.ayesha.name")}</h2>
              <p className="text-[10px] text-[#A6B4C8]">{t("ui.ayesha.role")}</p>
            </div>
          </div>
          <button aria-label={t("ui.learn.close")} onClick={() => { voice.stop(); onClose(); }} className="text-[#A6B4C8] hover:text-[#F3F7FF] cursor-pointer">
            <X size={16} />
          </button>
        </div>
        <p className="text-xs text-[#A6B4C8] leading-relaxed">{text}</p>
        <VoiceBar text={text} voice={voice} />
        <Button onClick={() => { voice.stop(); onClose(); }} className="bg-gradient-to-r from-[#35B9FF] to-[#0284C7] text-[#070B14] font-bold mt-2">{t("ui.ayesha.dismiss")}</Button>
      </section>
    </div>
  );
}

function Actions({ back, next, label, onNext }: { back: Phase; next: Phase; label?: string | undefined; onNext?: (() => void) | undefined }) {
  const s = useMissionStore();
  const { t } = useTranslation();
  return (
    <footer className="mt-3 flex items-center justify-between gap-2 border-t border-[#162746] pt-2.5">
      <button
        onClick={() => {
          sfx.click();
          s.go(back);
        }}
        className="flex items-center gap-1.5 rounded-xl border border-[#162746] bg-[#050B18] px-3.5 py-1.5 text-[11px] font-bold text-[#94A9C9] hover:text-white hover:bg-[#0B1730] transition active:scale-95 cursor-pointer"
      >
        <ArrowLeft size={13} /> {t("ui.flow.back")}
      </button>
      <button
        onClick={() => {
          sfx.click();
          onNext?.();
          s.go(next);
        }}
        className="flex items-center gap-1.5 rounded-xl border border-[#00F0FF] bg-gradient-to-r from-[#00F0FF] to-[#0284C7] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#030712] shadow-[0_0_15px_rgba(56,189,248,0.35)] transition hover:brightness-110 active:scale-95 cursor-pointer"
      >
        {label ?? t("ui.flow.next")} <ArrowRight size={13} />
      </button>
    </footer>
  );
}

// Side-Docked Non-Obstructive Layout
function Layout({
  phase,
  title,
  eyebrow,
  info,
  children,
  back,
  next,
  nextLabel,
  onNext,
  media,
}: {
  phase: Phase;
  title: string;
  eyebrow?: string;
  info?: ReactNode;
  children: ReactNode;
  back: Phase;
  next: Phase;
  nextLabel?: string;
  onNext?: () => void;
  media?: ReactNode;
}) {
  const { t } = useTranslation();
  const { hidePanel, setHidePanel } = useFramePanel();

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Media Overlay (Positioned on the Left Side, Non-Obstructive) */}
      <div className="pointer-events-auto absolute bottom-14 left-3 sm:bottom-4 sm:left-4 z-20">
        {media}
      </div>

      {/* Main Interactive Action Panel (Docked to the RIGHT SIDE only) */}
      {!hidePanel ? (
        <aside className="pointer-events-auto absolute right-2 sm:right-4 top-14 bottom-14 sm:bottom-4 z-30 flex w-[320px] max-w-[88vw] flex-col rounded-2xl border border-[#162746] bg-[#050B18]/95 p-3.5 sm:p-4 backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.85)]">
          <div className="flex items-center justify-between border-b border-[#162746] pb-2">
            <div>
              <p className="text-[9px] font-mono tracking-widest text-[#00F0FF] uppercase font-bold">
                {eyebrow ?? t("exp.flightPlan")}
              </p>
              <h1 className="text-base font-bold text-white uppercase tracking-wider">
                {title}
              </h1>
            </div>
            {setHidePanel && (
              <button
                onClick={() => setHidePanel(true)}
                title="Hide panel to view 3D scene"
                className="grid size-6 place-items-center rounded-lg border border-[#162746] bg-[#081226] text-[#94A9C9] hover:text-white hover:bg-[#0F1D38] transition cursor-pointer"
              >
                <EyeOff size={12} />
              </button>
            )}
          </div>

          {info && (
            <div className="mt-2 rounded-xl bg-[#081226] border border-[#162746] p-2.5 text-[11px] text-[#94A9C9] leading-relaxed">
              {info}
            </div>
          )}

          <div className="mt-2.5 flex-1 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
            {children}
          </div>

          <Actions back={back} next={next} label={nextLabel} onNext={onNext} />
        </aside>
      ) : (
        /* Minimized Floating Pill when HUD is collapsed */
        <button
          onClick={() => setHidePanel?.(false)}
          className="pointer-events-auto absolute right-3 bottom-16 sm:bottom-4 z-30 flex items-center gap-2 rounded-xl border border-[#00F0FF]/50 bg-[#050B18]/95 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#00F0FF] backdrop-blur-xl shadow-[0_0_20px_rgba(56,189,248,0.25)] transition hover:bg-[#0B1730] active:scale-95 cursor-pointer"
        >
          <Eye size={14} className="animate-pulse text-[#00F0FF]" />
          <span>SHOW CONTROLS</span>
        </button>
      )}
    </div>
  );
}

function DestinationCaption({ mission }: { mission: MissionId }) {
  const { t } = useTranslation();
  const body = BODIES[mission];
  const meta = NASA_WORLD_DATA[mission];

  return (
    <div className="max-w-[280px] sm:max-w-xs rounded-2xl border border-[#00F0FF]/40 bg-[#050B18]/95 p-3.5 backdrop-blur-2xl shadow-2xl text-white">
      <div className="flex items-center gap-2.5">
        <img src={meta.img} alt={mission} className="size-6 object-contain" />
        <div>
          <span className="text-[9px] font-mono text-[#00F0FF] uppercase font-bold tracking-wider block">
            VERIFIED TARGET
          </span>
          <h2 className="text-base font-bold text-white leading-tight">
            {t(`exp.destinations.${mission}.name`)}
          </h2>
        </div>
      </div>

      <p className="mt-2 text-[11px] text-[#94A9C9] leading-snug">
        {meta.landingTarget}
      </p>

      <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-[10px] font-mono">
        <div className="rounded-xl bg-[#081226] p-2 border border-[#162746]">
          <span className="text-[#94A9C9] block text-[8px] uppercase tracking-wider">GRAVITY</span>
          <b className="text-[#00F0FF] font-bold text-xs">{body.gravity} m/s²</b>
        </div>
        <div className="rounded-xl bg-[#081226] p-2 border border-[#162746]">
          <span className="text-[#94A9C9] block text-[8px] uppercase tracking-wider">SOLAR DIST</span>
          <b className="text-[#00F0FF] font-bold text-xs">{body.au} AU</b>
        </div>
      </div>

      <p className="mt-2.5 text-[10px] text-[#94A9C9] leading-tight border-t border-[#162746] pt-2">
        <strong className="text-white">NASA Heritage:</strong> {meta.scienceNote}
      </p>
    </div>
  );
}

// Destination Selector with Rich NASA Imagery
function Planet(props: any) {
  const s = useMissionStore();
  const { t } = useTranslation();

  return (
    <Layout
      {...props}
      phase="missions"
      title={t("ui.flow.planet")}
      info={t("ui.game.chooseHint")}
      back="menu"
      next="brief"
      nextLabel={t("ui.flow.mission")}
      media={<DestinationCaption mission={s.mission} />}
    >
      <div className="space-y-1.5">
        {ids.map((id) => {
          const isSelected = s.mission === id;
          const meta = NASA_WORLD_DATA[id];
          const body = BODIES[id];
          return (
            <button
              key={id}
              onClick={() => {
                sfx.click();
                s.set({ mission: id });
              }}
              className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition border cursor-pointer ${
                isSelected
                  ? "border-[#00F0FF] bg-[#00F0FF]/15 shadow-[0_0_18px_rgba(56,189,248,0.3)] ring-1 ring-[#00F0FF]"
                  : "border-[#162746] bg-[#050B18]/85 hover:border-[#00F0FF]/50 hover:bg-[#0B1730]"
              }`}
            >
              <img src={meta.img} alt={id} className="size-9 rounded-xl bg-[#081226] p-1.5 object-contain shrink-0 border border-[#162746]" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-wide">
                    {t(`exp.destinations.${id}.name`)}
                  </span>
                  {id === "Mars" && (
                    <span className="rounded bg-[#00F0FF]/20 px-1.5 py-0.5 text-[8px] font-bold text-[#00F0FF] border border-[#00F0FF]/40 uppercase">
                      REC
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-[#94A9C9] truncate mt-0.5">
                  {meta.landingTarget}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[9px] font-mono text-[#64748B]">
                  <span>{body.gravity} m/s²</span>
                  <span>·</span>
                  <span>{body.au} AU</span>
                  <span>·</span>
                  <span className="text-[#00F0FF]">{body.periodDays}d period</span>
                </div>
              </div>
              {isSelected && <Check size={14} className="text-[#00F0FF] shrink-0" />}
            </button>
          );
        })}
      </div>
    </Layout>
  );
}

function Objective(props: any) {
  const s = useMissionStore();
  const { t } = useTranslation();
  const b = BODIES[s.mission];

  return (
    <Layout
      {...props}
      phase="brief"
      title={t("ui.flow.mission")}
      back="missions"
      next="craft"
      nextLabel="CHOOSE SPACECRAFT"
      media={<DestinationCaption mission={s.mission} />}
    >
      <div className="space-y-2">
        {(["surface", "orbit", "survey"] as const).map((id) => {
          const isSelected = s.objective === id;
          return (
            <button
              key={id}
              onClick={() => {
                sfx.click();
                s.set({ objective: id });
              }}
              className={`flex w-full items-center justify-between rounded-xl p-3 text-left transition border cursor-pointer ${
                isSelected
                  ? "border-[#00F0FF] bg-[#00F0FF]/15 shadow-[0_0_18px_rgba(56,189,248,0.3)] ring-1 ring-[#00F0FF]"
                  : "border-[#162746] bg-[#050B18]/85 hover:border-[#00F0FF]/50 hover:bg-[#0B1730]"
              }`}
            >
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  {t(`ui.flow.${id}`)}
                </span>
                <span className="text-[10px] text-[#94A9C9] block mt-0.5 leading-snug">
                  {t(id === "surface" && b.atmosphere === "gas" ? "exp.gasHint" : `exp.${id}Hint`)}
                </span>
              </div>
              {isSelected && <Check size={14} className="text-[#00F0FF] shrink-0" />}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[9px] text-[#64748B] font-mono">
        Scientific Protocol: {SOURCES.factsheet}
      </p>
    </Layout>
  );
}

function RoutePick(props: any) {
  const s = useMissionStore();
  const { t } = useTranslation();
  const d = designOf(s);
  const a = analyze(d);

  const routeDetails: Record<RouteId, { tag: string; icon: string; desc: string; heritage: string }> = {
    safe: {
      tag: "MINIMUM ENERGY",
      icon: "🎯",
      desc: "Hohmann transfer ellipse tangent to both orbits. Lowest propellant consumption; ideal launch window required.",
      heritage: "Used by Mars Odyssey, MRO & Perseverance 2020",
    },
    fast: {
      tag: "HYPERBOLIC EXPRESS",
      icon: "⚡",
      desc: "High-thrust trajectory cutting transit duration by ~35%. Requires +25-40% extra delta-V and higher entry braking.",
      heritage: "Used by New Horizons (Jupiter flyby & Pluto)",
    },
    science: {
      tag: "MULTI-BODY SURVEY",
      icon: "🔬",
      desc: "Extended heliocentric corridor crossing interplanetary dust boundaries and asteroid corridors for maximum science yield.",
      heritage: "Used by Dawn & Cassini-Huygens",
    },
    risky: {
      tag: "GRAVITY SLINGSHOT",
      icon: "🌀",
      desc: "Planetary orbital momentum exchange. Conserves propellant substantially but requires high-precision navigation.",
      heritage: "Used by Voyager 1/2 & Galileo",
    },
  };

  return (
    <Layout
      {...props}
      phase="route"
      title="TRAJECTORY PLANNING"
      eyebrow="ORBITAL MECHANICS MATRIX"
      back="build"
      next="routePreview"
      nextLabel="REVIEW TRAJECTORY MAP"
      info="Select an interplanetary flight trajectory. Every route balances transit duration, Delta-V requirements, and radiation exposure."
      media={
        <div className="max-w-[290px] sm:max-w-xs rounded-2xl border border-[#00F0FF]/40 bg-[#050B18]/95 p-3.5 backdrop-blur-2xl shadow-2xl text-[#F1F5F9]">
          <div className="flex items-center gap-2 border-b border-[#162746] pb-2">
            <Compass size={18} className="text-[#00F0FF] animate-spin" style={{ animationDuration: "14s" }} />
            <div>
              <span className="text-[9px] font-mono text-[#00F0FF] font-bold uppercase tracking-wider block">HELIOCENTRIC VECTOR</span>
              <b className="text-xs text-white">EARTH ➔ {s.mission.toUpperCase()}</b>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-[#94A9C9] leading-tight">
            Trajectory calculated using Keplerian two-body orbital elements. Drag the 3D map to orbit and inspect the transfer arc in space.
          </p>
          <div className="mt-2.5 flex items-center justify-between border-t border-[#162746] pt-2 text-[9px] font-mono">
            <span className="text-[#94A9C9]">SHIP ΔV BUDGET:</span>
            <b className={a.dvMargin < 0 ? "text-[#EF4444]" : "text-[#34D399]"}>
              {a.dv.toFixed(1)} km/s
            </b>
          </div>
        </div>
      }
    >
      <div className="space-y-2">
        {(Object.keys(ROUTES) as RouteId[]).map((id) => {
          const isSelected = s.route === id;
          const r = ROUTES[id];
          const info = routeDetails[id];
          const routeDv = MISSIONS[s.mission].dv * r.dv;
          const routeDays = Math.round(MISSIONS[s.mission].days * r.time);
          const hasSufficientDv = a.dv >= routeDv;

          return (
            <button
              key={id}
              onClick={() => {
                sfx.click();
                s.set({ route: id });
              }}
              className={`flex w-full flex-col rounded-xl p-3 text-left transition border cursor-pointer ${
                isSelected
                  ? "border-[#00F0FF] bg-[#00F0FF]/15 shadow-[0_0_18px_rgba(56,189,248,0.3)] ring-1 ring-[#00F0FF]"
                  : "border-[#162746] bg-[#050B18]/85 hover:border-[#00F0FF]/50 hover:bg-[#0B1730]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{info.icon}</span>
                  <span className="text-xs font-bold text-white tracking-wide">
                    {r.name}
                  </span>
                </div>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/30 uppercase font-bold">
                  {info.tag}
                </span>
              </div>

              <p className="mt-1.5 text-[9.5px] text-[#94A9C9] leading-tight">
                {info.desc}
              </p>

              <div className="mt-2 grid grid-cols-3 gap-1 text-[9px] font-mono border-t border-[#162746] pt-1.5">
                <div>
                  <span className="text-[#64748B] block">TRANSIT</span>
                  <b className="text-[#F59E0B] font-bold">{routeDays} d</b>
                </div>
                <div>
                  <span className="text-[#64748B] block">REQ ΔV</span>
                  <b className={hasSufficientDv ? "text-[#00F0FF]" : "text-[#EF4444]"}>
                    {routeDv.toFixed(2)} km/s
                  </b>
                </div>
                <div>
                  <span className="text-[#64748B] block">HAZARD</span>
                  <b className={r.hazard > 1.2 ? "text-[#EF4444]" : r.hazard > 0.8 ? "text-[#F59E0B]" : "text-[#34D399]"}>
                    ×{r.hazard.toFixed(1)}
                  </b>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </Layout>
  );
}

function RoutePreview(props: any) {
  const s = useMissionStore();
  const { t } = useTranslation();
  const d = designOf(s);
  const a = analyze(d);
  const currentRoute = ROUTES[s.route];
  const targetMission = MISSIONS[s.mission];

  return (
    <Layout
      {...props}
      phase="routePreview"
      title="TRAJECTORY REVIEW & MAP"
      eyebrow="JPL HORIZONS EPHEMERIS"
      back="route"
      next="overview"
      nextLabel="MISSION ARCHITECTURE OVERVIEW"
      info={`Review the complete heliocentric transfer trajectory connecting Earth and ${s.mission}. Drag to orbit the 3D map.`}
      media={
        <div className="max-w-[310px] sm:max-w-xs rounded-2xl border border-[#00F0FF]/40 bg-[#050B18]/95 p-3.5 backdrop-blur-2xl shadow-2xl text-[#F1F5F9] space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#162746] pb-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#00F0FF] animate-ping" />
              <span className="text-[9px] font-mono text-[#00F0FF] uppercase font-bold tracking-wider">
                LIVE ORBITAL EPHEMERIS
              </span>
            </div>
            <span className="text-[8px] font-mono px-1 rounded bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30 font-bold">
              NASA JPL
            </span>
          </div>

          <LivePositions body={targetMission.body} />

          <div className="border-t border-[#162746] pt-2">
            <span className="text-[8px] font-mono text-[#94A9C9] uppercase block mb-1">MAP CAMERA CONTROLS</span>
            <SceneControls />
          </div>
        </div>
      }
    >
      <div className="space-y-2 text-xs font-mono">
        <div className="rounded-xl bg-[#050B18] p-2.5 border border-[#162746]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[#94A9C9] text-[10px]">SELECTED TRAJECTORY</span>
            <span className="text-[#00F0FF] font-bold text-[11px] uppercase">{currentRoute.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#94A9C9] text-[10px]">TOTAL TRANSIT DURATION</span>
            <b className="text-[#F59E0B] font-bold text-sm">{a.days} EARTH DAYS</b>
          </div>
        </div>

        <div className="rounded-xl bg-[#050B18] p-2.5 border border-[#162746] space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[#94A9C9]">REQUIRED DELTA-V:</span>
            <b className="text-[#00F0FF] font-bold">{a.required.toFixed(2)} km/s</b>
          </div>
          <div className="flex justify-between">
            <span className="text-[#94A9C9]">AVAILABLE SHIP ΔV:</span>
            <b className={a.dvMargin < 0 ? "text-[#EF4444]" : "text-[#34D399]"} font-bold>
              {a.dv.toFixed(2)} km/s
            </b>
          </div>
          <div className="flex justify-between border-t border-[#162746]/70 pt-1">
            <span className="text-[#94A9C9]">SAFETY MARGIN:</span>
            <b className={a.dvMargin < 0 ? "text-[#EF4444]" : "text-[#34D399]"}>
              {a.dvMargin < 0 ? `DEFICIT (${(a.dvMargin * 100).toFixed(0)}%)` : `+${(a.dvMargin * 100).toFixed(0)}% RESERVE`}
            </b>
          </div>
        </div>

        <div className="rounded-xl bg-[#050B18] p-2.5 border border-[#162746] grid grid-cols-2 gap-2 text-[10px]">
          <div>
            <span className="text-[#94A9C9] block">TARGET DISTANCE</span>
            <b className="text-white text-xs">{BODIES[s.mission].au} AU</b>
          </div>
          <div>
            <span className="text-[#94A9C9] block">SOLAR HAZARD</span>
            <b className={currentRoute.hazard > 1 ? "text-[#F59E0B]" : "text-[#34D399]"}>
              {(currentRoute.hazard * 100).toFixed(0)}% FLUX
            </b>
          </div>
        </div>

        <div className="rounded-xl bg-[#081226] p-2 border border-[#00F0FF]/30 text-[10px] text-[#94A9C9] leading-tight">
          <strong className="text-[#00F0FF]">Flight Controller Note:</strong> The cyan glowing ellipse on your screen depicts the interplanetary transfer trajectory. TLI/TMI injection occurs after circular low Earth orbit insertion.
        </div>
      </div>
    </Layout>
  );
}

function ChoiceStep(props: any) {
  const { phase } = props;
  const s = useMissionStore();
  const { t } = useTranslation();
  const a = analyze(designOf(s));
  const chain: Phase[] = ["routePreview", "objectives", "budget", "fuel", "power", "comms", "instruments", "overview"];
  const pos = chain.indexOf(phase);

  const step = (label: string, value: number, min: number, max: number, change: (v: number) => void) => (
    <div className="flex items-center justify-between rounded-xl bg-[#0B1220] p-2.5 border border-[#26364D] text-xs">
      <span className="font-bold text-[#A6B4C8]">{label}</span>
      <div className="flex items-center gap-2">
        <button
          disabled={value <= min}
          onClick={() => {
            sfx.click();
            change(value - 1);
          }}
          className="size-6 rounded-lg bg-[#111C2E] border border-[#26364D] grid place-items-center text-[#F3F7FF] hover:bg-[#16243B] disabled:opacity-30 cursor-pointer"
        >
          -
        </button>
        <b className="w-5 text-center font-mono text-[#35B9FF] font-bold">{value}</b>
        <button
          disabled={value >= max}
          onClick={() => {
            sfx.click();
            change(value + 1);
          }}
          className="size-6 rounded-lg bg-[#111C2E] border border-[#26364D] grid place-items-center text-[#F3F7FF] hover:bg-[#16243B] disabled:opacity-30 cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <Layout
      {...props}
      phase={phase}
      title={t(`ui.flow.${phase}`)}
      back={chain[pos - 1] ?? "routePreview"}
      next={chain[pos + 1] ?? "overview"}
      media={
        <div className="max-w-xs rounded-2xl border border-[#26364D] bg-[#111C2E]/95 p-3.5 backdrop-blur-xl shadow-xl">
          <span className="text-[10px] font-mono text-[#35B9FF] uppercase tracking-wider block font-bold">{s.mission} / {t(`exp.route_${s.route}`)}</span>
          <strong className="text-xl font-bold text-[#F3F7FF] mt-1 block">
            {phase === "fuel" ? `${a.dv.toFixed(2)} km/s` : phase === "power" ? `${a.generation} kW` : phase === "comms" ? `${s.antennas} ×` : phase === "instruments" ? `${a.science} PTS` : phase === "budget" ? `${fmt(a.wet)} kg` : `${a.days} d`}
          </strong>
        </div>
      }
    >
      <div className="space-y-2">
        {phase === "objectives" && (
          <>
            {step(t("ui.game.engineCount"), s.engines, 1, 3, (v) => s.set({ engines: v }))}
            <div className="rounded-xl bg-[#0B1220] p-2.5 border border-[#26364D] text-[10px] text-[#A6B4C8]">
              Active Propulsion: <strong className="text-[#35B9FF]">{ENGINES[s.engine].name}</strong> ({ENGINES[s.engine].thrust})
            </div>
          </>
        )}

        {phase === "budget" && (
          <div className="space-y-1.5">
            {([1, 2, 3] as const).map((v) => (
              <button
                key={v}
                onClick={() => {
                  sfx.click();
                  s.set({ budget: v });
                }}
                className={`flex w-full items-center justify-between rounded-xl p-2.5 text-left border cursor-pointer ${
                  s.budget === v ? "border-[#35B9FF] bg-[#35B9FF]/15 shadow-[0_0_15px_rgba(53,185,255,0.25)]" : "border-[#26364D] bg-[#0B1220]/80 hover:border-[#35B9FF]/50 hover:bg-[#16243B]"
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-[#F3F7FF] block">
                    {t(`ui.flow.${(["limited", "balanced", "expanded"] as const)[v - 1]}`)}
                  </span>
                  <span className="text-[10px] text-[#A6B4C8] block mt-0.5">{t(`exp.budget_${v}`)}</span>
                </div>
                {s.budget === v && <Check size={14} className="text-[#35B9FF]" />}
              </button>
            ))}
          </div>
        )}

        {phase === "fuel" && (
          <>
            {step(t("ui.game.tanks"), s.tanks, 1, 4, (v) => s.set({ tanks: v }))}
            <label className="block rounded-xl bg-[#0B1220] p-2.5 border border-[#26364D] text-xs">
              <div className="flex justify-between mb-1.5 font-bold">
                <span className="text-[#A6B4C8]">{t("ui.game.fuelLoad")}</span>
                <span className="font-mono text-[#35B9FF]">{s.fuel}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={s.fuel}
                onChange={(e) => s.set({ fuel: +e.target.value })}
                className="w-full accent-[#35B9FF] cursor-pointer"
              />
            </label>
          </>
        )}

        {phase === "power" && (
          <>
            {step(t("ui.game.solar"), s.wings, 0, 6, (v) => s.set({ wings: v }))}
            {step(t("ui.game.rtg"), s.rtgs, 0, 4, (v) => s.set({ rtgs: v }))}
            <button
              onClick={() => {
                sfx.click();
                s.set({ battery: !s.battery });
              }}
              className={`flex w-full items-center justify-between rounded-xl p-2.5 border cursor-pointer ${
                s.battery ? "border-[#35B9FF] bg-[#35B9FF]/15 shadow-[0_0_15px_rgba(53,185,255,0.25)]" : "border-[#26364D] bg-[#0B1220]/80 hover:border-[#35B9FF]/50 hover:bg-[#16243B]"
              }`}
            >
              <span className="text-xs font-bold text-[#F3F7FF]">{t("ui.game.battery")}</span>
              {s.battery && <Check size={14} className="text-[#35B9FF]" />}
            </button>
          </>
        )}

        {phase === "comms" && (
          <>
            {step(t("ui.game.antennas"), s.antennas, 1, 2, (v) => s.set({ antennas: v }))}
            <button
              onClick={() => {
                sfx.click();
                s.set({ shield: !s.shield });
              }}
              className={`flex w-full items-center justify-between rounded-xl p-2.5 border cursor-pointer ${
                s.shield ? "border-[#35B9FF] bg-[#35B9FF]/15 shadow-[0_0_15px_rgba(53,185,255,0.25)]" : "border-[#26364D] bg-[#0B1220]/80 hover:border-[#35B9FF]/50 hover:bg-[#16243B]"
              }`}
            >
              <span className="text-xs font-bold text-[#F3F7FF]">{t("ui.game.shield")}</span>
              {s.shield && <Check size={14} className="text-[#35B9FF]" />}
            </button>
          </>
        )}

        {phase === "instruments" && (
          <div className="space-y-1.5">
            {(Object.keys(INSTRUMENTS) as Instrument[]).map((id) => {
              const isSelected = s.instruments.includes(id);
              const inst = INSTRUMENTS[id];
              return (
                <button
                  key={id}
                  onClick={() => {
                    sfx.click();
                    s.toggleInstrument(id);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl p-2.5 text-left border cursor-pointer ${
                    isSelected ? "border-[#35B9FF] bg-[#35B9FF]/15 shadow-[0_0_15px_rgba(53,185,255,0.25)]" : "border-[#26364D] bg-[#0B1220]/80 hover:border-[#35B9FF]/50 hover:bg-[#16243B]"
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-[#F3F7FF] block">{inst.name}</span>
                    <span className="text-[10px] text-[#35B9FF] font-mono block mt-0.5">
                      +{inst.science} PTS · {inst.mass} kg · {inst.kw} kW
                    </span>
                  </div>
                  {isSelected && <Check size={14} className="text-[#35B9FF]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}

function Overview(props: any) {
  const s = useMissionStore();
  const { t } = useTranslation();
  const d = designOf(s);
  const a = analyze(d);
  const currentMission = MISSIONS[s.mission];
  const currentRoute = ROUTES[s.route];

  return (
    <Layout
      {...props}
      phase="overview"
      title="MISSION ARCHITECTURE OVERVIEW"
      eyebrow="PRE-FLIGHT AUTHORIZATION"
      back="routePreview"
      next="check"
      nextLabel="SYSTEMS POLL & PRE-LAUNCH CHECK"
      media={<DestinationCaption mission={s.mission} />}
    >
      <div className="space-y-2 text-xs font-mono">
        {/* Destination & Flight Profile */}
        <div className="rounded-xl bg-[#050B18] p-2.5 border border-[#162746]">
          <div className="flex justify-between items-center">
            <span className="text-[#94A9C9]">TARGET & OBJECTIVE</span>
            <b className="text-white font-bold">{s.mission.toUpperCase()} · {t(`ui.flow.${s.objective}`)}</b>
          </div>
          <div className="flex justify-between items-center mt-1 text-[11px]">
            <span className="text-[#94A9C9]">TRAJECTORY PROFILE</span>
            <b className="text-[#00F0FF]">{currentRoute.name} ({a.days} d)</b>
          </div>
        </div>

        {/* Mass Breakdown */}
        <div className="rounded-xl bg-[#050B18] p-2.5 border border-[#162746] space-y-1">
          <div className="flex justify-between">
            <span className="text-[#94A9C9]">TOTAL LAUNCH WET MASS:</span>
            <b className="text-white font-bold">{fmt(a.wet)} kg</b>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-[#94A9C9]">DRY MASS / PROPELLANT:</span>
            <span className="text-[#94A9C9]">{fmt(a.dry)} kg / {fmt(a.propellant)} kg</span>
          </div>
        </div>

        {/* Propulsion & Delta-V Ledger */}
        <div className="rounded-xl bg-[#050B18] p-2.5 border border-[#162746] space-y-1">
          <div className="flex justify-between">
            <span className="text-[#94A9C9]">DELTA-V AVAILABLE:</span>
            <b className={a.dvMargin < 0 ? "text-[#EF4444]" : "text-[#34D399] font-bold"}>
              {a.dv.toFixed(2)} km/s
            </b>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-[#94A9C9]">MISSION REQUIREMENT:</span>
            <span className="text-[#00F0FF] font-bold">{a.required.toFixed(2)} km/s</span>
          </div>
          <div className="flex justify-between text-[10px] border-t border-[#162746]/70 pt-1">
            <span className="text-[#94A9C9]">MARGIN:</span>
            <b className={a.dvMargin < 0 ? "text-[#EF4444]" : "text-[#34D399]"}>
              {a.dvMargin < 0 ? `DEFICIT (${(a.dvMargin * 100).toFixed(0)}%)` : `+${(a.dvMargin * 100).toFixed(0)}% (GO)`}
            </b>
          </div>
        </div>

        {/* Power & Payload */}
        <div className="rounded-xl bg-[#050B18] p-2.5 border border-[#162746] space-y-1">
          <div className="flex justify-between">
            <span className="text-[#94A9C9]">POWER GENERATION:</span>
            <b className={a.powerMargin < 0 ? "text-[#EF4444]" : "text-[#34D399] font-bold"}>
              {a.generation.toFixed(2)} kW / {a.draw.toFixed(2)} kW
            </b>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-[#94A9C9]">EQUIPPED SENSORS:</span>
            <b className="text-[#00F0FF]">{s.instruments.length} SENSORS (+{a.science} PTS)</b>
          </div>
        </div>

        {/* Readiness Status Box */}
        <div className={`rounded-xl p-2.5 border text-[11px] flex items-center gap-2 ${
          a.canLaunch
            ? "border-[#34D399]/40 bg-[#34D399]/10 text-[#34D399]"
            : "border-[#EF4444]/40 bg-[#EF4444]/10 text-[#EF4444]"
        }`}>
          <div className="shrink-0">
            {a.canLaunch ? <Check size={16} /> : <AlertTriangle size={16} />}
          </div>
          <div>
            <b className="block">{a.canLaunch ? "FLIGHT ARCHITECTURE APPROVED" : "ENGINEERING LIMIT EXCEEDED"}</b>
            <span className="text-[9.5px] opacity-80 block">
              {a.canLaunch ? "Readiness index nominal. Proceed to Systems Poll." : a.issues[0]?.text || "Check mass or fuel reserves."}
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function CraftLoreCard({ craft }: { craft: NasaCraftModelInfo }) {
  return (
    <div className="max-w-[290px] sm:max-w-xs rounded-2xl border border-[#38bdf8]/40 bg-[#050B18]/95 p-3.5 backdrop-blur-2xl shadow-2xl text-[#f1f5f9]">
      <div className="flex items-center gap-2.5 border-b border-[#1e293b] pb-2.5">
        <Rocket size={20} className="text-[#38bdf8] shrink-0" />
        <div>
          <span className="text-[9px] font-mono text-[#38bdf8] uppercase font-bold tracking-wider block">
            {craft.classType}
          </span>
          <h2 className="text-sm font-bold text-white leading-tight">
            {craft.name}
          </h2>
        </div>
      </div>

      <div className="mt-2 text-[10px] space-y-1">
        <p className="text-[#94a3b8]"><b className="text-white">Agency:</b> {craft.agency}</p>
        <p className="text-[#94a3b8]"><b className="text-white">Heritage:</b> {craft.historicalMission} ({craft.launchDate})</p>
        <p className="text-[#94a3b8]"><b className="text-white">Milestone:</b> {craft.achievements}</p>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-[9px] font-mono border-t border-[#1e293b] pt-2">
        <div className="rounded-lg bg-[#070e20] p-1.5 border border-[#1e293b]">
          <span className="text-[#94a3b8] block">PROPULSION</span>
          <b className="text-[#38bdf8] block truncate">{craft.specs.propulsion}</b>
        </div>
        <div className="rounded-lg bg-[#070e20] p-1.5 border border-[#1e293b]">
          <span className="text-[#94a3b8] block">DRY MASS</span>
          <b className="text-white block">{craft.specs.dryMass}</b>
        </div>
      </div>
    </div>
  );
}

function Craft(props: any) {
  const s = useMissionStore();
  const { t } = useTranslation();
  const catalogList = Object.values(NASA_SPACECRAFT_CATALOG);
  const activeCraft = catalogList.find((c) => c.url === s.activeNasaModel) || getMissionModel(s.mission);

  return (
    <Layout
      {...props}
      phase="craft"
      title="SPACECRAFT ARCHITECTURE"
      eyebrow="NASA 3D VAULT"
      back="brief"
      next="build"
      nextLabel="FORGE PROPULSION & SYSTEMS"
      info="Select an authentic flight-proven NASA launch vehicle or planetary explorer."
      media={<CraftLoreCard craft={activeCraft} />}
    >
      <div className="space-y-1.5">
        {catalogList.map((craft) => {
          const isSelected = activeCraft.id === craft.id || s.activeNasaModel === craft.url;
          return (
            <button
              key={craft.id}
              onClick={() => {
                sfx.click();
                s.set({ activeNasaModel: craft.url, craft: craft.id as any });
              }}
              className={`flex w-full items-center justify-between rounded-xl p-2.5 text-left border cursor-pointer transition ${
                isSelected
                  ? "border-[#38bdf8] bg-[#38bdf8]/15 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                  : "border-[#1e293b] bg-[#050B18]/80 hover:border-[#38bdf8]/50 hover:bg-[#0c1830]"
              }`}
            >
              <div className="min-w-0 flex-1 pr-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate block">
                    {craft.name}
                  </span>
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/30 uppercase shrink-0">
                    {craft.classType}
                  </span>
                </div>
                <span className="text-[9.5px] text-[#94a3b8] block truncate mt-0.5">
                  {craft.historicalMission} · {craft.agency}
                </span>
              </div>
              {isSelected && <Check size={14} className="text-[#38bdf8] shrink-0" />}
            </button>
          );
        })}
      </div>
    </Layout>
  );
}

type Category = "engine" | "fuel" | "power" | "comms" | "science";

function Hangar() {
  const s = useMissionStore();
  const { t } = useTranslation();
  const a = analyze(designOf(s));
  const [tab, setTab] = useState<Category>("engine");
  const categories: Category[] = ["engine", "fuel", "power", "comms", "science"];
  const craftInfo = getMissionModel(s.mission);
  const { hidePanel, setHidePanel } = useFramePanel();

  const step = (label: string, value: number, min: number, max: number, change: (v: number) => void) => (
    <div className="flex items-center justify-between rounded-xl bg-[#0B1220] p-2.5 border border-[#26364D] text-xs">
      <span className="font-bold text-[#A6B4C8]">{label}</span>
      <div className="flex items-center gap-2">
        <button
          disabled={value <= min}
          onClick={() => {
            sfx.click();
            change(value - 1);
          }}
          className="size-6 rounded-lg bg-[#111C2E] border border-[#26364D] grid place-items-center text-[#F3F7FF] hover:bg-[#16243B] disabled:opacity-30 cursor-pointer"
        >
          -
        </button>
        <b className="w-5 text-center font-mono text-[#35B9FF] font-bold">{value}</b>
        <button
          disabled={value >= max}
          onClick={() => {
            sfx.click();
            change(value + 1);
          }}
          className="size-6 rounded-lg bg-[#111C2E] border border-[#26364D] grid place-items-center text-[#F3F7FF] hover:bg-[#16243B] disabled:opacity-30 cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative h-full w-full pointer-events-none">
        {/* Left Bottom 3D Craft Info Tag */}
        <div className="pointer-events-auto absolute bottom-14 left-3 sm:bottom-4 sm:left-4 z-20 flex flex-col gap-2">
          <div className="rounded-2xl border border-[#26364D] bg-[#111C2E]/95 p-3.5 backdrop-blur-xl shadow-xl max-w-xs">
            <span className="text-[9px] font-mono text-[#35B9FF] uppercase font-bold tracking-wider block">ACTIVE AIRFRAME</span>
            <h2 className="text-sm font-bold text-[#F3F7FF]">{craftInfo.name}</h2>
            <p className="text-[10px] text-[#A6B4C8]">{craftInfo.agency} · {craftInfo.historicalMission}</p>
          </div>
          <div className="flex items-center gap-2">
            <SceneControls />
          </div>
        </div>

        {/* Right Side Docked Engineering Panel */}
        {!hidePanel ? (
          <aside className="pointer-events-auto absolute right-2 sm:right-4 top-4 bottom-14 sm:bottom-4 z-30 flex w-[320px] max-w-[88vw] flex-col rounded-2xl border border-[#26364D] bg-[#111C2E]/95 p-3.5 sm:p-4 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.65)]">
            <div className="flex items-center justify-between border-b border-[#26364D] pb-2">
              <div>
                <p className="text-[9px] font-mono tracking-widest text-[#35B9FF] uppercase font-bold">SPACECRAFT FORGE</p>
                <h1 className="text-base font-bold text-[#F3F7FF] uppercase">{t("ui.game.assemble")}</h1>
              </div>
              <button
                onClick={() => setHidePanel(true)}
                className="grid size-6 place-items-center rounded-lg border border-[#26364D] bg-[#0B1220] text-[#A6B4C8] hover:text-[#F3F7FF] hover:bg-[#16243B] transition cursor-pointer"
              >
                <EyeOff size={12} />
              </button>
            </div>

            {/* Category Switcher Tabs */}
            <div className="mt-2.5 flex items-center justify-between gap-1 overflow-x-auto pb-1 text-[10px] font-bold">
              {categories.map((id) => (
                <button
                  key={id}
                  onClick={() => {
                    sfx.click();
                    setTab(id);
                  }}
                  className={`rounded-lg px-2.5 py-1 uppercase tracking-wider transition cursor-pointer ${
                    tab === id
                      ? "border border-[#35B9FF] bg-[#35B9FF]/20 text-[#35B9FF] shadow-[0_0_10px_rgba(53,185,255,0.3)] font-bold"
                      : "text-[#A6B4C8] hover:text-[#F3F7FF]"
                  }`}
                >
                  {id}
                </button>
              ))}
            </div>

            {/* Controls Scroll Section */}
            <div className="mt-2.5 flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {tab === "engine" && (
                <>
                  {(Object.keys(ENGINES) as EngineId[]).map((id) => {
                    const isSelected = s.engine === id;
                    const eng = ENGINES[id];
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          sfx.click();
                          s.set({ engine: id });
                        }}
                        className={`flex w-full items-center justify-between rounded-xl p-2.5 text-left border cursor-pointer ${
                          isSelected ? "border-[#35B9FF] bg-[#35B9FF]/15 shadow-[0_0_15px_rgba(53,185,255,0.25)]" : "border-[#26364D] bg-[#0B1220]/80 hover:border-[#35B9FF]/50 hover:bg-[#16243B]"
                        }`}
                      >
                        <div>
                          <b className="text-xs text-[#F3F7FF] block">{eng.name}</b>
                          <small className="text-[10px] text-[#35B9FF] font-mono block mt-0.5">
                            Isp: {eng.isp}s · Thrust: {eng.thrust}
                          </small>
                          <small className="text-[9px] text-[#A6B4C8] block mt-0.5">{eng.note}</small>
                        </div>
                        {isSelected && <Check size={14} className="text-[#35B9FF] shrink-0" />}
                      </button>
                    );
                  })}
                  {step(t("ui.game.engineCount"), s.engines, 1, 3, (v) => s.set({ engines: v }))}
                </>
              )}

              {tab === "fuel" && (
                <>
                  {step(t("ui.game.tanks"), s.tanks, 1, 4, (v) => s.set({ tanks: v }))}
                  <label className="block rounded-xl bg-[#0B1220] p-2.5 border border-[#26364D] text-xs">
                    <div className="flex justify-between mb-1.5 font-bold">
                      <span className="text-[#A6B4C8]">{t("ui.game.fuelLoad")}</span>
                      <span className="font-mono text-[#35B9FF]">{s.fuel}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={s.fuel}
                      onChange={(e) => s.set({ fuel: +e.target.value })}
                      className="w-full accent-[#35B9FF] cursor-pointer"
                    />
                  </label>
                </>
              )}

              {tab === "power" && (
                <>
                  {step(t("ui.game.solar"), s.wings, 0, 6, (v) => s.set({ wings: v }))}
                  {step(t("ui.game.rtg"), s.rtgs, 0, 4, (v) => s.set({ rtgs: v }))}
                  <button
                    onClick={() => {
                      sfx.click();
                      s.set({ battery: !s.battery });
                    }}
                    className={`flex w-full items-center justify-between rounded-xl p-2.5 border cursor-pointer ${
                      s.battery ? "border-[#35B9FF] bg-[#35B9FF]/15 shadow-[0_0_15px_rgba(53,185,255,0.25)]" : "border-[#26364D] bg-[#0B1220]/80 hover:border-[#35B9FF]/50 hover:bg-[#16243B]"
                    }`}
                  >
                    <span className="text-xs font-bold text-[#F3F7FF]">{t("ui.game.battery")}</span>
                    {s.battery && <Check size={14} className="text-[#35B9FF]" />}
                  </button>
                </>
              )}

              {tab === "comms" && (
                <>
                  {step(t("ui.game.antennas"), s.antennas, 1, 2, (v) => s.set({ antennas: v }))}
                  <button
                    onClick={() => {
                      sfx.click();
                      s.set({ shield: !s.shield });
                    }}
                    className={`flex w-full items-center justify-between rounded-xl p-2.5 border cursor-pointer ${
                      s.shield ? "border-[#35B9FF] bg-[#35B9FF]/15 shadow-[0_0_15px_rgba(53,185,255,0.25)]" : "border-[#26364D] bg-[#0B1220]/80 hover:border-[#35B9FF]/50 hover:bg-[#16243B]"
                    }`}
                  >
                    <span className="text-xs font-bold text-[#F3F7FF]">{t("ui.game.shield")}</span>
                    {s.shield && <Check size={14} className="text-[#35B9FF]" />}
                  </button>
                </>
              )}

              {tab === "science" && (
                <div className="space-y-1.5">
                  {(Object.keys(INSTRUMENTS) as Instrument[]).map((id) => {
                    const isSelected = s.instruments.includes(id);
                    const inst = INSTRUMENTS[id];
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          sfx.click();
                          s.toggleInstrument(id);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl p-2.5 text-left border cursor-pointer ${
                          isSelected ? "border-[#35B9FF] bg-[#35B9FF]/15 shadow-[0_0_15px_rgba(53,185,255,0.25)]" : "border-[#26364D] bg-[#0B1220]/80 hover:border-[#35B9FF]/50 hover:bg-[#16243B]"
                        }`}
                      >
                        <div>
                          <b className="text-xs text-[#F3F7FF] block">{inst.name}</b>
                          <small className="text-[10px] text-[#35B9FF] font-mono block mt-0.5">
                            +{inst.science} PTS · {inst.mass} kg · {inst.kw} kW
                          </small>
                        </div>
                        {isSelected && <Check size={14} className="text-[#35B9FF] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Performance Stats Bar & Actions */}
            <div className="mt-2.5 border-t border-[#26364D] pt-2 text-[10px] font-mono grid grid-cols-2 gap-1.5">
              <div>
                <span className="text-[#A6B4C8] block">TOTAL MASS:</span>
                <b className="text-[#F3F7FF] font-bold">{fmt(a.wet)} kg</b>
              </div>
              <div>
                <span className="text-[#A6B4C8] block">DELTA-V:</span>
                <b className={a.dvMargin < 0 ? "text-[#FF5D73]" : "text-[#35D39A]"}>
                  {a.dv.toFixed(1)} / {a.required.toFixed(1)} km/s
                </b>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#162746] pt-2.5">
              <button
                onClick={() => {
                  sfx.click();
                  s.go("craft");
                }}
                className="flex items-center gap-1.5 rounded-xl border border-[#162746] bg-[#050B18] px-3.5 py-1.5 text-[11px] font-bold text-[#E2E8F0] hover:text-white hover:bg-[#0B1730] transition active:scale-95 cursor-pointer"
              >
                <ArrowLeft size={13} /> BACK
              </button>
              <button
                onClick={() => {
                  sfx.click();
                  s.go("route");
                }}
                className="flex items-center gap-1.5 rounded-xl border border-[#00F0FF] bg-gradient-to-r from-[#00F0FF] to-[#0284C7] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#030712] shadow-[0_0_15px_rgba(56,189,248,0.35)] transition hover:brightness-110 active:scale-95 cursor-pointer"
              >
                PLAN TRAJECTORY <ArrowRight size={13} />
              </button>
            </div>
          </aside>
        ) : (
          <button
            onClick={() => setHidePanel(false)}
            className="pointer-events-auto absolute right-3 bottom-16 sm:bottom-4 z-30 flex items-center gap-2 rounded-xl border border-[#35B9FF]/50 bg-[#111C2E]/95 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#35B9FF] backdrop-blur-xl shadow-[0_0_20px_rgba(53,185,255,0.25)] transition hover:bg-[#16243B] active:scale-95 cursor-pointer"
          >
            <Eye size={14} className="animate-pulse text-[#35B9FF]" />
            <span>FORGE CONTROLS</span>
          </button>
        )}
      </div>
    );
}

export function GameScreens({ phase }: { phase: Phase }) {
  let content: ReactNode = null;
  switch (phase) {
    case "missions":
      content = <Planet />;
      break;
    case "brief":
      content = <Objective />;
      break;
    case "route":
      content = <RoutePick />;
      break;
    case "routePreview":
      content = <RoutePreview />;
      break;
    case "objectives":
    case "budget":
    case "fuel":
    case "power":
    case "comms":
    case "instruments":
      content = <ChoiceStep phase={phase} />;
      break;
    case "overview":
      content = <Overview />;
      break;
    case "craft":
      content = <Craft />;
      break;
    case "build":
      content = <Hangar />;
      break;
    default:
      return null;
  }

  return <Frame phase={phase}>{content}</Frame>;
}
