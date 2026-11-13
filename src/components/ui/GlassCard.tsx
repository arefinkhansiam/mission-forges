// src/components/ui/GlassCard.tsx
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "accent" | "danger" | "interactive";
  glow?: boolean;
  kidMode?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = "default",
  glow = false,
  kidMode = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "relative backdrop-blur-xl border transition-all overflow-hidden";

  const radiusClass = kidMode ? "rounded-[28px]" : "rounded-[20px]";

  const variantClasses = {
    default:
      "bg-slate-950/70 border-white/10 text-slate-100 shadow-xl shadow-black/40",
    elevated:
      "bg-slate-900/80 border-cyan-500/20 text-white shadow-2xl shadow-cyan-950/30",
    accent:
      "bg-indigo-950/70 border-indigo-500/30 text-indigo-100 shadow-xl shadow-indigo-950/40",
    danger:
      "bg-rose-950/70 border-rose-500/30 text-rose-100 shadow-xl shadow-rose-950/40",
    interactive:
      "bg-slate-950/70 border-white/10 hover:border-cyan-400/50 hover:bg-slate-900/80 hover:-translate-y-0.5 cursor-pointer text-slate-100",
  };

  const glowClass = glow
    ? "shadow-[0_0_24px_rgba(56,189,248,0.35)] border-cyan-400/50"
    : "";

  return (
    <div
      className={`${baseClasses} ${radiusClass} ${variantClasses[variant]} ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
