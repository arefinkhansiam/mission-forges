import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, BookOpen, Box, Check, Compass, Database, Layers, Menu, Rocket, Settings2, Sparkles, UserRound, X, HelpCircle, Globe } from "lucide-react";
import { Button } from "../ui/button";
import { DataCenterModal } from "./DataCenterModal";
import { BODIES, SOURCES } from "../../lib/nasa-data";
import { analyze, ENGINES, fmt, INSTRUMENTS, MISSIONS, ROUTES, type EngineId, type Instrument, type MissionId, type RouteId } from "../../lib/mission-sim";
import { designOf, useMissionStore, type Phase } from "../../stores/mission-store";
import { LivePositions } from "./LivePositions";
import { LANGS } from "../../locales/resources";
import { AyeshaAvatar } from "./Ayesha";
import { useVoice, VoiceBar } from "./voice";
import { sfx } from "../../lib/audio";
import { DvPanel } from "./DvPanel";
import { CinematicIntro } from "./CinematicIntro";
import { SciencePlannerModal } from "./SciencePlannerModal";
import { ComponentDetailDrawer, type ComponentDetailType } from "./ComponentDetailDrawer";
import { MissionArchiveModal } from "./MissionArchiveModal";
import { Nasa3DLibraryModal } from "./Nasa3DLibraryModal";
import { Nasa3DBadge } from "./Nasa3DBadge";
import { getAssetForMission } from "../../lib/nasa-3d-registry";
import { SpaceDataSourcesModal } from "./SpaceDataSourcesModal";

const images: Record<MissionId, string> = {
  Moon: "/images/nasa-moon.svg",
  Venus: "/images/nasa-venus.svg",
  Mars: "/images/nasa-mars.svg",
  Mercury: "/images/nasa-mercury.svg",
  Europa: "/images/nasa-europa.svg",
  Titan: "/images/nasa-titan.svg",
  Ceres: "/images/nasa-ceres.svg",
  Jupiter: "/images/nasa-jupiter.svg",
  Saturn: "/images/nasa-saturn.svg",
};
const ids: MissionId[] = ["Moon", "Venus", "Mars", "Mercury", "Europa", "Titan", "Ceres", "Jupiter", "Saturn"];
const steps: Phase[] = ["missions", "brief", "route", "routePreview", "objectives", "budget", "fuel", "power", "comms", "instruments", "overview", "craft", "build", "check"];
const nameKey: Partial<Record<Phase, string>> = { missions: "planet", brief: "mission", route: "routePick", routePreview: "routePreview", objectives: "objectives", budget: "budget", fuel: "fuel", power: "power", comms: "comms", instruments: "instruments", overview: "overview", craft: "craft", build: "build", check: "score" };

