from pathlib import Path

p = Path('src/components/game/GameScreens.tsx')
s = p.read_text(encoding='utf-8')
start = s.index('import earth from')
end = s.index('const ids:', start)
s = s[:start] + 'import { SceneControls } from "./Presentation";\n\n' + s[end:]
s = s.replace('<span className="gm-signal"><i /> NASA / JPL</span>', '<span className="gm-signal">{t("exp.simulation")}</span>')
s = s.replace('function Layout({', 'function Layout({', 1)
s = s.replace('  return <Frame phase={phase}><main', '  const { t } = useTranslation();\n  return <Frame phase={phase}><main', 1)
s = s.replace('eyebrow ?? "MISSION FORGE / FLIGHT PLAN"', 'eyebrow ?? t("exp.flightPlan")')
start = s.index('function Start()')
end = s.index('function Objective()', start)
s = s[:start] + '''function Start() {
  const s = useMissionStore(); const { t } = useTranslation();
  return <Frame phase="menu"><main className="gm-home"><div className="gm-home-copy">
    <p className="gm-kicker">{t("exp.eyebrow")}</p><h1>{t("exp.title").split("\\n").map((line, i) => <span key={line}>{i > 0 && <br />}{line}</span>)}</h1>
    <p className="mf-home-intro">{t("exp.intro")}</p>
    <div className="gm-actions"><Button size="lg" onClick={() => s.newRun("missions")}><Rocket />{t("ui.flow.start")}<ArrowRight /></Button><Button variant="secondary" onClick={() => s.set({ learn: "index" })}><BookOpen />{t("ui.nav.learn")}</Button></div>
    {s.attempts > 0 && <Button className="mf-resume" variant="ghost" onClick={() => s.go("build")}>{t("ui.home.continue")}<ArrowRight /></Button>}
  </div><div className="mf-home-coordinate"><span>{t("exp.destination")}</span><strong>{t("ui.home.title2")}</strong><small>{t("ui.home.tagline")}</small></div>
  <footer className="mf-home-footer"><span>{t("exp.earthCredit")}</span><span>{t("exp.independent")}</span></footer></main></Frame>;
}
function DestinationCaption({ mission }: { mission: MissionId }) {
  const { t } = useTranslation(); const body = BODIES[mission];
  return <div className="mf-destination-caption"><p className="gm-kicker">{t("exp.destination")}</p><h2>{t(`exp.destinations.${mission}.name`)}</h2><p>{t(`exp.destinations.${mission}.detail`)}</p><div className="gm-facts"><span>{t("ui.game.gravity")}<b>{body.gravity} m/s²</b></span><span>{t("ui.game.distance")}<b>{body.au} AU</b></span></div><small>{t(mission === "Ceres" ? "exp.proceduralCredit" : "exp.modelCredit")}</small></div>;
}
function Planet() {
  const s = useMissionStore(); const { t } = useTranslation();
  return <Layout phase="missions" title={t("ui.flow.planet")} info={t("ui.game.chooseHint")} back="menu" next="brief" nextLabel={t("ui.flow.mission")} media={<DestinationCaption mission={s.mission} />}>
    <div className="gm-world-list">{ids.map((id, i) => <Button key={id} variant="ghost" aria-pressed={s.mission === id} className={`gm-choice ${s.mission === id ? "on" : ""}`} onClick={() => s.set({ mission: id })}><span className="mf-world-index">{String(i + 1).padStart(2, "0")}</span><span>{t(`exp.destinations.${id}.name`)}{id === "Mars" && <em className="mf-recommended">{t("exp.recommended")}</em>}<small>{t(`exp.destinations.${id}.note`)}</small></span>{s.mission === id && <Check />}</Button>)}</div>
  </Layout>;
}
''' + s[end:]
import re
s = re.sub(r'<div className="gm-world-portrait"><img src=\{images\[s.mission\]\} alt=\{s.mission\} /><span>NASA IMAGE AND VIDEO LIBRARY</span><h2>\{s.mission\}</h2></div>', '<DestinationCaption mission={s.mission} />', s)
s = s.replace('const m = MISSIONS[s.mission], b = BODIES[m.body];', 'const b = BODIES[s.mission];')
s = s.replace('id === "surface" && b.atmosphere === "gas" ? t("ui.flow.survey") : m.brief', 't(id === "surface" && b.atmosphere === "gas" ? "exp.gasHint" : `exp.${id}Hint`)')
s = s.replace('info={MISSIONS[s.mission].title}', 'info={t(`exp.destinations.${s.mission}.note`)}')
s = s.replace('NASA/JPL · {t("ui.flow.gameEstimate")}: compressed visual scale', '{t("exp.mapNote")}')
s = s.replace('NASA/JPL APPROXIMATE ORBITAL ELEMENTS · VISUAL DISTANCE COMPRESSED', '{t("exp.mapNote")}')
s = s.replace('{ROUTES[id].name}<small>', '{t(`exp.route_${id}`)}<small>{t(`exp.routeNote_${id}`)}</small><small>')
s = s.replace('ROUTES[s.route].name', 't(`exp.route_${s.route}`)')
s = s.replace('ORION-INSPIRED · INTERACTIVE 3D SPACECRAFT', '{t("exp.craftNote")}')
s = s.replace('ORION-INSPIRED · INTERACTIVE 3D MODEL', '{t(s.referenceModel ? "exp.referenceNote" : "exp.playerCraft")}')
s = s.replace('aria-label={`Remove ${label}`}', 'aria-label={t("exp.remove", { label })}').replace('aria-label={`Add ${label}`}', 'aria-label={t("exp.add", { label })}')
s = s.replace('NASA-inspired configurations; {t("ui.flow.gameEstimate")}.', '{t("exp.presetNote")}')
s = s.replace('  const s = useMissionStore(); const { t } = useTranslation();\n  return <Layout phase="craft"', '  const s = useMissionStore(); const { t } = useTranslation(); const [preset, setPreset] = useState<string | null>(null);\n  return <Layout phase="craft"')
s = s.replace('{(["explorer", "surveyor", "guardian"] as const).map', '<p className="gm-note">{t("exp.presetNote")}</p>{(["explorer", "surveyor", "guardian"] as const).map')
s = s.replace('s.craft === id', 'preset === id')
s = s.replace('onClick={() => s.set({ craft: id, ...presets[id], instruments: [...presets[id].instruments] })}', 'onClick={() => setPreset(id)}')
s = s.replace('nextLabel={t("ui.flow.design")} media=', 'nextLabel={preset ? t("ui.flow.design") : t("exp.keepDesign")} onNext={() => { if (preset) { const id = preset as keyof typeof presets; s.set({ craft: id, ...presets[id], instruments: [...presets[id].instruments] }); } }} media=')
s = s.replace('<span className="gm-craft-hint">{t("ui.game.dragCraft")}</span>', '<div className="mf-craft-tools"><span>{t("ui.game.dragCraft")}</span><SceneControls />{s.mission === "Mars" && <Button variant="secondary" onClick={() => s.set({ referenceModel: !s.referenceModel })}>{t(s.referenceModel ? "exp.backToCraft" : "exp.reference")}</Button>}</div>')
s = s.replace('<div className="gm-control-scroll">', '<div className="gm-control-scroll" inert={s.referenceModel}>')
s = s.replace('<span>Δv <b>', '<span className={a.dvMargin < 0 ? "is-danger" : a.dvMargin < 0.1 ? "is-warning" : "is-go"}>Δv <b>')
s = s.replace('<span>{t("ui.game.power")}<b>{a.generation}', '<span className={a.powerMargin < 0 ? "is-danger" : "is-go"}>{t("ui.game.power")}<b>{a.generation}')
s = s.replace('v === 1 ? "Mass-first design" : v === 2 ? "Balanced mission resources" : "Maximum systems, more mass"', 't(`exp.budget_${v}`)')
s = s.replace('{t("ui.flow.gameEstimate")}: budget tier affects your planning brief, not a real-world price.', '{t("exp.budgetNote")}')
s = s.replace('<div className="gm-resource-orbit" />', '')
s = s.replace('<small>{phase === "fuel" ? `Δv / ${a.required.toFixed(2)} km/s required` : phase === "power" ? `${a.draw} kW demand` : phase === "budget" ? "SLS 95,000 kg orbit capacity" : t("ui.flow.gameEstimate")}</small>', '<small>{t("ui.flow.gameEstimate")} · {t("exp.resourceNote")}</small>')
# Selection state is available to keyboard/screen-reader users, as well as visually.
s = s.replace('className={`gm-choice ${s.route === id', 'aria-pressed={s.route === id} className={`gm-choice ${s.route === id')
s = s.replace('className={`gm-choice ${s.objective === id', 'aria-pressed={s.objective === id} className={`gm-choice ${s.objective === id')
s = s.replace('className={`gm-part ${s.engine === id', 'aria-pressed={s.engine === id} className={`gm-part ${s.engine === id')
s = s.replace('className={`gm-choice ${preset === id', 'aria-pressed={preset === id} className={`gm-choice ${preset === id')
p.write_text(s, encoding='utf-8')

