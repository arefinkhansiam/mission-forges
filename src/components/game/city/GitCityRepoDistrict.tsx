import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { CITY_MATERIALS } from "./city-materials";

// GitCity authentic PBR architectural palette inspired by ethanplusai/gitcity.co
export const GITCITY_MATERIALS = {
  limestone: new THREE.MeshStandardMaterial({
    color: "#BCB6A8",
    roughness: 0.88,
    metalness: 0.15,
  }),
  slateRoof: new THREE.MeshStandardMaterial({
    color: "#424744",
    roughness: 0.85,
    metalness: 0.3,
  }),
  curtainGlass: new THREE.MeshStandardMaterial({
    color: "#64777C",
    roughness: 0.2,
    metalness: 0.8,
    transparent: true,
    opacity: 0.85,
  }),
  nightWindow: new THREE.MeshStandardMaterial({
    color: "#FEF08A",
    emissive: "#EAB308",
    emissiveIntensity: 0.55,
    roughness: 0.3,
  }),
  obsidianTrim: new THREE.MeshStandardMaterial({
    color: "#1E293B",
    roughness: 0.3,
    metalness: 0.8,
  }),
  gitPurple: new THREE.MeshStandardMaterial({
    color: "#8B5CF6",
    emissive: "#7C3AED",
    emissiveIntensity: 0.45,
    roughness: 0.2,
  }),
};

export interface RepoBuildingInfo {
  path: string;
  type: "file" | "dir";
  lines: number;
  complexity: number;
  description: string;
  pos: [number, number, number];
  size: [number, number, number];
}

// Actual source files and directories from ethanplusai/gitcity.co mapped into buildings
export const GITCITY_REPO_BUILDINGS: RepoBuildingInfo[] = [
  {
    path: "src/world/engine.ts",
    type: "file",
    lines: 2840,
    complexity: 94,
    description: "Main 3D simulation loop, camera floor, frame yield & chunk coordinator",
    pos: [0, 0, 10],
    size: [10, 22, 10],
  },
  {
    path: "src/world/architecture.ts",
    type: "file",
    lines: 1450,
    complexity: 82,
    description: "PBR massing, multi-bay rhythmic facades, window fenestration & roof kits",
    pos: [-14, 0, 10],
    size: [8, 16, 9],
  },
  {
    path: "src/world/planned-streets.ts",
    type: "file",
    lines: 980,
    complexity: 65,
    description: "Procedural road grid, crosswalk openings & street parcel allocation",
    pos: [14, 0, 10],
    size: [9, 14, 8],
  },
  {
    path: "src/world/directory-massing.ts",
    type: "file",
    lines: 480,
    complexity: 45,
    description: "Unanalyzed directory volume envelopes & lot instancing",
    pos: [-14, 0, -2],
    size: [7, 11, 7],
  },
  {
    path: "src/world/roof-kit.ts",
    type: "file",
    lines: 390,
    complexity: 38,
    description: "Terrace penthouses, pitched slate roofs & HVAC mechanical units",
    pos: [14, 0, -2],
    size: [7, 10, 7],
  },
  {
    path: "docs/city-game.md",
    type: "file",
    lines: 620,
    complexity: 25,
    description: "Civic co-op design bible, archive courier routes & steward progression",
    pos: [-8, 0, -12],
    size: [9, 9, 8],
  },
  {
    path: "docs/rendering.md",
    type: "file",
    lines: 540,
    complexity: 30,
    description: "Graphics pipeline, instanced buffer geometry & mobile GPU budgets",
    pos: [8, 0, -12],
    size: [9, 8, 8],
  },
];

/**
 * GitCity 3D Repository District
 * Placed on the Forge City map as the dedicated open-source software neighborhood
 */
