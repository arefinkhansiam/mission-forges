import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Check, AlertTriangle, RefreshCcw, Rocket, Building2, Award, GraduationCap, Download } from "lucide-react";
import { analyze, finalScore, fmt, LAUNCH_LIMIT } from "../../lib/mission-sim";
import { designOf, useMissionStore } from "../../stores/mission-store";
import { GoPoll } from "./GoPoll";
import { rt } from "./runtime";
import { Button } from "../ui/button";
import { CurriculumModal } from "./CurriculumModal";
import { sfx } from "../../lib/audio";

export function ReadinessPanel() {
  const s = useMissionStore(), a = analyze(designOf(s));
  const { t } = useTranslation();
  const [ready, setReady] = useState(false);
  const fixes = [
    { show: a.wet > LAUNCH_LIMIT, label: "fixMass", phase: "build" as const },
    { show: a.dvMargin < 0.1, label: "fixFuel", phase: "fuel" as const },
    { show: a.powerMargin < 0.15, label: "fixPower", phase: "power" as const },
    { show: s.antennas < 2, label: "fixComms", phase: "comms" as const },
    { show: a.hazard > 0.3 && !s.shield, label: "fixShield", phase: "comms" as const },
    { show: a.science === 0, label: "fixScience", phase: "instruments" as const },
  ].filter(f => f.show);
  return <aside className="mf-operation-panel mf-readiness">
    <p className="gm-kicker">{t("exp.preflight")}</p>
    <h1>{t("exp.checkTitle")}</h1>
    <div className={`mf-verdict ${a.canLaunch ? "is-go" : "is-warning"}`}>
      {a.canLaunch ? <Check /> : <AlertTriangle />}<div><strong>{t(a.canLaunch ? "exp.ready" : "exp.atRisk")}</strong><p>{t("ui.game.readiness")} {a.readiness} / 100 · {t("ui.flow.gameEstimate")}</p></div>
    </div>
    <div className="mf-metric-pair"><span>{t("ui.game.mass")}<b>{fmt(a.wet)} kg</b></span><span>{t("exp.reserve")}<b>{(a.dv - a.required).toFixed(2)} km/s</b></span></div>
    {fixes.length > 0 && <section className="mf-fixes"><h2>{t("exp.improve")}</h2>{fixes.map(f => <button key={f.label} onClick={() => s.go(f.phase)}><span>{t(`exp.${f.label}`)}</span><ArrowRight size={16} /></button>)}</section>}
    <GoPoll onReady={setReady} />
    <footer className="mf-panel-actions"><Button variant="secondary" onClick={() => s.go("build")}><ArrowLeft />{t("ui.game.hangar")}</Button><Button disabled={!ready} onClick={() => { rt.launchT = 0; s.go("launch"); }}><Rocket />{t(a.canLaunch ? "exp.launch" : "ui.flow.launchRisk")}</Button></footer>
  </aside>;
}