p = Path('src/components/game/Hud.tsx'); s = p.read_text(encoding='utf-8')
s = 'import { useTranslation } from "react-i18next";\nimport { ReadinessPanel, MissionReport } from "./MissionPanels";\n' + s
s = s.replace('check: <CheckS />', 'check: <ReadinessPanel />').replace('report: <Report />', 'report: <MissionReport />')
s = s.replace('const phase = useMissionStore((s) => s.phase), go', 'const { t } = useTranslation();\n  const phase = useMissionStore((s) => s.phase), go')
s = s.replace('{PHASE_TITLE[phase]}', '{t(`exp.${phase === "launch" ? "launchPhase" : phase}`)}')
s = s.replace('className="pointer-events-none absolute inset-0 z-10 text-foreground"', 'className="mf-operational pointer-events-none absolute inset-0 z-10 text-foreground"')
s = s.replace('`absolute inset-x-2 bottom-2 max-h-[58%]', '`mf-operation-sheet absolute inset-x-2 bottom-2 max-h-[58%]')
s = s.replace('function Telemetry() {\n  const t = useTelemetry();', 'function Telemetry() {\n  const { t: tr } = useTranslation();\n  const t = useTelemetry();')
for a,b in [('Velocity','velocity'),('From Earth','distance'),('Mission day','missionDay'),('Δv left','dvLeft'),('Temp (eq.)','temperature'),('Comms delay','delay')]:
    s = s.replace('["'+a+'",', '[tr("exp.'+b+'"),')