function Frame({ phase, children }: { phase: Phase; children: ReactNode }) {
  const s = useMissionStore(); const { t } = useTranslation(); const [menu, setMenu] = useState(false); const [mentor, setMentor] = useState(false); const [dataCenterOpen, setDataCenterOpen] = useState(false); const [archiveOpen, setArchiveOpen] = useState(false); const [nasa3DOpen, setNasa3DOpen] = useState(false); const [globalDataOpen, setGlobalDataOpen] = useState(false);
  const current = steps.indexOf(phase);
  return <div className="gm-screen gm-flow">
    <header className="gm-header">
      <Button variant="ghost" className="gm-mark" onClick={() => s.go("menu")} aria-label={t("ui.game.home")}>◈ <strong>MISSION <span>FORGE</span></strong></Button>
      {current >= 0 && <div className="gm-flow-progress"><span>{String(current + 1).padStart(2, "0")} / {steps.length}</span><div><i style={{ width: `${(current + 1) / steps.length * 100}%` }} /></div><b>{t(`ui.flow.${nameKey[phase]}`)}</b></div>}
      <div className="gm-header-tools">
        <button className="gm-signal" onClick={() => setGlobalDataOpen(true)} title="NASA + 17 Space Agency Partners Open Data Catalog" style={{ cursor: "pointer", background: "none", border: "none" }}><Globe size={13} style={{ display: "inline", marginRight: "4px" }} /> 18 AGENCIES</button>
        <button className="gm-signal" onClick={() => setNasa3DOpen(true)} title="Official NASA 3D Models & Planetary Textures" style={{ cursor: "pointer", background: "none", border: "none" }}><Box size={13} style={{ display: "inline", marginRight: "4px" }} /> NASA 3D</button>
        <button className="gm-signal" onClick={() => setArchiveOpen(true)} title="NASA Missions, Spacecraft & Instruments Archive" style={{ cursor: "pointer", background: "none", border: "none" }}><Sparkles size={13} style={{ display: "inline", marginRight: "4px" }} /> NASA ARCHIVE</button>
        <button className="gm-signal" onClick={() => setDataCenterOpen(true)} title="Open NASA Horizons & Ephemeris Data Center" style={{ cursor: "pointer", background: "none", border: "none" }}><i /> NASA / JPL</button>
        <Button variant="ghost" size="icon" onClick={() => setMentor(true)} aria-label={t("ui.ayesha.name")} title={t("ui.ayesha.name")}><UserRound size={19} /></Button>
        <Button variant="ghost" size="icon" onClick={() => setMenu(!menu)} aria-label={t("ui.game.options")}><Menu size={19} /></Button>
      </div>
    </header>
    {children}
    {menu && <div className="gm-backdrop" onClick={() => setMenu(false)}><section className="gm-dialog" onClick={e => e.stopPropagation()}><Button variant="ghost" size="icon" className="gm-close" aria-label={t("ui.learn.close")} onClick={() => setMenu(false)}><X /></Button><h2>{t("ui.game.options")}</h2><label>{t("ui.voice.language")}<select value={s.lang} onChange={e => s.set({ lang: e.target.value as typeof s.lang })}>{LANGS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}</select></label><Button variant="secondary" onClick={() => s.set({ quality: s.quality === "high" ? "low" : "high" })}><Settings2 /> {t("ui.game.graphics")}: {s.quality}</Button><Button variant="secondary" onClick={() => { setGlobalDataOpen(true); setMenu(false); }}><Globe /> NASA + 17 Space Agency Partners</Button><Button variant="secondary" onClick={() => { setNasa3DOpen(true); setMenu(false); }}><Box /> NASA 3D Resources Library</Button><Button variant="secondary" onClick={() => { setArchiveOpen(true); setMenu(false); }}><Sparkles /> NASA Mission Archive & Presets</Button><Button variant="secondary" onClick={() => { setDataCenterOpen(true); setMenu(false); }}><Database /> NASA Data Center & Horizons</Button><Button variant="secondary" onClick={() => { s.set({ learn: "index" }); setMenu(false); }}><BookOpen /> {t("ui.learn.title")}</Button><p>NASA NSSDCA · NASA/JPL Horizons · NASA 3D Resources · 17 Space Agency Partners</p></section></div>}
    {mentor && <Mentor onClose={() => setMentor(false)} />}
    <DataCenterModal isOpen={dataCenterOpen} onClose={() => setDataCenterOpen(false)} />
    <MissionArchiveModal isOpen={archiveOpen} onClose={() => setArchiveOpen(false)} />
    <Nasa3DLibraryModal isOpen={nasa3DOpen} onClose={() => setNasa3DOpen(false)} />
    <SpaceDataSourcesModal isOpen={globalDataOpen} onClose={() => setGlobalDataOpen(false)} />
  </div>;
}

