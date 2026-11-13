// src/components/ui/WhyCard.tsx
import React from "react";
import { ProvenanceChip } from "./ProvenanceChip";
import type { Provenance } from "../../lib/provenance";

export interface WhyTopic {
  title: string;
  concept: string;
  valueDisplayed?: string;
  equation?: {
    formula: string;
    description: string;
    variables: { symbol: string; name: string; value?: string }[];
  };
  kidExplanation?: string;
  cadetExplanation: string;
  provenance?: Provenance;
}

interface WhyCardProps {
  topic: WhyTopic | null;
  isOpen: boolean;
  onClose: () => void;
  kidMode?: boolean;
}

export const WhyCard: React.FC<WhyCardProps> = ({
  topic,
  isOpen,
  onClose,
  kidMode = false,
}) => {
  if (!isOpen || !topic) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      {/* Background click dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Content Card */}
      <div
        className={`relative w-full max-w-xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-cyan-500/30 text-slate-100 shadow-2xl shadow-cyan-950/60 p-6 z-10 ${
          kidMode ? "rounded-t-[32px] sm:rounded-[32px]" : "rounded-t-[24px] sm:rounded-[24px]"
        }`}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-400">
                {kidMode ? "🚀 Space Detective" : "🔬 Physics & Engineering Logic"}
              </span>
              {topic.provenance && <ProvenanceChip provenance={topic.provenance} />}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
              {topic.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Value Callout (if present) */}
        {topic.valueDisplayed && (
          <div className="my-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-300 uppercase tracking-wide">
              Observed Value:
            </span>
            <span className="text-lg font-mono font-bold text-white">
              {topic.valueDisplayed}
            </span>
          </div>
        )}

        {/* Explanation: Kid vs Cadet */}
        <div className="space-y-4 my-4">
          {kidMode && topic.kidExplanation ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-base leading-relaxed">
              <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                <span>⭐</span> How it works:
              </div>
              <p>{topic.kidExplanation}</p>
            </div>
          ) : (
            <div className="text-sm text-slate-300 leading-relaxed space-y-2">
              <p className="font-semibold text-slate-200">{topic.concept}</p>
              <p>{topic.cadetExplanation}</p>
            </div>
          )}

          {/* Equation & Mathematical Derivation (For Cadet / Commander) */}
          {topic.equation && !kidMode && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider">
                Governing Equation:
              </span>
              <div className="font-mono text-base font-bold text-white py-1 px-3 bg-black/40 rounded border border-white/5 overflow-x-auto">
                {topic.equation.formula}
              </div>
              <p className="text-xs text-slate-400">
                {topic.equation.description}
              </p>
              {topic.equation.variables.length > 0 && (
                <div className="pt-2 text-xs font-mono text-slate-400 space-y-1">
                  {topic.equation.variables.map((v) => (
                    <div key={v.symbol} className="flex gap-2">
                      <span className="text-cyan-300 font-bold">{v.symbol}</span>
                      <span>=</span>
                      <span>{v.name}</span>
                      {v.value && <span className="text-slate-200 font-semibold">({v.value})</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Close Action */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};
