// src/components/ui/BigButton.tsx
import React from "react";

interface BigButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost";
  kidMode?: boolean;
  glow?: boolean;
  icon?: React.ReactNode;
}

export const BigButton: React.FC<BigButtonProps> = ({
  children,
  variant = "primary",
  kidMode = false,
  glow = true,
  icon,
  className = "",
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    try {
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.(10); // subtle haptic feedback
      }
    } catch {
      // Haptics unavailable
    }
    onClick?.(e);
  };

  const minHeightClass = kidMode ? "min-h-[64px] text-lg font-bold" : "min-h-[56px] text-base font-semibold";
  const radiusClass = kidMode ? "rounded-[32px]" : "rounded-full";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/25 active:scale-[0.98]",
    secondary:
      "bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700 hover:border-cyan-400/50 shadow-md active:scale-[0.98]",
    success:
      "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/25 active:scale-[0.98]",
    danger:
      "bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold shadow-lg shadow-rose-600/25 active:scale-[0.98]",
    ghost:
      "bg-transparent hover:bg-white/10 text-slate-300 hover:text-white border border-transparent hover:border-white/20 active:scale-[0.98]",
  };

  const glowStyle =
    glow && !disabled
      ? "hover:shadow-[0_0_24px_rgba(56,189,248,0.5)]"
      : "";

  const disabledStyle = disabled
    ? "opacity-45 cursor-not-allowed filter grayscale"
    : "cursor-pointer transform hover:-translate-y-0.5";

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center gap-3 px-8 transition-all duration-200 ${minHeightClass} ${radiusClass} ${variantStyles[variant]} ${glowStyle} ${disabledStyle} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
};