s = s.replace('[[tr("exp.velocity")', '[[tr("exp.velocity")')
s = s.replace('["Fuel", `${t.fuelPct', '[tr("ui.game.fuel"), `${t.fuelPct').replace('["Power", `${t.kw', '[tr("ui.game.power"), `${t.kw')
s = s.replace('className="mf-panel pointer-events-auto grid grid-cols-4', 'className="mf-telemetry mf-panel pointer-events-auto grid grid-cols-4')
s = s.replace('function Flight() {\n  useTick', 'function Flight() {\n  const { t } = useTranslation();\n  useTick')
s = s.replace('<div className="pointer-events-none absolute left-3 top-16 hidden sm:block"><ScanCard /></div>', '<div className="mf-flight-heading"><p className="gm-kicker">{t("exp.telemetryNote")}</p><h1>{s.mission}</h1><p>{t("exp.progress")} · {Math.round(rt.progress * 100)}%</p><progress value={rt.progress} max={1} aria-label={t("exp.progress")} /></div>')
s = s.replace('<div className="sm:hidden"><ScanCard /></div>', '')
s = s.replace('absolute inset-x-2 bottom-2 flex flex-col', 'mf-flight-bottom absolute inset-x-2 bottom-2 flex flex-col')
s = s.replace('>Mission control</Btn>', '>{t("ui.flow.control")}</Btn>').replace('>Cockpit</Btn>', '>{t("ui.flow.cockpit")}</Btn>').replace('>Burn</Btn>', '>{t("exp.burn")}</Btn>')
s = s.replace('{[1, 5, 20].map', '<Btn tone="ghost" onClick={() => { rt.warp = warp === 0 ? 1 : 0; setWarp(rt.warp); }}>{t(warp === 0 ? "exp.resume" : "exp.pause")}</Btn>{[1, 5, 20].map')
s = s.replace('function Landing() {\n', 'function Landing() {\n  const { t } = useTranslation();\n')
s = s.replace('useState("Put the stages in the right order.")', 'useState("exp.stageHint")')
s = s.replace('{msg}</p>', '{t(msg)}</p>')
s = s.replace('disabled={done} onClick', 'disabled={done || i < s.landing} onClick')
s = s.replace('setMsg(i === stages.length - 1 ? "Landing complete." : `${stages[i]} complete.`)', 'setMsg(i === stages.length - 1 ? "exp.stageDone" : "exp.stageHint")')
s = s.replace('setMsg(`${stages[i]} now would be dangerous. Think about the physics.`)', 'setMsg("exp.stageWrong")')
s = s.replace('k="Altitude" v={`${Math.max(0, 100 - (s.landing / stages.length) * 100).toFixed(0)}%`}', 'k={t("exp.descent")} v={`${Math.round(s.landing / stages.length * 100)}%`}')
p.write_text(s, encoding='utf-8')
