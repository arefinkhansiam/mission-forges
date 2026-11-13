// src/routes/credits.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassCard } from "@/components/ui/GlassCard";
import { BigButton } from "@/components/ui/BigButton";
import { ProvenanceChip } from "@/components/ui/ProvenanceChip";

export const Route = createFileRoute("/credits")({
  component: CreditsPage,
});

interface AttributionItem {
  category: "NASA & Scientific APIs" | "3D Models & Geometry" | "Planetary Cartography" | "Audio & Acoustics" | "Core Libraries";
  name: string;
  creator: string;
  license: string;
  sourceUrl: string;
  description: string;
}

const ATTRIBUTIONS: AttributionItem[] = [
  {
    category: "NASA & Scientific APIs",
    name: "NASA DONKI (Space Weather)",
    creator: "NASA Goddard Space Flight Center",
    license: "Public Domain / NASA Open Data",
    sourceUrl: "https://api.nasa.gov",
    description: "Real-time solar flares, coronal mass ejections, and interplanetary shockwaves.",
  },
  {
    category: "NASA & Scientific APIs",
    name: "NOAA Space Weather Prediction Center",
    creator: "National Oceanic and Atmospheric Administration (NOAA)",
    license: "Public Domain / U.S. Government Work",
    sourceUrl: "https://services.swpc.noaa.gov",
    description: "Live planetary geomagnetic Kp index and solar wind plasma velocity.",
  },
  {
    category: "NASA & Scientific APIs",
    name: "NASA JPL Horizons & Small-Body Database",
    creator: "NASA Jet Propulsion Laboratory / Caltech",
    license: "Public Domain / NASA Open Data",
    sourceUrl: "https://ssd.jpl.nasa.gov",
    description: "High-precision solar system orbital ephemerides and physical constants.",
  },
  {
    category: "3D Models & Geometry",
    name: "NASA 3D Spacecraft Catalog",
    creator: "NASA 3D Resources / Visualizer Lab",
    license: "Public Domain / NASA Policy",
    sourceUrl: "https://nasa3d.arc.nasa.gov",
    description: "Authentic scientific meshes: Saturn V, Apollo Lunar Module, Voyager, and Artemis SLS.",
  },
  {
    category: "3D Models & Geometry",
    name: "Kenney Assets (SpaceKit, Vehicles & Props)",
    creator: "Kenney (Asset Jesus)",
    license: "Creative Commons CC0 1.0 Universal",
    sourceUrl: "https://kenney.nl",
    description: "City elements, hangar modular structures, and stylized rover hulls.",
  },
  {
    category: "Planetary Cartography",
    name: "Solar System Scope Cartography",
    creator: "Solar System Scope",
    license: "Creative Commons Attribution 4.0 International (CC BY 4.0)",
    sourceUrl: "https://www.solarsystemscope.com/textures/",
    description: "High-resolution orbital textures for Earth, Moon, Mars, Ceres, Jupiter, and Saturn.",
  },
  {
    category: "Planetary Cartography",
    name: "USGS Astrogeology & Lunar Reconnaissance Orbiter (LROC)",
    creator: "USGS / NASA Goddard",
    license: "Public Domain / NASA Open Data",
    sourceUrl: "https://www.lroc.asu.edu",
    description: "Elevation models and permanently shadowed crater maps for Artemis exploration sites.",
  },
  {
    category: "Audio & Acoustics",
    name: "NASA Historical Audio & Radio Transmissions",
    creator: "NASA History Division",
    license: "Public Domain / U.S. Government",
    sourceUrl: "https://images.nasa.gov",
    description: "Apollo mission audio, quindar beeps, telemetry tones, and Saturn V acoustic recordings.",
  },
  {
    category: "Core Libraries",
    name: "Three.js & React Three Fiber (R3F)",
    creator: "Mr.doob & Poimandres",
    license: "MIT License",
    sourceUrl: "https://threejs.org",
    description: "WebGL 3D graphics rendering pipeline and interactive camera controls.",
  },
  {
    category: "Core Libraries",
    name: "TanStack Start & Router",
    creator: "Tanner Linsley & TanStack Team",
    license: "MIT License",
    sourceUrl: "https://tanstack.com",
    description: "Full-stack SSR routing and server-side RPC functions.",
  },
];

function CreditsPage() {
  const categories = Array.from(new Set(ATTRIBUTIONS.map((a) => a.category)));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans selection:bg-cyan-500/30">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
              <span>🏛️ Provenance & Transparency</span>
              <span>•</span>
              <span>Open Science</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Data, Asset & Research Credits
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Mission Forge is built on zero-fabrication real space science. Every ephemeris,
              planetary texture, telemetry formula, and 3D asset is attributed to its original open research creator.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/status">
              <BigButton variant="secondary" className="!min-h-[44px] text-xs">
                📡 Live API Health
              </BigButton>
            </Link>
            <Link to="/">
              <BigButton variant="primary" className="!min-h-[44px] text-xs">
                ← Back to Mission
              </BigButton>
            </Link>
          </div>
        </div>

        {/* Challenge 13 Statement */}
        <GlassCard className="border-indigo-500/30 bg-indigo-950/20 p-6 space-y-3">
          <div className="flex items-center gap-2 text-indigo-300 font-mono text-xs font-bold uppercase tracking-wider">
            <span>🚀 NASA Space Apps Challenge 2026</span>
            <span>•</span>
            <span>Challenge 13: Space Mission Design</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            Designed and engineered by <strong>Team Ghost Hunter</strong> (Bangladesh). Mission Forge adheres strictly
            to NASA Open Science directives: public domain ephemerides, genuine link budgets, verified delta-v calculations,
            and complete creative commons compliance across all media assets.
          </p>
        </GlassCard>

        {/* Attributions Grouped by Category */}
        <div className="space-y-8">
          {categories.map((category) => {
            const items = ATTRIBUTIONS.filter((a) => a.category === category);
            return (
              <section key={category} className="space-y-4">
                <h2 className="text-lg font-bold text-cyan-300 font-display flex items-center gap-2 border-b border-white/5 pb-2">
                  <span>{category}</span>
                  <span className="text-xs font-mono text-slate-400 font-normal">
                    ({items.length} verified sources)
                  </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((item, idx) => (
                    <GlassCard
                      key={idx}
                      className="p-5 flex flex-col justify-between space-y-3 border-white/10 hover:border-cyan-500/40 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-white text-base leading-snug">
                            {item.name}
                          </h3>
                          <ProvenanceChip
                            provenance={{
                              source: item.creator,
                              url: item.sourceUrl,
                              fetchedAt: "2026-10-19T00:00:00Z",
                              status: "snapshot",
                              license: item.license,
                            }}
                          />
                        </div>
                        <div className="text-xs font-mono text-cyan-400">
                          {item.creator}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">{item.license}</span>
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 underline inline-flex items-center gap-1"
                        >
                          Visit Source ↗
                        </a>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-white/10 text-center text-xs text-slate-500 font-mono space-y-1">
          <div>MISSION FORGE • ADVANCED SPACE MISSION DESIGN SUITE</div>
          <div>All trademarks and public domain scientific assets belong to their respective NASA/JPL/NOAA entities.</div>
        </div>
      </div>
    </div>
  );
}
