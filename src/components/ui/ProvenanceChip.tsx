// src/components/ui/ProvenanceChip.tsx
import React from "react";
import type { Provenance } from "../../lib/provenance";

interface ProvenanceChipProps {
  provenance: Provenance;
  onRetry?: () => void;
  className?: string;
}

export const ProvenanceChip: React.FC<ProvenanceChipProps> = ({
  provenance,
  onRetry,
  className = "",
}) => {
  const { status, source, fetchedAt, url } = provenance;

  // Format timestamp (UTC HH:MM or YYYY-MM-DD)
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString("en-US", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) + " UTC";
    } catch {
      return isoString;
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toISOString().split("T")[0];
    } catch {
      return isoString;
    }
  };

  if (status === "live") {
    return (
      <a
        href={url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        title={`Verified live feed from ${source} at ${fetchedAt}`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium tracking-wide bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400 transition-all ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
        <span>LIVE</span>
        <span className="opacity-40">•</span>
        <span className="truncate max-w-[130px]">{source}</span>
        <span className="opacity-40">•</span>
        <span className="opacity-80">{formatTime(fetchedAt)}</span>
      </a>
    );
  }

  if (status === "snapshot") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium tracking-wide bg-amber-950/80 border border-amber-500/40 text-amber-300 ${className}`}
        title={`Verified NASA archival snapshot fetched ${formatDate(fetchedAt)}`}
      >
        <span className="w-2 h-2 rounded-full border border-amber-400 bg-amber-400/50" />
        <span>SNAPSHOT</span>
        <span className="opacity-40">•</span>
        <span className="truncate max-w-[110px]">{source}</span>
        <span className="opacity-40">•</span>
        <span className="opacity-80">{formatDate(fetchedAt)}</span>
        {onRetry && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onRetry();
            }}
            className="ml-1 text-[10px] underline hover:text-white transition-colors"
          >
            retry
          </button>
        )}
      </div>
    );
  }

  // Unavailable state (Honest, zero fabricated numbers)
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium tracking-wide bg-slate-900/80 border border-slate-700/60 text-slate-400 ${className}`}
      title={`Live source currently unreachable (${source})`}
    >
      <span className="w-2 h-2 rounded-full border border-slate-500" />
      <span>UNAVAILABLE</span>
      <span className="opacity-40">•</span>
      <span className="truncate max-w-[110px]">{source}</span>
      {onRetry && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onRetry();
          }}
          className="ml-1 text-[10px] text-cyan-400 underline hover:text-cyan-300"
        >
          retry
        </button>
      )}
    </div>
  );
};