export function GitCityRepoDistrict({ position = [0, 0, 36] }: { position?: [number, number, number] }) {
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);
  const octocatRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (octocatRef.current) {
      octocatRef.current.rotation.y = state.clock.elapsedTime * 0.8;
      octocatRef.current.position.y = 2.4 + Math.sin(state.clock.elapsedTime * 2.0) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* 1. Neighborhood District Ground & Plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow material={CITY_MATERIALS.plazaConcrete}>
        <planeGeometry args={[48, 40]} />
      </mesh>

      {/* Perimeter Green Courtyards */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-20, 0.025, 0]} receiveShadow material={CITY_MATERIALS.campusGreen}>
        <planeGeometry args={[6, 38]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[20, 0.025, 0]} receiveShadow material={CITY_MATERIALS.campusGreen}>
        <planeGeometry args={[6, 38]} />
      </mesh>

      {/* 2. Central Monument: GitCity Repository Totem */}
      <group position={[0, 0, -3]}>
        {/* Obsidian Pedestal */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow material={GITCITY_MATERIALS.obsidianTrim}>
          <boxGeometry args={[4.5, 1.5, 4.5]} />
        </mesh>
        {/* Glowing Git Purple Core Ring */}
        <mesh position={[0, 1.55, 0]} material={GITCITY_MATERIALS.gitPurple}>
          <cylinderGeometry args={[1.8, 2.0, 0.2, 32]} />
        </mesh>
        {/* Floating Holographic Octocat / Git Emblem */}
        <group ref={octocatRef} position={[0, 2.4, 0]}>
          <mesh material={GITCITY_MATERIALS.gitPurple}>
            <octahedronGeometry args={[0.9, 0]} />
          </mesh>
          <mesh material={GITCITY_MATERIALS.curtainGlass}>
            <sphereGeometry args={[1.2, 16, 16]} />
          </mesh>
        </group>
        {/* Ground Projector Disc */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <ringGeometry args={[2.5, 3.2, 32]} />
          <meshBasicMaterial color="#A78BFA" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 3. Authentic GitCity Procedural Source Buildings */}
      {GITCITY_REPO_BUILDINGS.map((building) => (
        <GitCityBuilding
          key={building.path}
          info={building}
          isHovered={hoveredBuilding === building.path}
          onHover={setHoveredBuilding}
        />
      ))}

      {/* 4. District Street Lamps & Bollards */}
      {[-16, 0, 16].map((x, i) => (
        <group key={`gitlamp-${i}`} position={[x, 0, -18]}>
          <mesh position={[0, 2.2, 0]} material={GITCITY_MATERIALS.obsidianTrim}>
            <cylinderGeometry args={[0.07, 0.1, 4.4, 8]} />
          </mesh>
          <mesh position={[0, 4.3, 0]} material={GITCITY_MATERIALS.nightWindow}>
            <sphereGeometry args={[0.3, 16, 16]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Individual GitCity Building constructed with architectural bays,
 * limestone masonry, curtain glass, window night glow, and roof kits.
 */
function GitCityBuilding({
  info,
  isHovered,
  onHover,
}: {
  info: RepoBuildingInfo;
  isHovered: boolean;
  onHover: (path: string | null) => void;
}) {
  const [w, h, d] = info.size;
  const [x, y, z] = info.pos;

  return (
    <group
      position={[x, y, z]}
      onPointerEnter={() => onHover(info.path)}
      onPointerLeave={() => onHover(null)}
    >
      {/* Structural Limestone Massing Frame */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow material={GITCITY_MATERIALS.limestone}>
        <boxGeometry args={[w, h, d]} />
      </mesh>

      {/* Architectural Bay Window Strips (Front & Back) */}
      <mesh position={[0, h / 2, d / 2 + 0.05]} material={GITCITY_MATERIALS.curtainGlass}>
        <boxGeometry args={[w * 0.82, h * 0.78, 0.1]} />
      </mesh>
      <mesh position={[0, h / 2, -d / 2 - 0.05]} material={GITCITY_MATERIALS.curtainGlass}>
        <boxGeometry args={[w * 0.82, h * 0.78, 0.1]} />
      </mesh>

      {/* Warm Night Window Grid Panels */}
      <mesh position={[0, h / 2, d / 2 + 0.08]} material={GITCITY_MATERIALS.nightWindow}>
        <boxGeometry args={[w * 0.65, h * 0.55, 0.05]} />
      </mesh>

      {/* Roof Parapet & Terrace Slate Kit */}
      <mesh position={[0, h + 0.35, 0]} material={GITCITY_MATERIALS.slateRoof}>
        <boxGeometry args={[w + 0.3, 0.7, d + 0.3]} />
      </mesh>

      {/* Rooftop HVAC Mechanical Unit / Antenna */}
      <mesh position={[0, h + 1.1, 0]} material={GITCITY_MATERIALS.obsidianTrim}>
        <boxGeometry args={[w * 0.35, 1.2, d * 0.35]} />
      </mesh>
      <mesh position={[w * 0.25, h + 2.5, d * 0.2]} material={CITY_MATERIALS.gantrySteel}>
        <cylinderGeometry args={[0.05, 0.08, 3.5, 8]} />
      </mesh>

      {/* Hologram Signage Over Building Entrance */}
      <mesh position={[0, 1.5, d / 2 + 0.25]}>
        <boxGeometry args={[w * 0.7, 0.6, 0.1]} />
        <meshStandardMaterial
          color={isHovered ? "#38BDF8" : "#8B5CF6"}
          emissive={isHovered ? "#38BDF8" : "#7C3AED"}
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}
