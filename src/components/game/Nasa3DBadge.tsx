import { useState } from "react";
import { Box, ExternalLink, Info } from "lucide-react";
import { Nasa3DLibraryModal } from "./Nasa3DLibraryModal";
import { getNasa3DAsset } from "../../lib/nasa-3d-registry";

interface Nasa3DBadgeProps {
  assetId?: string | undefined;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
  onClick?: (() => void) | undefined;
  subtle?: boolean | undefined;
}

export function Nasa3DBadge({
  assetId,
  className = "",
  style,
  onClick,
  subtle = false,
}: Nasa3DBadgeProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const asset = assetId ? getNasa3DAsset(assetId) : undefined;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`mf-nasa-3d-badge inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] transition hover:scale-105 active:scale-95 ${className}`}
        style={{
          background: subtle ? "rgba(10, 25, 47, 0.65)" : "rgba(8, 20, 40, 0.88)",
          color: "#7dd3fc",
          border: "1px solid rgba(56, 189, 248, 0.35)",
          backdropFilter: "blur(6px)",
          boxShadow: "0 0 10px rgba(56, 189, 248, 0.15)",
          cursor: "pointer",
          ...style,
        }}
        title={asset ? `${asset.name} · Source: NASA 3D Resources (${asset.organization})` : "View NASA 3D Resources provenance and library"}
      >
        <Box size={11} className="text-cyan-400" />
        <span>SOURCE: NASA 3D RESOURCES</span>
        <Info size={10} className="opacity-70" />
      </button>

      {modalOpen && (
        <Nasa3DLibraryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          initialAssetId={assetId}
        />
      )}
    </>
  );
}
