import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import {
  X,
  Box,
  ExternalLink,
  Shield,
  Layers,
  RotateCcw,
  Sparkles,
  Info,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  Image as ImageIcon,
} from "lucide-react";
import {
  NASA_3D_ASSETS,
  AUDITED_REJECTED_ASSETS,
  type Nasa3DAsset,
} from "../../lib/nasa-3d-registry";
import { Nasa3DModel } from "./Nasa3DModel";

interface Nasa3DLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAssetId?: string | undefined;
}

export function Nasa3DLibraryModal({
  isOpen,
  onClose,
  initialAssetId,
}: Nasa3DLibraryModalProps) {
  const [tab, setTab] = useState<"models" | "textures" | "rejected" | "guidelines">("models");
  const [selectedAsset, setSelectedAsset] = useState<Nasa3DAsset>(() => {
    if (initialAssetId) {
      const found = NASA_3D_ASSETS.find((a) => a.id === initialAssetId);
      if (found) return found;
    }
    return NASA_3D_ASSETS[0]!;
  });
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  if (!isOpen) return null;

  const modelsList = NASA_3D_ASSETS.filter((a) => a.category !== "Textures");
  const texturesList = NASA_3D_ASSETS.filter((a) => a.category === "Textures");

  const filteredModels = modelsList.filter(
    (a) => categoryFilter === "All" || a.category === categoryFilter
  );

  return (
    <div
      className="mf-backdrop pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      style={{
        background: "rgba(2, 6, 23, 0.88)",
        backdropFilter: "blur(10px)",
      }}
      onClick={onClose}
    >
      <div
        className="relative flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#071126] text-foreground shadow-2xl shadow-cyan-950/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-cyan-500/20 bg-[#0a1835]/90 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-950/50 text-cyan-400">
              <Box size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold uppercase tracking-[0.18em] text-white">
                  NASA 3D Resources · Asset Library & Provenance
                </h2>
                <span className="rounded bg-cyan-900/60 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                  OFFICIAL NASA REPO
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                NASA/NASA-3D-Resources · Verified web-optimized GLB models & cylindrical maps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        {/* Navigation Tabs */}
        <div className="flex shrink-0 gap-2 border-b border-white/10 bg-[#08152e] px-4 py-2 sm:px-6">
          <button
            onClick={() => setTab("models")}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
              tab === "models"
                ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40"
                : "text-muted-foreground hover:bg-white/5 hover:text-white"
            }`}
          >
            <Box size={14} /> 3D Models ({modelsList.length})
          </button>
          <button
            onClick={() => setTab("textures")}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
              tab === "textures"
                ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40"
                : "text-muted-foreground hover:bg-white/5 hover:text-white"
            }`}
          >
            <ImageIcon size={14} /> Planetary Textures ({texturesList.length})
          </button>
          <button
            onClick={() => setTab("rejected")}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
              tab === "rejected"
                ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40"
                : "text-muted-foreground hover:bg-white/5 hover:text-white"
            }`}
          >
            <Shield size={14} /> Audited & Rejected ({AUDITED_REJECTED_ASSETS.length})
          </button>
          <button
            onClick={() => setTab("guidelines")}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
              tab === "guidelines"
                ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40"
                : "text-muted-foreground hover:bg-white/5 hover:text-white"
            }`}
          >
            <Info size={14} /> Usage Guidelines & Separation
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 overflow-hidden">
          {tab === "models" && (
            <>
              {/* Left Column: Asset Selector */}
              <div className="flex w-72 shrink-0 flex-col border-r border-white/10 bg-[#060f22] p-3 sm:w-80">
                <div className="mb-2 flex flex-wrap gap-1">
                  {["All", "Spacecraft", "Asteroid", "Observatory", "Rotorcraft"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`rounded px-2 py-0.5 text-[11px] font-semibold transition ${
                        categoryFilter === cat
                          ? "bg-cyan-500 text-black font-bold"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
                  {filteredModels.map((asset) => {
                    const isSelected = selectedAsset.id === asset.id;
                    return (
                      <button
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset)}
                        className={`flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left transition ${
                          isSelected
                            ? "border-cyan-400/60 bg-cyan-950/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                            : "border-white/5 bg-[#09152b]/60 hover:border-white/20 hover:bg-[#0c1b36]"
                        }`}
                      >
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">
                          <Box size={14} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="truncate text-xs font-bold text-white">
                            {asset.name}
                          </div>
                          <div className="truncate text-[10.5px] text-muted-foreground">
                            {asset.organization}
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[10px] text-cyan-400/80">
                            <span>{asset.category}</span>
                            <span className="font-mono">{asset.fileSizeKb} KB</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: 3D Viewport & Metadata */}
              <div className="flex flex-1 flex-col overflow-y-auto">
                {/* Live 3D Viewport */}
                <div className="relative h-72 w-full shrink-0 border-b border-white/10 bg-[#030816] sm:h-96">
                  <Canvas
                    camera={{ position: [0, 1.5, 4], fov: 45 }}
                    className="h-full w-full"
                  >
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 15, 10]} intensity={1.5} />
                    <directionalLight position={[-10, -5, -10]} intensity={0.4} color="#38bdf8" />
                    <Stars radius={50} depth={30} count={1200} factor={3} saturation={0} fade />
                    <Suspense fallback={null}>
                      <Nasa3DModel
                        key={selectedAsset.localPath}
                        modelUrl={selectedAsset.localPath}
                        targetSize={2.4}
                        autoRotate={autoRotate}
                        wireframe={wireframe}
                      />
                    </Suspense>
                    <OrbitControls makeDefault enablePan={true} enableZoom={true} />
                  </Canvas>

                  {/* 3D Viewport Controls */}
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <button
                      onClick={() => setAutoRotate(!autoRotate)}
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase backdrop-blur-md transition ${
                        autoRotate
                          ? "bg-cyan-500/30 border border-cyan-400/60 text-cyan-300"
                          : "bg-black/60 text-muted-foreground hover:text-white"
                      }`}
                    >
                      <RotateCcw size={12} /> Auto-Spin
                    </button>
                    <button
                      onClick={() => setWireframe(!wireframe)}
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase backdrop-blur-md transition ${
                        wireframe
                          ? "bg-cyan-500/30 border border-cyan-400/60 text-cyan-300"
                          : "bg-black/60 text-muted-foreground hover:text-white"
                      }`}
                    >
                      <Layers size={12} /> Wireframe
                    </button>
                  </div>

                  {/* Subtle Source Overlay */}
                  <div className="absolute top-3 right-3 rounded-full border border-cyan-400/30 bg-[#071328]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-300 backdrop-blur-md">
                    NASA 3D Resources · Live Three.js Preview
                  </div>
                </div>

                {/* Provenance Metadata Details */}
                <div className="flex-1 p-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedAsset.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{selectedAsset.description}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl border border-white/5 bg-[#09152b]/50 p-3">
                      <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Original Repository Path</div>
                      <div className="font-mono text-xs text-cyan-300 break-all mt-1">{selectedAsset.originalPath}</div>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-[#09152b]/50 p-3">
                      <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Contributing Organization</div>
                      <div className="text-xs font-semibold text-white mt-1">{selectedAsset.organization}</div>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-[#09152b]/50 p-3">
                      <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Format & Optimization</div>
                      <div className="text-xs font-semibold text-white mt-1">
                        {selectedAsset.originalFormat} → <span className="text-cyan-400">{selectedAsset.webFormat}</span> ({selectedAsset.fileSizeKb} KB)
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-[#09152b]/50 p-3">
                      <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">License & Usage Terms</div>
                      <div className="text-xs font-semibold text-white mt-1">{selectedAsset.license}</div>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-[#09152b]/50 p-3">
                      <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Official Attribution</div>
                      <div className="text-xs font-semibold text-white mt-1">{selectedAsset.attribution}</div>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-[#09152b]/50 p-3">
                      <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Integrated In Mission Forge</div>
                      <div className="text-xs font-semibold text-cyan-300 mt-1">
                        {selectedAsset.usedIn.join(" · ")}
                      </div>
                    </div>
                  </div>

                  {selectedAsset.technicalNotes && (
                    <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                        <Sparkles size={14} /> Web Optimization & Rendering Notes
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {selectedAsset.technicalNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {tab === "textures" && (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  NASA Solar System Simulator Cylindrical Maps
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Extracted from <code className="text-cyan-300">Images and Textures</code> in the official NASA 3D Resources repository.
                  Converted to high-efficiency WebP projections for planetary bodies.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {texturesList.map((tex) => (
                  <div
                    key={tex.id}
                    className="overflow-hidden rounded-xl border border-white/10 bg-[#09152b]/70 flex flex-col"
                  >
                    <div className="relative h-40 w-full overflow-hidden bg-black/60">
                      <img
                        src={tex.localPath}
                        alt={tex.name}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                      <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                        {tex.fileSizeKb} KB
                      </span>
                    </div>
                    <div className="flex-1 p-3.5 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">{tex.name}</h4>
                        <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                          {tex.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-cyan-400">
                        <b>Source:</b> {tex.organization}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "rejected" && (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Audited & Rejected Assets Rationale
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  In strict compliance with Step 1, 2, and 12, assets were audited and intentionally excluded
                  if they were unoptimized, lacked web textures, or were irrelevant to deep-space simulation.
                </p>
              </div>

              <div className="space-y-3">
                {AUDITED_REJECTED_ASSETS.map((rej, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-red-500/20 bg-red-950/10 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-400 shrink-0" />
                        <h4 className="text-sm font-bold text-white">{rej.name}</h4>
                      </div>
                      <span className="rounded bg-red-900/40 px-2 py-0.5 text-[10.5px] font-bold text-red-300 uppercase">
                        {rej.rejectionReason}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground break-all">
                      {rej.path} ({rej.originalFormat}, ~{rej.fileSizeApprox})
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      {rej.notes}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "guidelines" && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  NASA 3D Resources Guidelines & Scientific Separation
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Compliance and provenance policy for NASA Space Apps Challenge 2026.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-cyan-500/20 bg-[#09152b]/60 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase">
                    <CheckCircle2 size={16} /> Official Repository Reference
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Repository: <code className="text-white">NASA/NASA-3D-Resources</code>
                    <br />
                    Hosted on GitHub at <a href="https://github.com/nasa/NASA-3D-Resources" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center gap-1">github.com/nasa/NASA-3D-Resources <ExternalLink size={10} /></a>.
                  </p>
                </div>

                <div className="rounded-xl border border-cyan-500/20 bg-[#09152b]/60 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase">
                    <CheckCircle2 size={16} /> NASA Media Usage Guidelines
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    NASA content (audio, video, text, or 3D models) is generally not subject to copyright in the United States.
                    Full brand guidelines: <a href="https://www.nasa.gov/nasa-brand-center/images-and-media" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center gap-1">nasa.gov/nasa-brand-center <ExternalLink size={10} /></a>.
                  </p>
                </div>
              </div>

              {/* Crucial Rule Box */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase">
                  <Shield size={16} /> Strict Separation: Visualization vs. Science
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  NASA 3D models and textures in Mission Forge are <strong>visual representations only</strong>.
                  They are never treated as numerical calculation sources. Trajectories are computed using <strong>NASA/JPL Horizons ephemerides</strong>,
                  maneuver velocities use the <strong>Tsiolkovsky Rocket Equation</strong>, and solar powers use <strong>inverse-square radiative flux</strong>.
                </p>
              </div>

              {/* Disclaimer */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1 text-xs text-muted-foreground">
                <div className="font-bold text-white uppercase text-[11px]">NASA Endorsement Disclaimer</div>
                <p>
                  This project was developed for the NASA Space Apps Challenge 2026.
                  The use of NASA 3D Resources and data does not imply endorsement by the National Aeronautics and Space Administration or the United States Government.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