function Mentor({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation(); const voice = useVoice(); const text = t("ayeshaTips.build");
  return <div className="gm-backdrop" onClick={() => { voice.stop(); onClose(); }}><section className="gm-dialog" onClick={e => e.stopPropagation()}><Button variant="ghost" size="icon" className="gm-close" aria-label={t("ui.learn.close")} onClick={() => { voice.stop(); onClose(); }}><X /></Button><div className="gm-mentor-head"><AyeshaAvatar /><div><h2>{t("ui.ayesha.name")}</h2><p>{t("ui.ayesha.role")}</p></div></div><p className="gm-mentor-tip">{text}</p><VoiceBar text={text} voice={voice} /><Button onClick={() => { voice.stop(); onClose(); }}>{t("ui.ayesha.dismiss")}</Button></section></div>;
}

function Actions({ back, next, label, onNext }: { back: Phase; next: Phase; label?: string | undefined; onNext?: (() => void) | undefined }) {
  const s = useMissionStore(); const { t } = useTranslation();
  return <footer className="gm-flow-actions"><Button variant="ghost" onClick={() => s.go(back)}><ArrowLeft /> {t("ui.flow.back")}</Button><Button onClick={() => { onNext?.(); s.go(next); }}>{label ?? t("ui.flow.next")} <ArrowRight /></Button></footer>;
}
function Layout({ phase, title, eyebrow, info, children, back, next, nextLabel, onNext, media }: { phase: Phase; title: string; eyebrow?: string; info?: ReactNode; children: ReactNode; back: Phase; next: Phase; nextLabel?: string; onNext?: () => void; media?: ReactNode }) {
  return <Frame phase={phase}><main className="gm-flow-main"><aside className="gm-flow-panel"><div className="gm-flow-scroll"><p className="gm-kicker">{eyebrow ?? "MISSION FORGE / FLIGHT PLAN"}</p><h1>{title}</h1>{info && <div className="gm-flow-info">{info}</div>}<div className="gm-flow-choices">{children}</div></div><Actions back={back} next={next} label={nextLabel} onNext={onNext} /></aside><div className="gm-flow-stage">{media}</div></main></Frame>;
}
function Start() {
  const s = useMissionStore(); const { t } = useTranslation();
  const [showIntro, setShowIntro] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [nasa3DOpen, setNasa3DOpen] = useState(false);
  const [globalDataOpen, setGlobalDataOpen] = useState(false);
  return <>
    {showIntro && (
      <CinematicIntro
        onComplete={() => setShowIntro(false)}
        onExploreMissions={() => {
          setShowIntro(false);
          s.newRun("missions");
        }}
      />
    )}
    <Frame phase="menu"><main className="gm-home">
      <div className="gm-home-earth" style={{ backgroundImage: `url(/images/nasa-earth-blue-marble.svg)` }} aria-label="NASA Blue Marble Earth" />
      <div className="gm-home-orbit" aria-hidden="true"><span /></div>
      <div className="gm-home-copy">
        <p className="gm-kicker">NASA-INSPIRED SPACE MISSION SIMULATOR</p>
        <h1>MISSION<br /><em>FORGE</em></h1>
        <div className="gm-actions">
          <Button size="lg" onClick={() => s.newRun("missions")}><Rocket /> {t("ui.flow.start")} <ArrowRight /></Button>
          <Button variant="secondary" onClick={() => setShowIntro(true)}><Sparkles /> Cinematic Intro</Button>
          <Button variant="secondary" onClick={() => setGlobalDataOpen(true)}><Globe /> 18 Space Agencies</Button>
          <Button variant="secondary" onClick={() => setNasa3DOpen(true)}><Box /> NASA 3D Models</Button>
          <Button variant="secondary" onClick={() => setArchiveOpen(true)}><Layers /> NASA Presets</Button>
          <Button variant="secondary" onClick={() => s.set({ learn: "index" })}><BookOpen /> {t("ui.nav.learn")}</Button>
        </div>
      </div>
      {s.attempts > 0 && <div className="gm-home-readout"><small>{t("ui.home.current")}</small><b>{s.mission}</b><Button variant="ghost" onClick={() => s.go(s.phase === "menu" ? "missions" : s.phase)}>{t("ui.home.continue")} <ArrowRight /></Button></div>}
      <span className="gm-credit">EARTH TEXTURE: NASA VISIBLE EARTH · BLUE MARBLE</span>
    </main>
    <MissionArchiveModal isOpen={archiveOpen} onClose={() => setArchiveOpen(false)} />
    <Nasa3DLibraryModal isOpen={nasa3DOpen} onClose={() => setNasa3DOpen(false)} />
    <SpaceDataSourcesModal isOpen={globalDataOpen} onClose={() => setGlobalDataOpen(false)} />
    </Frame>
  </>;
}
function Planet() {
  const s = useMissionStore(); const { t } = useTranslation(); const [selected, setSelected] = useState<MissionId>(s.mission);
  return <Layout phase="missions" title={t("ui.flow.planet")} back="menu" next="brief" nextLabel={t("ui.flow.mission")} onNext={() => s.set({ mission: selected })} media={<div className="gm-world-portrait"><img src={images[selected]} alt={selected} /><span>NASA IMAGE AND VIDEO LIBRARY</span><h2>{selected}</h2></div>}>
    <div className="gm-world-list">{ids.map(id => <Button key={id} variant="ghost" className={`gm-choice ${selected === id ? "on" : ""}`} onClick={() => setSelected(id)}><img src={images[id]} alt="" /><span>{id}</span>{selected === id && <Check />}</Button>)}</div>
  </Layout>;
}
function Objective() {
  const s = useMissionStore(); const { t } = useTranslation(); const m = MISSIONS[s.mission], b = BODIES[m.body];
  return <Layout phase="brief" title={t("ui.flow.mission")} back="missions" next="route" nextLabel={t("ui.flow.routePick")} media={<div className="gm-world-portrait"><img src={images[s.mission]} alt={s.mission} /><span>NASA IMAGE AND VIDEO LIBRARY</span><h2>{s.mission}</h2></div>}>
    <div className="gm-objective-list">{(["surface", "orbit", "survey"] as const).map(id => <Button key={id} variant="ghost" className={`gm-choice ${s.objective === id ? "on" : ""}`} onClick={() => s.set({ objective: id })}><span>{t(`ui.flow.${id}`)}<small>{id === "surface" && b.atmosphere === "gas" ? t("ui.flow.survey") : m.brief}</small></span>{s.objective === id && <Check />}</Button>)}</div><p className="gm-source">{SOURCES.factsheet}</p>
  </Layout>;
}
function RoutePick() {
  const s = useMissionStore(); const { t } = useTranslation();
  return <Layout phase="route" title={t("ui.flow.routePick")} back="brief" next="routePreview" nextLabel={t("ui.flow.review")} info={MISSIONS[s.mission].title} media={<div className="gm-scene-caption"><Compass size={26} /><span>{t("ui.game.dragMap")}</span><small>Mission Forge Trajectory Visualization — Simplified flight arc (NASA/JPL approximate orbital elements)</small></div>}>
    {(Object.keys(ROUTES) as RouteId[]).map(id => <Button key={id} variant="ghost" className={`gm-choice ${s.route === id ? "on" : ""}`} onClick={() => s.set({ route: id })}><span>{ROUTES[id].name}<small>{Math.round(MISSIONS[s.mission].days * ROUTES[id].time)} d · {(MISSIONS[s.mission].dv * ROUTES[id].dv).toFixed(2)} km/s</small></span>{s.route === id && <Check />}</Button>)}
  </Layout>;
}
function RoutePreview() {
  const s = useMissionStore(); const { t } = useTranslation(); const a = analyze(designOf(s));
  return <Layout phase="routePreview" title={t("ui.flow.routePreview")} back="route" next="objectives" nextLabel={t("ui.flow.confirmRoute")} info={`${s.mission} · ${ROUTES[s.route].name}`} media={<div className="gm-scene-caption"><Compass size={26} /><span>{t("ui.game.dragMap")}</span><small>Mission Forge Trajectory Visualization — Simplified flight arc (Visual scale compressed)</small></div>}>
    <div className="gm-stat"><span>{t("ui.game.transit")}</span><b>{a.days} d</b></div><div className="gm-stat"><span>{t("ui.game.required")} Δv</span><b>{a.required.toFixed(2)} km/s</b></div><div className="gm-stat"><span>{t("ui.game.distance")}</span><b>{BODIES[s.mission].au} AU</b></div><LivePositions body={MISSIONS[s.mission].body} />
  </Layout>;
}
function ChoiceStep({ phase }: { phase: "objectives" | "budget" | "fuel" | "power" | "comms" | "instruments" }) {
  const s = useMissionStore(); const { t } = useTranslation(); const a = analyze(designOf(s));
  const chain: Phase[] = ["routePreview", "objectives", "budget", "fuel", "power", "comms", "instruments", "overview"];
  const pos = chain.indexOf(phase); const learn = () => s.set({ learn: phase === "power" || phase === "comms" ? "light" : phase === "objectives" ? "orbit" : "rocket" });
  const step = (label: string, value: number, min: number, max: number, change: (v: number) => void) => <div className="gm-step"><span>{label}</span><Button variant="secondary" size="icon" disabled={value <= min} aria-label={`Remove ${label}`} onClick={() => change(value - 1)}>−</Button><b>{value}</b><Button variant="secondary" size="icon" disabled={value >= max} aria-label={`Add ${label}`} onClick={() => change(value + 1)}>+</Button></div>;
  return <Layout phase={phase} title={t(`ui.flow.${phase}`)} back={chain[pos - 1] ?? "routePreview"} next={chain[pos + 1] ?? "overview"} media={<div className="gm-resource-display"><div className="gm-resource-orbit" /><p>{s.mission} / {ROUTES[s.route].name}</p><strong>{phase === "fuel" ? `${a.dv.toFixed(2)} km/s` : phase === "power" ? `${a.generation} kW` : phase === "comms" ? `${s.antennas} ×` : phase === "instruments" ? `${a.science}` : phase === "budget" ? `${fmt(a.wet)} kg` : `${a.days} d`}</strong><small>{phase === "fuel" ? `Δv / ${a.required.toFixed(2)} km/s required` : phase === "power" ? `${a.draw} kW demand` : phase === "budget" ? "SLS 95,000 kg orbit capacity" : t("ui.flow.gameEstimate")}</small></div>}>
    {phase === "objectives" && <>{step(t("ui.game.engineCount"), s.engines, 1, 3, v => s.set({ engines: v }))}<p className="gm-note">{t("ui.game.engine")} · {ENGINES[s.engine].name}</p></>}
    {phase === "budget" && <div className="gm-budget-list">{([1, 2, 3] as const).map(v => <Button variant="ghost" key={v} className={`gm-choice ${s.budget === v ? "on" : ""}`} onClick={() => s.set({ budget: v })}><span>{t(`ui.flow.${(["limited", "balanced", "expanded"] as const)[v - 1]}`)}<small>{v === 1 ? "Mass-first design" : v === 2 ? "Balanced mission resources" : "Maximum systems, more mass"}</small></span>{s.budget === v && <Check />}</Button>)}<p className="gm-note">{t("ui.flow.gameEstimate")}: budget tier affects your planning brief, not a real-world price.</p></div>}
    {phase === "fuel" && <>{step(t("ui.game.tanks"), s.tanks, 1, 4, v => s.set({ tanks: v }))}<label className="gm-range">{t("ui.game.fuelLoad")} <b>{s.fuel}%</b><input type="range" min="20" max="100" value={s.fuel} onChange={e => s.set({ fuel: +e.target.value })} /></label></>}
    {phase === "power" && <>{step(t("ui.game.solar"), s.wings, 0, 6, v => s.set({ wings: v }))}{step(t("ui.game.rtg"), s.rtgs, 0, 4, v => s.set({ rtgs: v }))}<Button variant={s.battery ? "default" : "secondary"} onClick={() => s.set({ battery: !s.battery })}>{t("ui.game.battery")} {s.battery && <Check />}</Button></>}
    {phase === "comms" && <>{step(t("ui.game.antennas"), s.antennas, 1, 2, v => s.set({ antennas: v }))}<Button variant={s.shield ? "default" : "secondary"} onClick={() => s.set({ shield: !s.shield })}>{t("ui.game.shield")} {s.shield && <Check />}</Button></>}
    {phase === "instruments" && (Object.keys(INSTRUMENTS) as Instrument[]).map(id => <Button key={id} variant="ghost" className={`gm-choice ${s.instruments.includes(id) ? "on" : ""}`} onClick={() => s.toggleInstrument(id)}><span>{INSTRUMENTS[id].name}<small>{INSTRUMENTS[id].mass} kg · {INSTRUMENTS[id].kw} kW</small></span>{s.instruments.includes(id) && <Check />}</Button>)}
    <Button variant="ghost" className="gm-learn-button" onClick={learn}><BookOpen /> {t("ui.flow.learn")}</Button><p className="gm-source">{SOURCES.orion} · {SOURCES.factsheet}</p>
  </Layout>;
}
function Overview() {
  const s = useMissionStore(); const { t } = useTranslation(); const a = analyze(designOf(s));
  return <Layout phase="overview" title={t("ui.flow.overview")} back="instruments" next="craft" nextLabel={t("ui.flow.craft")} media={<div className="gm-world-portrait"><img src={images[s.mission]} alt={s.mission} /><span>NASA IMAGE AND VIDEO LIBRARY</span><h2>{s.mission}</h2></div>}>
    <div className="gm-stat"><span>{t("ui.flow.mission")}</span><b>{t(`ui.flow.${s.objective}`)}</b></div><div className="gm-stat"><span>{t("ui.game.route")}</span><b>{ROUTES[s.route].name}</b></div><div className="gm-stat"><span>{t("ui.game.transit")}</span><b>{a.days} d</b></div><div className="gm-stat"><span>{t("ui.game.mass")}</span><b>{fmt(a.wet)} kg</b></div><div className="gm-stat"><span>{t("ui.game.power")}</span><b>{a.generation} / {a.draw} kW</b></div><div className="gm-stat"><span>{t("ui.game.installed")}</span><b>{s.instruments.length}</b></div>
  </Layout>;
}
const presets = {
  explorer: { engine: "chemical", engines: 1, tanks: 4, wings: 4, rtgs: 0, antennas: 1, shield: true, battery: false, instruments: ["camera"] },
  surveyor: { engine: "ion", engines: 1, tanks: 2, wings: 6, rtgs: 1, antennas: 2, shield: false, battery: true, instruments: ["camera", "spectrometer"] },
  guardian: { engine: "chemical", engines: 2, tanks: 4, wings: 4, rtgs: 2, antennas: 2, shield: true, battery: true, instruments: ["camera", "radiation"] },
} as const;
function Craft() {
  const s = useMissionStore(); const { t } = useTranslation();
  return <Layout phase="craft" title={t("ui.flow.craft")} back="overview" next="build" nextLabel={t("ui.flow.design")} media={<div className="gm-scene-caption"><Rocket size={27} /><span>{t("ui.game.dragCraft")}</span><small>ORION-INSPIRED · INTERACTIVE 3D SPACECRAFT</small></div>}>
    {(["explorer", "surveyor", "guardian"] as const).map(id => <Button key={id} variant="ghost" className={`gm-choice ${s.craft === id ? "on" : ""}`} onClick={() => s.set({ craft: id, ...presets[id], instruments: [...presets[id].instruments] })}><span>{t(`ui.flow.${id}`)}<small>{ENGINES[presets[id].engine].name} · {presets[id].wings} × {t("ui.game.solar")}</small></span>{s.craft === id && <Check />}</Button>)}<p className="gm-source">NASA-inspired configurations; {t("ui.flow.gameEstimate")}.</p>
  </Layout>;
}
const THRUST_KN: Record<EngineId, number> = { chemical: 110, ion: 0.00009, hall: 0.0006, aerospike: 160, nuclear: 333 };
type Category = "engine" | "fuel" | "power" | "comms" | "science";
function Hangar() {
  const s = useMissionStore(); const { t } = useTranslation(); const a = analyze(designOf(s)); const [tab, setTab] = useState<Category>("engine"); const categories: Category[] = ["engine", "fuel", "power", "comms", "science"];
  const [drawerItem, setDrawerItem] = useState<ComponentDetailType | null>(null);
  const [sciencePlannerOpen, setSciencePlannerOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [nasa3DOpen, setNasa3DOpen] = useState(false);
  const [globalDataOpen, setGlobalDataOpen] = useState(false);
  const recommendedAsset = getAssetForMission(s.mission);

  const step = (label: string, value: number, min: number, max: number, change: (v: number) => void) => <div className="gm-step"><span>{label}</span><Button variant="secondary" size="icon" disabled={value <= min} aria-label={`Remove ${label}`} onClick={() => change(value - 1)}>−</Button><b>{value}</b><Button variant="secondary" size="icon" disabled={value >= max} aria-label={`Add ${label}`} onClick={() => change(value + 1)}>+</Button></div>;

  return <Frame phase="build"><main className="gm-hangar">
    <div className="gm-hangar-head">
      <p className="gm-kicker">{t("ui.flow.build")}</p>
      <h1>{t("ui.game.assemble")}</h1>
      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
        <span>{s.mission} · {ENGINES[s.engine].name}</span>
        <Button
          variant={s.nasaModelView ? "default" : "secondary"}
          size="sm"
          onClick={() => s.set({ nasaModelView: s.nasaModelView ? null : (recommendedAsset?.id ?? "voyager-probe") })}
          title="Toggle between Modular Assembly Craft and Official NASA 3D Model"
          style={{ marginLeft: "8px", height: "26px", fontSize: "11px", padding: "0 8px" }}
        >
          <Box size={12} style={{ marginRight: "4px" }} />
          {s.nasaModelView ? "NASA 3D: Active" : "NASA 3D Model"}
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setArchiveOpen(true)} title="Load real NASA presets (Perseverance, Clipper, etc.)" style={{ height: "26px", fontSize: "11px", padding: "0 8px" }}><Sparkles size={12} style={{ marginRight: "4px" }} /> Real Presets</Button>
      </div>
    </div>
    
    <aside className="gm-hangar-categories">
      {categories.map(id => <Button key={id} variant="ghost" className={tab === id ? "on" : ""} onClick={() => setTab(id)}>{t(`ui.game.${id}`)} <ArrowRight /></Button>)}
      <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <Button variant="ghost" onClick={() => setSciencePlannerOpen(true)} style={{ width: "100%", justifyContent: "flex-start", fontSize: "12px", color: "var(--primary)" }}><Sparkles size={14} style={{ marginRight: "6px" }} /> Science Planner</Button>
        <Button variant="ghost" onClick={() => setNasa3DOpen(true)} style={{ width: "100%", justifyContent: "flex-start", fontSize: "12px", color: "#38bdf8", marginTop: "4px" }}><Box size={14} style={{ marginRight: "6px" }} /> NASA 3D Library</Button>
        <Button variant="ghost" onClick={() => setGlobalDataOpen(true)} style={{ width: "100%", justifyContent: "flex-start", fontSize: "12px", color: "#34d399", marginTop: "4px" }}><Globe size={14} style={{ marginRight: "6px" }} /> 18 Space Agencies</Button>
      </div>
    </aside>

    <div className="gm-craft-view" style={{ position: "relative" }}>
      <span className="gm-craft-tag">{s.nasaModelView ? "OFFICIAL NASA 3D MODEL · THREE.JS GLB" : "ORION-INSPIRED · INTERACTIVE 3D MODEL"}</span>
      <span className="gm-craft-hint">{t("ui.game.dragCraft")}</span>

      {/* Subtle UI Source Badge for NASA 3D Resources */}
      <div style={{ position: "absolute", bottom: "16px", left: "16px", zIndex: 12 }}>
        <Nasa3DBadge assetId={s.nasaModelView ?? recommendedAsset?.id} />
      </div>

      {/* 3D Spacecraft Engineering Callout Badges */}
      <div style={{ position: "absolute", top: "14%", left: "10%", zIndex: 10 }}>
        <button
          onClick={() => setDrawerItem({ kind: "comms" })}
          title="Inspect Avionics & Deep Space Communications"
          style={{ background: "rgba(7, 18, 38, 0.85)", border: "1px solid rgba(0, 240, 255, 0.4)", borderRadius: "6px", padding: "4px 8px", color: "#e2f1ff", fontSize: "11px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", backdropFilter: "blur(4px)", boxShadow: "0 0 12px rgba(0, 240, 255, 0.2)" }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00f0ff" }} />
          <span><strong>COMMS:</strong> {s.antennas}× HGA (X/Ka)</span>
        </button>
      </div>

      <div style={{ position: "absolute", top: "36%", right: "8%", zIndex: 10 }}>
        <button
          onClick={() => setDrawerItem({ kind: "shield" })}
          title="Inspect Payload Bay & Whipple Shield"
          style={{ background: "rgba(7, 18, 38, 0.85)", border: "1px solid rgba(0, 240, 255, 0.4)", borderRadius: "6px", padding: "4px 8px", color: "#e2f1ff", fontSize: "11px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", backdropFilter: "blur(4px)", boxShadow: "0 0 12px rgba(0, 240, 255, 0.2)" }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.shield ? "#00f0ff" : "#f59e0b" }} />
          <span><strong>SHIELD:</strong> {s.shield ? "Whipple Active" : "Unshielded"}</span>
        </button>
      </div>

      <div style={{ position: "absolute", bottom: "32%", left: "8%", zIndex: 10 }}>
        <button
          onClick={() => setDrawerItem({ kind: "power", item: "solar" })}
          title="Inspect Solar Wings & Power Subsystems"
          style={{ background: "rgba(7, 18, 38, 0.85)", border: "1px solid rgba(0, 240, 255, 0.4)", borderRadius: "6px", padding: "4px 8px", color: "#e2f1ff", fontSize: "11px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", backdropFilter: "blur(4px)", boxShadow: "0 0 12px rgba(0, 240, 255, 0.2)" }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00f0ff" }} />
          <span><strong>POWER:</strong> {a.generation} kW ({s.wings}W / {s.rtgs}R)</span>
        </button>
      </div>

      <div style={{ position: "absolute", bottom: "16%", right: "10%", zIndex: 10 }}>
        <button
          onClick={() => setDrawerItem({ kind: "engine", id: s.engine })}
          title="Inspect Engine & Propulsion Specs"
          style={{ background: "rgba(7, 18, 38, 0.85)", border: "1px solid rgba(0, 240, 255, 0.4)", borderRadius: "6px", padding: "4px 8px", color: "#e2f1ff", fontSize: "11px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", backdropFilter: "blur(4px)", boxShadow: "0 0 12px rgba(0, 240, 255, 0.2)" }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00f0ff" }} />
          <span><strong>ENGINE:</strong> {ENGINES[s.engine].name}</span>
        </button>
      </div>
    </div>

    <aside className="gm-hangar-controls">
      <h2>{t(`ui.game.${tab}`)}</h2>
      <div className="gm-control-scroll">
        {tab === "engine" && <>
          {(Object.keys(ENGINES) as EngineId[]).map(id => (
            <div key={id} style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              <Button variant="ghost" className={`gm-part ${s.engine === id ? "on" : ""}`} style={{ flex: 1 }} onClick={() => s.set({ engine: id })}>
                <span><b>{ENGINES[id].name}</b><small>{ENGINES[id].isp} s Isp · {ENGINES[id].thrust}</small></span>
                {s.engine === id && <Check />}
              </Button>
              <Button variant="secondary" size="icon" title="View technical specs & real physics" style={{ height: "40px", width: "36px", flexShrink: 0 }} onClick={() => setDrawerItem({ kind: "engine", id })}>
                <HelpCircle size={15} />
              </Button>
            </div>
          ))}
          {step(t("ui.game.engineCount"), s.engines, 1, 3, v => s.set({ engines: v }))}
        </>}
        {tab === "fuel" && <>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <div style={{ flex: 1 }}>{step(t("ui.game.tanks"), s.tanks, 1, 4, v => s.set({ tanks: v }))}</div>
            <Button variant="secondary" size="icon" title="View propellant physics" style={{ height: "36px", width: "36px", flexShrink: 0 }} onClick={() => setDrawerItem({ kind: "tank" })}><HelpCircle size={15} /></Button>
          </div>
          <label className="gm-range">{t("ui.game.fuelLoad")} <b>{s.fuel}%</b><input type="range" min="20" max="100" value={s.fuel} onChange={e => s.set({ fuel: +e.target.value })}/></label>
        </>}
        {tab === "power" && <>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <div style={{ flex: 1 }}>{step(t("ui.game.solar"), s.wings, 0, 6, v => s.set({ wings: v }))}</div>
            <Button variant="secondary" size="icon" title="Solar Array physics" style={{ height: "36px", width: "36px", flexShrink: 0 }} onClick={() => setDrawerItem({ kind: "power", item: "solar" })}><HelpCircle size={15} /></Button>
          </div>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <div style={{ flex: 1 }}>{step(t("ui.game.rtg"), s.rtgs, 0, 4, v => s.set({ rtgs: v }))}</div>
            <Button variant="secondary" size="icon" title="MMRTG Nuclear power physics" style={{ height: "36px", width: "36px", flexShrink: 0 }} onClick={() => setDrawerItem({ kind: "power", item: "rtg" })}><HelpCircle size={15} /></Button>
          </div>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <Button variant={s.battery ? "default" : "secondary"} style={{ flex: 1 }} onClick={() => s.set({ battery: !s.battery })}>{t("ui.game.battery")} {s.battery && <Check />}</Button>
            <Button variant="secondary" size="icon" title="Battery storage specs" style={{ height: "36px", width: "36px", flexShrink: 0 }} onClick={() => setDrawerItem({ kind: "power", item: "battery" })}><HelpCircle size={15} /></Button>
          </div>
        </>}
        {tab === "comms" && <>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <div style={{ flex: 1 }}>{step(t("ui.game.antennas"), s.antennas, 1, 2, v => s.set({ antennas: v }))}</div>
            <Button variant="secondary" size="icon" title="Comms and DSN specs" style={{ height: "36px", width: "36px", flexShrink: 0 }} onClick={() => setDrawerItem({ kind: "comms" })}><HelpCircle size={15} /></Button>
          </div>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <Button variant={s.shield ? "default" : "secondary"} style={{ flex: 1 }} onClick={() => s.set({ shield: !s.shield })}>{t("ui.game.shield")} {s.shield && <Check />}</Button>
            <Button variant="secondary" size="icon" title="Whipple bumper shielding physics" style={{ height: "36px", width: "36px", flexShrink: 0 }} onClick={() => setDrawerItem({ kind: "shield" })}><HelpCircle size={15} /></Button>
          </div>
        </>}
        {tab === "science" && <>
          <Button variant="secondary" style={{ width: "100%", marginBottom: "8px", background: "rgba(0, 240, 255, 0.12)", borderColor: "rgba(0, 240, 255, 0.4)", color: "#00f0ff" }} onClick={() => setSciencePlannerOpen(true)}>
            <Sparkles size={14} style={{ marginRight: "6px" }} /> Open Science Mission Planner
          </Button>
          {(Object.keys(INSTRUMENTS) as Instrument[]).map(id => (
            <div key={id} style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              <Button variant="ghost" className={`gm-part ${s.instruments.includes(id) ? "on" : ""}`} style={{ flex: 1 }} onClick={() => s.toggleInstrument(id)}>
                <span><b>{INSTRUMENTS[id].name}</b><small>{INSTRUMENTS[id].mass} kg · {INSTRUMENTS[id].kw} kW</small></span>
                {s.instruments.includes(id) && <Check />}
              </Button>
              <Button variant="secondary" size="icon" title="View flight heritage & instrument details" style={{ height: "40px", width: "36px", flexShrink: 0 }} onClick={() => setDrawerItem({ kind: "instrument", id })}>
                <HelpCircle size={15} />
              </Button>
            </div>
          ))}
        </>}
        <div style={{ marginTop: "12px" }}>
          <DvPanel />
        </div>
        <p className="gm-source">{SOURCES.orion} · {SOURCES.rl10} · {SOURCES.nstar}</p>
      </div>
    </aside>

    <footer className="gm-hangar-bottom">
      <Button variant="ghost" onClick={() => s.go("craft")}><ArrowLeft /> {t("ui.flow.back")}</Button>
      <div className="gm-performance" style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
        <span>Dry / Wet<b>{fmt(a.dry)} / {fmt(a.wet)} kg</b></span>
        <span>Propellant<b>{fmt(a.propellant)} kg ({s.fuel}%)</b></span>
        <span>Δv <b>{a.dv.toFixed(2)} / {a.required.toFixed(2)} km/s</b> <small style={{ color: a.dvMargin >= 0.1 ? "#10b981" : a.dvMargin >= 0 ? "#f59e0b" : "#ef4444" }}>({Math.round(a.dvMargin * 100)}%)</small></span>
        <span>Thrust / TWR<b>{ENGINES[s.engine].thrust} · {(THRUST_KN[s.engine] * s.engines / (Math.max(1, a.wet) * 0.00980665)).toFixed(2)}</b></span>
        <span>Power<b>{a.generation} / {a.draw} kW</b></span>
        <span>Solar Flux<b>{Math.round(1361 / Math.max(0.1, (BODIES[MISSIONS[s.mission].body].au ** 2)))} W/m²</b></span>
        <span>Readiness<b>{Math.max(1, a.readiness)} / 100</b></span>
      </div>
      <Button onClick={() => s.go("check")}>{t("ui.game.toCheck")} <ArrowRight /></Button>
    </footer>

    <ComponentDetailDrawer item={drawerItem} onClose={() => setDrawerItem(null)} />
    <SciencePlannerModal isOpen={sciencePlannerOpen} onClose={() => setSciencePlannerOpen(false)} />
    <MissionArchiveModal isOpen={archiveOpen} onClose={() => setArchiveOpen(false)} />
    <Nasa3DLibraryModal isOpen={nasa3DOpen} onClose={() => setNasa3DOpen(false)} />
    <SpaceDataSourcesModal isOpen={globalDataOpen} onClose={() => setGlobalDataOpen(false)} />
  </main></Frame>;
}
export function GameScreens({ phase }: { phase: Phase }) {
  switch (phase) {
    case "menu": return <Start />;
    case "missions": return <Planet />;
    case "brief": return <Objective />;
    case "route": return <RoutePick />;
    case "routePreview": return <RoutePreview />;
    case "objectives": case "budget": case "fuel": case "power": case "comms": case "instruments": return <ChoiceStep phase={phase} />;
    case "overview": return <Overview />;
    case "craft": return <Craft />;
    case "build": return <Hangar />;
    default: return null;
  }
}
