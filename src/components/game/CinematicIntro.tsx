import { useEffect, useState, useRef } from "react";
import { Rocket, ArrowRight, Compass, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useMissionStore } from "../../stores/mission-store";
import { sfx } from "../../lib/audio";

interface CinematicIntroProps {
  onComplete: () => void;
  onExploreMissions: () => void;
}

export function CinematicIntro({ onComplete, onExploreMissions }: CinematicIntroProps) {
  const [frame, setFrame] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const s = useMissionStore();
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Stage-by-stage progression (Frame 1: 0s, Frame 2: 2s, Frame 3: 4.5s, Frame 4: 7.5s, Frame 5: 10s, Frame 6: 12.5s)
    const t1 = setTimeout(() => setFrame(2), 2000);
    const t2 = setTimeout(() => setFrame(3), 4500);
    const t3 = setTimeout(() => {
      setFrame(4);
      sfx.blip();
    }, 7500);
    const t4 = setTimeout(() => setFrame(5), 10000);
    const t5 = setTimeout(() => {
      setFrame(6);
      sfx.success();
    }, 12500);

    timerRef.current = [t1, t2, t3, t4, t5];

    return () => {
      timerRef.current.forEach(clearTimeout);
    };
  }, []);

  const skip = () => {
    timerRef.current.forEach(clearTimeout);
    sfx.click();
    onComplete();
  };

  return (
    <div
      className="mf-cinematic-intro"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "#020611",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#ffffff",
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      {/* Starfield Layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(13, 38, 77, 0.4) 0%, #01040a 100%)",
          opacity: frame >= 1 ? 1 : 0,
          transition: "opacity 2s ease",
        }}
      >
        {/* Procedural Canvas Stars */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          {[...Array(60)].map((_, i) => (
            <circle
              key={i}
              cx={`${(i * 17.3) % 100}%`}
              cy={`${(i * 29.7) % 100}%`}
              r={i % 5 === 0 ? 1.8 : i % 2 === 0 ? 1.2 : 0.8}
              fill="#ffffff"
              opacity={frame >= 1 ? (0.3 + (i % 7) * 0.1) : 0}
              style={{ transition: `opacity ${1.5 + (i % 3)}s ease` }}
            />
          ))}
        </svg>
      </div>

      {/* Earth Graphic with Atmospheric Glow & Sunlit Terminator */}
      <div
        style={{
          position: "absolute",
          width: frame >= 3 ? "520px" : frame === 2 ? "260px" : "120px",
          height: frame >= 3 ? "520px" : frame === 2 ? "260px" : "120px",
          borderRadius: "50%",
          backgroundImage: "url(/images/nasa-earth-blue-marble.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: frame >= 3
            ? "inset -80px -40px 100px rgba(0, 0, 0, 0.95), inset 20px 20px 60px rgba(255, 255, 255, 0.4), 0 0 80px rgba(45, 127, 249, 0.45), 0 0 160px rgba(16, 78, 168, 0.25)"
            : "0 0 30px rgba(45, 127, 249, 0.2)",
          opacity: frame >= 2 ? 1 : 0,
          transform: `translateY(${frame >= 6 ? "120px" : "0px"}) scale(${frame >= 4 ? 1 : 0.85})`,
          transition: "width 3.5s cubic-bezier(0.16, 1, 0.3, 1), height 3.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 2s ease, transform 3s ease, box-shadow 3s ease",
          pointerEvents: "none",
        }}
      >
        {/* Subtle Atmospheric Shell */}
        <div
          style={{
            position: "absolute",
            inset: "-12px",
            borderRadius: "50%",
            border: "1.5px solid rgba(110, 185, 255, 0.35)",
            boxShadow: "0 0 35px rgba(85, 170, 255, 0.3)",
            opacity: frame >= 3 ? 1 : 0,
            transition: "opacity 2s ease",
          }}
        />
      </div>

      {/* Frame 5 Spacecraft Silhouette Passing by */}
      {frame >= 5 && (
        <div
          style={{
            position: "absolute",
            top: "35%",
            left: "-100px",
            animation: "mfCraftFlyby 4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
            pointerEvents: "none",
            filter: "drop-shadow(0 0 12px rgba(88, 166, 255, 0.6))",
          }}
        >
          <Rocket size={38} color="#e6f1ff" style={{ transform: "rotate(45deg)" }} />
        </div>
      )}

      {/* Frame 4 Mission Telemetry */}
      {frame >= 4 && frame < 6 && (
        <div
          style={{
            position: "absolute",
            top: "22%",
            textAlign: "center",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            fontSize: "12px",
            color: "#6eb6ff",
            background: "rgba(5, 16, 38, 0.75)",
            padding: "8px 24px",
            borderRadius: "30px",
            border: "1px solid rgba(110, 182, 255, 0.3)",
            animation: "fadeIn 1s ease",
          }}
        >
          <span>EARTH · MISSION CONTROL · SYSTEMS ONLINE</span>
        </div>
      )}

      {/* Frame 6 Main Logo & Action Hub */}
      {frame >= 6 && (
        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "760px",
            padding: "0 24px",
            animation: "fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#6bb0ff",
              fontWeight: 700,
              marginBottom: "8px",
              display: "block",
            }}
          >
            NASA SPACE APPS CHALLENGE 2026 · TEAM GHOST HUNTER
          </span>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2.8rem, 6vw, 4.4rem)",
              fontWeight: 800,
              letterSpacing: "0.08em",
              lineHeight: 1.05,
              textShadow: "0 0 40px rgba(45, 127, 249, 0.6)",
            }}
          >
            MISSION <span style={{ color: "#4da3ff" }}>FORGE</span>
          </h1>

          <p
            style={{
              margin: "12px 0 6px",
              fontSize: "14px",
              letterSpacing: "0.2em",
              fontWeight: 700,
              color: "#d4e6ff",
              textTransform: "uppercase",
            }}
          >
            DESIGN. EXPLORE. DECIDE. SURVIVE.
          </p>

          <p
            style={{
              margin: "0 0 28px",
              fontSize: "13px",
              color: "#8dafd8",
              lineHeight: 1.6,
              maxWidth: "540px",
            }}
          >
            An interactive space mission design simulation driven by verified NASA, JPL, and NSSDCA public telemetry.
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => {
                sfx.success();
                onComplete();
                s.newRun("missions");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 28px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#ffffff",
                border: "none",
                fontWeight: 700,
                fontSize: "14px",
                letterSpacing: "0.05em",
                cursor: "pointer",
                boxShadow: "0 0 25px rgba(37, 99, 235, 0.5)",
                transition: "all 0.2s ease",
              }}
            >
              <Rocket size={17} /> BEGIN MISSION <ArrowRight size={16} />
            </button>

            <button
              onClick={() => {
                sfx.click();
                onExploreMissions();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "8px",
                background: "rgba(13, 38, 77, 0.6)",
                color: "#bfdbfe",
                border: "1px solid rgba(88, 166, 255, 0.3)",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <Compass size={17} /> EXPLORE MISSIONS
            </button>
          </div>
        </div>
      )}

      {/* Skip Intro & Sound Controls */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "24px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          zIndex: 20,
        }}
      >
        <button
          onClick={() => s.set({ muted: !s.muted })}
          title={s.muted ? "Unmute sound" : "Mute sound"}
          style={{
            background: "transparent",
            border: "none",
            color: "#64748b",
            cursor: "pointer",
            padding: "6px",
          }}
        >
          {s.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <button
          onClick={skip}
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#94a3b8",
            borderRadius: "6px",
            padding: "6px 14px",
            fontSize: "11px",
            letterSpacing: "0.1em",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          SKIP INTRO
        </button>
      </div>

      <style>{`
        @keyframes mfCraftFlyby {
          0% { transform: translate(-100px, 60px) rotate(45deg) scale(0.6); opacity: 0; }
          25% { opacity: 0.9; }
          75% { opacity: 0.9; }
          100% { transform: translate(110vw, -120px) rotate(45deg) scale(1.1); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
