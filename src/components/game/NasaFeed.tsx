import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getNasa, type NasaResult } from "../../lib/nasa.functions";
import { ProvenanceChip } from "../ui/ProvenanceChip";
import type { Provenance } from "../../lib/provenance";

type FeedRow = {
  label: string;
  value: string;
  provenance: Provenance;
};

// Home-screen live NASA feed (APOD, NeoWs, DONKI). Displays strict ProvenanceChip states (live, snapshot, unavailable).
export function NasaFeed() {
  const call = useServerFn(getNasa);
  const [rows, setRows] = useState<FeedRow[] | null>(null);

  useEffect(() => {
    let off = false;
    const safe = (source: "apod" | "neo" | "donki"): Promise<NasaResult> =>
      call({ data: { source } }).catch(
        (): NasaResult => ({
          source,
          live: false,
          cached: false,
          status: "unavailable",
          fetchedAt: new Date().toISOString(),
          data: "null",
          provenance: {
            source: source === "donki" ? "NASA DONKI" : source === "neo" ? "NASA NeoWs" : "NASA APOD",
            url: "https://api.nasa.gov",
            fetchedAt: new Date().toISOString(),
            status: "unavailable",
          },
        })
      );

    Promise.all([safe("apod"), safe("neo"), safe("donki")]).then(([apod, neo, donki]) => {
      if (off) return;
      const a = apod.data !== "null" ? (JSON.parse(apod.data) as { title?: string } | null) : null;
      const n = neo.data !== "null" ? (JSON.parse(neo.data) as { element_count?: number; objects?: { hazardous: boolean }[] } | null) : null;
      const d = donki.data !== "null" ? (JSON.parse(donki.data) as { events?: { classType?: string }[] } | null) : null;
      const flare = d?.events?.at(-1);

      setRows([
        {
          label: "Astronomy Picture",
          value: a?.title ?? "Unavailable",
          provenance: apod.provenance,
        },
        {
          label: "Near-Earth Asteroids",
          value: n ? `${n.element_count ?? 0} tracked · ${n.objects?.filter((o) => o.hazardous).length ?? 0} hazardous` : "Unavailable",
          provenance: neo.provenance,
        },
        {
          label: "Solar Flare Activity",
          value: flare?.classType ? `Class ${flare.classType}` : "Quiet — no major flares",
          provenance: donki.provenance,
        },
      ]);
    });
    return () => {
      off = true;
    };
  }, [call]);

  return (
    <div className="mf-nasa-feed" aria-live="polite">
      <div className="flex items-center justify-between pb-1 mb-2 border-b border-white/10">
        <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
          LIVE NASA/NOAA OBSERVATORY
        </span>
        <a href="/status" className="text-[10px] font-mono text-slate-400 hover:text-cyan-300 underline">
          status &gt;
        </a>
      </div>
      {!rows ? (
        <p className="mf-nasa-row text-xs text-slate-400">Connecting to NASA telemetry…</p>
      ) : (
        rows.map((r) => (
          <div className="mf-nasa-row flex flex-col gap-1 py-1.5" key={r.label}>
            <div className="flex items-center justify-between gap-2">
              <small className="text-slate-300 font-medium">{r.label}</small>
              <ProvenanceChip provenance={r.provenance} className="scale-90 origin-right" />
            </div>
            <b className="text-white font-mono text-xs">{r.value}</b>
          </div>
        ))
      )}
    </div>
  );
}