export function MissionReport() {
  const s = useMissionStore(), d = designOf(s), a = analyze(d), sc = finalScore(d, s.outcome, s.rescued, s.landingErrors);
  const { t } = useTranslation();
  const [academyOpen, setAcademyOpen] = useState(false);
  const result = s.outcome?.failed ? (s.rescued ? "recovered" : "lost") : "success";

  // Document 16 Assessment Badges
  const badges = [
    {
      id: "rocket-master",
      name: "Rocket Equation Master",
      icon: "🚀",
      unlocked: a.dvMargin >= 0.05 && !s.outcome?.causes.includes("fuel"),
      desc: "Delivered sufficient delta-v reserve following Tsiolkovsky's law.",
    },
    {
      id: "space-weather",
      name: "Space Weather Watcher",
      icon: "☀️",
      unlocked: !s.outcome?.causes.includes("power") && a.powerMargin >= 0,
      desc: "Balanced solar inverse-square flux and electrical requirements.",
    },
    {
      id: "science-pioneer",
      name: "Science Pioneer",
      icon: "🔬",
      unlocked: sc.science >= 30,
      desc: "Collected high-value multispectral and planetary surface data.",
    },
    {
      id: "precision-edl",
      name: "Precision EDL Aviator",
      icon: "🎯",
      unlocked: s.landingErrors === 0,
      desc: "Flawless atmospheric entry and terminal descent touchdown.",
    },
  ];

  const handleExportPNG = () => {
    sfx.click();
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 630);
    grad.addColorStop(0, "#070b14");
    grad.addColorStop(0.5, "#0b1220");
    grad.addColorStop(1, "#111c2e");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 630);

    // Starfield
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 150; i++) {
      const x = (i * 37) % 1200;
      const y = (i * 73) % 630;
      const r = (i % 3) * 0.7 + 0.6;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer cyan frame
    ctx.strokeStyle = "rgba(53, 185, 255, 0.4)";
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, 1140, 570);

    // Kicker
    ctx.font = "bold 16px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#35b9ff";
    ctx.fillText("NASA SPACE APPS CHALLENGE 2026 · CHALLENGE 13 · TEAM GHOST HUNTER", 60, 85);

    // Title
    ctx.font = "bold 44px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#f3f7ff";
    ctx.fillText(`FLIGHT CERTIFICATE: ${s.mission.toUpperCase()} OPERATIONS`, 60, 140);

    // Subtitle
    ctx.font = "20px 'Inter', sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`Status: ${result.toUpperCase()} · Transit Time: ${a.days} Days · Trajectory Score: ${sc.total} / 100`, 60, 180);

    // Telemetry box
    ctx.fillStyle = "rgba(17, 28, 46, 0.85)";
    ctx.strokeStyle = "rgba(53, 185, 255, 0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(60, 220, 520, 220, 16);
    ctx.fill();
    ctx.stroke();

    ctx.font = "bold 18px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#35b9ff";
    ctx.fillText("TELEMETRY & FLIGHT EFFICIENCY", 85, 260);

    ctx.font = "16px 'Inter', sans-serif";
    ctx.fillStyle = "#f3f7ff";
    ctx.fillText(`• Total Delta-V (Δv): ${a.dv.toFixed(2)} km/s (Req: ${a.required.toFixed(2)} km/s)`, 85, 300);
    ctx.fillText(`• Reserve Margin: ${(a.dvMargin * 100).toFixed(1)}% (Tsiolkovsky Equation)`, 85, 335);
    ctx.fillText(`• Power Balance: ${a.generation.toFixed(1)} kW gen / ${a.draw.toFixed(1)} kW draw`, 85, 370);
    ctx.fillText(`• Spacecraft Mass: ${fmt(a.wet)} kg (SLS limit: 95,000 kg)`, 85, 405);

    // Badges box
    ctx.fillStyle = "rgba(17, 28, 46, 0.85)";
    ctx.beginPath();
    ctx.roundRect(620, 220, 520, 220, 16);
    ctx.fill();
    ctx.stroke();

    ctx.font = "bold 18px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#fbbf24";
    ctx.fillText("STEM ACADEMY BADGES UNLOCKED", 645, 260);

    const unlockedBadges = badges.filter((b) => b.unlocked);
    unlockedBadges.slice(0, 4).forEach((b, idx) => {
      ctx.font = "16px 'Inter', sans-serif";
      ctx.fillStyle = "#34d399";
      ctx.fillText(`${b.icon} ${b.name}`, 645, 305 + idx * 35);
    });

    // Footer signature & verification
    ctx.font = "14px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#64748b";
    ctx.fillText("VERIFIED ZERO-FABRICATED NASA JPL/NOAA EPHEMERIDES · MISSION FORGE", 60, 560);
    ctx.fillText("https://mission-forges.vercel.app", 870, 560);

    // Trigger download
    const link = document.createElement("a");
    link.download = `mission-forge-${s.mission.toLowerCase()}-certificate.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    s.say("Flight certificate exported to PNG!", "ok");
  };

  return (
    <div className="mf-report-layout">
      <section className="mf-report-hero">
        <p className="gm-kicker">{t("exp.debrief")}</p>
        <h1>{t(`exp.${result}`)}</h1>
        <p>{t(`exp.destinations.${s.mission}.name`)} · {a.days} {t("exp.days")}</p>
        <div className="mf-score">
          <strong>{sc.total}</strong>
          <span>/ 100<br />{t("ui.flow.gameEstimate")}</span>
        </div>
      </section>

      <aside className="mf-operation-panel mf-report-panel">
        <p className="gm-kicker">{t("exp.report")}</p>
        <h2>{t("exp.choicesMatter")}</h2>
        
        <div className="mf-report-scores">
          {(["objective", "science", "safety", "resources", "landing"] as const).map(key => (
            <div key={key}>
              <span>{t(`exp.score_${key}`)}</span>
              <b>{sc[key]}</b>
              <meter min={0} max={100} value={sc[key]} aria-label={t(`exp.score_${key}`)} />
            </div>
          ))}
        </div>

        {/* Learning System Badges (Document 16) */}
        <div className="my-3 p-3 rounded-xl border border-cyan-500/30 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400">
            <span className="flex items-center gap-1.5">
              <Award size={14} className="text-amber-400" />
              <span>LEARNING BADGES EARNED</span>
            </span>
            <button
              onClick={() => setAcademyOpen(true)}
              className="text-cyan-300 hover:text-white flex items-center gap-1 underline text-[11px] cursor-pointer"
            >
              <GraduationCap size={13} />
              <span>Review Academy</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-2 rounded-lg border text-left text-xs transition ${
                  b.unlocked
                    ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-200"
                    : "border-white/5 bg-black/30 text-slate-500 opacity-60"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <span>{b.icon}</span>
                  <span className="truncate">{b.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mf-lessons">
          <article><span>01</span><div><h3>{t("exp.reserve")}: {(a.dv - a.required).toFixed(2)} km/s</h3><p>{t(a.dvMargin < 0.1 ? "exp.lessonFuelLow" : "exp.lessonFuelGood")}</p></div></article>
          <article><span>02</span><div><h3>{t("exp.decision")}: {s.outcome ? t(`exp.choice_${s.outcome.choice}`) : t("exp.noEncounter")}</h3><p>{t(s.outcome?.failed ? "exp.lessonHazardBad" : "exp.lessonHazardGood")}</p></div></article>
          <article><span>03</span><div><h3>{t("exp.sequenceErrors", { count: s.landingErrors })}</h3><p>{t(s.landingErrors ? "exp.lessonLandingBad" : "exp.lessonLandingGood")}</p></div></article>
        </div>

        {s.lunarSurveyCompleted && (
          <div className="rounded-xl border border-primary/40 bg-primary/10 p-3 my-3">
            <div className="flex items-center gap-2 font-bold text-cyan-soft">
              <Check size={16} className="text-success" />
              <span>Lunar Reconnaissance Data Acquired</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{s.lunarSurveyData?.description || "Scientific reconnaissance completed successfully."}</p>
          </div>
        )}

        <footer className="mf-panel-actions">
          <Button variant="outline" onClick={() => s.go("menu")}><Rocket size={16} /> Mission Control</Button>
          <Button variant="secondary" onClick={() => s.newRun("missions")}>{t("exp.newDestination")}</Button>
          <Button variant="secondary" onClick={handleExportPNG}><Download size={16} /> Export Certificate (PNG)</Button>
          <Button onClick={() => s.newRun("build")}><RefreshCcw />{t("exp.retry")}</Button>
        </footer>
      </aside>

      {/* Academy Review Modal */}
      <CurriculumModal
        isOpen={academyOpen}
        onClose={() => setAcademyOpen(false)}
      />
    </div>
  );
}
