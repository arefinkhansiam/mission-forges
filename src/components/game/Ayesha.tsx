import { useTranslation } from "react-i18next";
import { LANGS } from "../../locales/resources";
import { useMissionStore } from "../../stores/mission-store";
import { useVoice, VoiceBar } from "./voice";

export function AyeshaAvatar() {
  return <svg className="mf-ayesha-avatar" viewBox="0 0 48 48" aria-hidden><circle cx="24" cy="24" r="24" fill="#0f3a78" /><circle cx="24" cy="19" r="8" fill="#e6c2a0" /><path d="M14 17a10 10 0 0 1 20 0v3c-2-4-6-6-10-6s-8 2-10 6z" fill="#1c1410" /><path d="M9 44c2-9 8-13 15-13s13 4 15 13" fill="#dfeaff" /><circle cx="24" cy="36" r="2" fill="#1677ff" /></svg>;
}

// Contextual guide (§8): appears once per phase where a decision matters, never permanently on screen.
const CONTEXT: Record<string, "build" | "launch"> = { build: "build" };

export function Ayesha() {
  const { t } = useTranslation();
  const s = useMissionStore(); const voice = useVoice();
  const ctx = CONTEXT[s.phase];
  if (!ctx || s.learn || s.ayeshaSeen.includes(ctx) || s.phase === "build") return null;
  const text = t(`ayeshaTips.${ctx}`);
  const rtl = LANGS.find((l) => l.id === s.lang && "rtl" in l);
  return (
    <aside className="mf-ayesha" dir={rtl ? "rtl" : "ltr"} aria-label={t("ui.ayesha.name")}>
      <div className="mf-ayesha-head"><AyeshaAvatar /><div><b>{t("ui.ayesha.name")}</b><small>{t("ui.ayesha.role")}</small></div></div>
      <VoiceBar text={text} voice={voice} />
      <button className="mf-primary" onClick={() => { voice.stop(); s.set({ ayeshaSeen: [...s.ayeshaSeen, ctx] }); }}>{t("ui.ayesha.dismiss")}</button>
    </aside>
  );
}
