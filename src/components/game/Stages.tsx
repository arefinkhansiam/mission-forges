import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, Sparkles, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Nasa3DModel } from "./Nasa3DModel";
import { Surface, useReducedMotion } from "./Presentation";
import type { OrbitControls as OrbitControlType } from "three-stdlib";
import { BODIES } from "../../lib/nasa-data";
import { landingStages, MISSIONS, type Design } from "../../lib/mission-sim";
import { designOf, useMissionStore } from "../../stores/mission-store";
import { Flame, Spacecraft, getMissionModel } from "./Spacecraft";
import { rt, useTick } from "./runtime";

function Studio() {
  return (
    <Environment resolution={128}>
      <Lightformer intensity={2.5} position={[0, 6, 2]} scale={[10, 4, 1]} color="#cfe6ff" />
      <Lightformer intensity={1.2} position={[-6, 1, -2]} rotation-y={Math.PI / 2} scale={[12, 2, 1]} color="#5b8fd6" />
      <Lightformer intensity={0.8} position={[6, 0, 2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} color="#ffd9a8" />
    </Environment>
  );
}

// ---------- Hangar / build ----------
export function BuildScene() {
  const s = useMissionStore();
  const d = designOf(s);
  const reduced = useReducedMotion();
  const controls = useRef<OrbitControlType>(null);
  const ref = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useEffect(() => {
    const reset = () => {
      camera.position.set(4.8, 2.8, 6.8);
      controls.current?.target.set(0.35, -0.25, 0);
      controls.current?.update();
    };
    reset();
    const move = (event: Event) => {
      const action = (event as CustomEvent<string>).detail,
        c = controls.current;
      if (!c) return;
      if (action === "reset") {
        reset();
        return;
      }
      const offset = camera.position.clone().sub(c.target);
      if (action === "left" || action === "right")
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), action === "left" ? -0.25 : 0.25);
      else offset.multiplyScalar(action === "in" ? 0.85 : 1.15).clampLength(4, 12);
      camera.position.copy(c.target).add(offset);
      c.update();
    };
    window.addEventListener("mf-camera", move);
    return () => window.removeEventListener("mf-camera", move);
  }, [camera]);

  return (
    <>
      <color attach="background" args={["#010309"]} />
      <fog attach="fog" args={["#010309", 14, 38]} />
      <Studio />
      <ambientLight intensity={0.5} color="#0f172a" />
      <directionalLight position={[4, 6, 3]} intensity={3.6} color="#fffbf0" />
      <directionalLight position={[-6, 2, -4]} intensity={2.4} color="#00f0ff" />
      <pointLight position={[0, -1.8, 0]} intensity={18} distance={6} color="#00f0ff" />

      {/* Primary Authentic NASA Spacecraft Model for the selected mission */}
      <group ref={ref} rotation-z={0.12}>
        <Spacecraft design={d} deploy={1} targetSize={3.2} />
      </group>

      <gridHelper args={[32, 32, "#00f0ff", "#0a1d3b"]} position-y={-2.42} />
      <mesh position-y={-2.4} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[4.2, 64]} />
        <meshStandardMaterial color="#050d1e" metalness={0.92} roughness={0.2} />
      </mesh>
      <mesh position-y={-2.39} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[2.5, 2.56, 96]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
      <mesh position-y={-2.39} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[3.8, 3.84, 96]} />
        <meshBasicMaterial color="#a855f7" />
      </mesh>
      <OrbitControls
        ref={controls}
        makeDefault
        enablePan={false}
        autoRotate={!reduced && s.phase === "craft"}
        autoRotateSpeed={0.35}
        minDistance={4}
        maxDistance={14}
        target={[0.35, -0.25, 0]}
      />
    </>
  );
}

// ---------- Launch (Authentic NASA Saturn V + Staging & Separation + 3D Earth + ISS) ----------
const LIFTOFF = 10,
  SRB_SEP = 18,
  FAIRING_SEP = 23,
  CORE_SEP = 27,
  ORBIT = 32;

export const launchProfile = (t: number) => {
  const real = Math.max(0, t - LIFTOFF) * 20,
    f = Math.min(1, real / 480);
  return { altKm: 162 * Math.pow(f, 1.6), velKms: 7.8 * Math.pow(f, 1.3), real };
};

function SpaceportLaunchCity() {
  const s = useMissionStore();
  const groundTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    g.fillStyle = "#2d4427";
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 400; i++) {
      g.fillStyle = `rgba(${35 + Math.random() * 25},${60 + Math.random() * 35},30,0.6)`;
      g.fillRect(Math.random() * 256, Math.random() * 256, 6, 6);
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(40, 40);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  const t = rt.launchT;
  const isIgnited = t > LIFTOFF - 6.6 && t < LIFTOFF + 10;

  return (
    <group>
      {/* 1. Coastal Spaceport Ground Terrain */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.01}>
        <planeGeometry args={[1200, 1200]} />
        <meshStandardMaterial map={groundTex} roughness={0.95} />
      </mesh>

      {/* Atlantic Ocean Coastline (East) */}
      <mesh rotation-x={-Math.PI / 2} position={[240, 0.05, 0]}>
        <planeGeometry args={[400, 1200]} />
        <meshStandardMaterial color="#0c2540" roughness={0.12} metalness={0.85} />
      </mesh>
      {/* Coastline Beach / Sand Berm */}
      <mesh rotation-x={-Math.PI / 2} position={[38, 0.06, 0]}>
        <planeGeometry args={[8, 1200]} />
        <meshStandardMaterial color="#c2b280" roughness={0.9} />
      </mesh>

      {/* Dual-lane Crawler-way from VAB to Pad */}
      <mesh rotation-x={-Math.PI / 2} position={[-28, 0.08, -35]} rotation-z={Math.PI / 5}>
        <planeGeometry args={[18, 120]} />
        <meshStandardMaterial color="#4a483e" roughness={0.92} />
      </mesh>

      {/* Support Roadways */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.07, 16]}>
        <planeGeometry args={[8, 80]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* 2. Launch Complex Pad 39A Platform */}
      {/* Octagonal Concrete Mount */}
      <mesh position-y={0.5}>
        <cylinderGeometry args={[12, 13.5, 1.0, 8]} />
        <meshStandardMaterial color="#57606e" roughness={0.88} />
      </mesh>
      {/* Concrete Upper Platform & Flame Trench */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[11, 0.4, 11]} />
        <meshStandardMaterial color="#3f4754" roughness={0.9} />
      </mesh>
      {/* Flame Exhaust Trench (Scorched Pit) */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[4.5, 1.2, 8]} />
        <meshStandardMaterial color="#0f172a" roughness={1} />
      </mesh>

      {/* Red Steel Launch Umbilical Tower (LUT) */}
      <group position={[-3.6, 1.2, 0]}>
        {/* Main 4 Lattice Columns */}
        {[
          [-0.8, -0.8],
          [0.8, -0.8],
          [-0.8, 0.8],
          [0.8, 0.8],
        ].map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x!, 11, z!]}>
            <boxGeometry args={[0.16, 22, 0.16]} />
            <meshStandardMaterial color="#b91c1c" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}

        {/* 18 Horizontal Catwalk Platforms & Cross Struts */}
        {Array.from({ length: 18 }, (_, i) => (
          <group key={i} position-y={i * 1.2}>
            <mesh>
              <boxGeometry args={[1.7, 0.08, 1.7]} />
              <meshStandardMaterial color="#991b1b" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Yellow Safety Railing */}
            <mesh position-y={0.25}>
              <boxGeometry args={[1.75, 0.45, 1.75]} />
              <meshStandardMaterial color="#eab308" wireframe transparent opacity={0.65} />
            </mesh>
          </group>
        ))}

        {/* Swing Service Arms to Rocket */}
        {[3.5, 7.5, 12.0, 16.5].map((y, idx) => (
          <group key={idx} position={[0.7, y, 0]}>
            <mesh position={[1.3, 0, 0]}>
              <boxGeometry args={[2.4, 0.18, 0.28]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.6} />
            </mesh>
          </group>
        ))}

        {/* Apollo Crew Access Arm (White Room) at 17.5m */}
        <group position={[0.7, 17.5, 0]}>
          <mesh position={[1.6, 0, 0]}>
            <boxGeometry args={[2.8, 0.35, 0.55]} />
            <meshStandardMaterial color="#ffffff" metalness={0.4} />
          </mesh>
          {/* White Room enclosure */}
          <mesh position={[2.9, 0.2, 0]}>
            <boxGeometry args={[0.7, 0.7, 0.7]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Top Hammerhead Crane Derrick */}
        <group position={[0, 22.2, 0]}>
          <mesh position={[0.5, 0.8, 0]}>
            <boxGeometry args={[3.2, 0.3, 0.3]} />
            <meshStandardMaterial color="#b91c1c" />
          </mesh>
          <mesh position={[0, 1.4, 0]}>
            <boxGeometry args={[0.2, 1.0, 0.2]} />
            <meshStandardMaterial color="#b91c1c" />
          </mesh>
        </group>
      </group>

      {/* 4 Perimeter White Lightning Mast Towers */}
      {[
        [15, 15],
        [-15, 15],
        [15, -15],
        [-15, -15],
      ].map(([x, z]) => (
        <group key={`${x}${z}`} position={[x!, 0, z!]}>
          <mesh position-y={14}>
            <cylinderGeometry args={[0.15, 0.8, 28, 8]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.7} />
          </mesh>
          {/* Lightning Rod Apex */}
          <mesh position-y={28.8}>
            <cylinderGeometry args={[0.04, 0.15, 1.8, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
          {/* Warning beacon */}
          <pointLight position={[0, 29, 0]} intensity={1.5} distance={15} color="#ef4444" />
        </group>
      ))}

      {/* Cryogenic Storage Tanks (LH2 & LOX Spherical Dewars) */}
      {[
        [-24, -10],
        [24, -10],
      ].map(([x, z], idx) => (
        <group key={idx} position={[x!, 0, z!]}>
          <mesh position-y={3.2}>
            <sphereGeometry args={[3.2, 32, 24]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.4} />
          </mesh>
          {/* Support Legs */}
          {[-1.8, 1.8].map((lx) => (
            <mesh key={lx} position={[lx, 1.2, 0]}>
              <cylinderGeometry args={[0.15, 0.2, 2.5, 8]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
          ))}
        </group>
      ))}

      {/* 3. VIP Observation Deck & 3D Character */}
      <group position={[11, 0, 13]}>
        {/* Steel Gantry Platform */}
        <mesh position-y={1.5}>
          <boxGeometry args={[4.5, 3.0, 4.5]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
        {/* Platform Deck Floor */}
        <mesh position-y={3.05}>
          <boxGeometry args={[4.8, 0.1, 4.8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        {/* Yellow Safety Railings */}
        <mesh position-y={3.55}>
          <boxGeometry args={[4.8, 0.9, 4.8]} />
          <meshStandardMaterial color="#eab308" wireframe transparent opacity={0.7} />
        </mesh>
        {/* Observation Radar & Telescope */}
        <mesh position={[1.5, 3.6, 1.5]}>
          <cylinderGeometry args={[0.08, 0.1, 1.0]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        <mesh position={[1.5, 4.2, 1.5]} rotation-x={0.4}>
          <cylinderGeometry args={[0.15, 0.12, 0.7]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>

        {/* 3D Character Model (Flight Commander on Viewing Deck) */}
        <group position={[0, 3.1, 0]} rotation={[0, -Math.PI * 0.7, 0]}>
          <Nasa3DModel
            modelUrl="/models/citizen-male.glb"
            targetSize={1.85}
            autoRotate={false}
          />
        </group>
      </group>

      {/* Support Spaceport Vehicle */}
      <group position={[-7.5, 0.1, 18]} rotation={[0, Math.PI / 4, 0]}>
        <Nasa3DModel
          modelUrl="/models/city-car.glb"
          targetSize={3.2}
          autoRotate={false}
        />
      </group>

      {/* 4. Space Coast Launch City & VAB in Background */}
      {/* Massive Vehicle Assembly Building (VAB) */}
      <group position={[-65, 0, -85]}>
        {/* Main Monolith Hangar */}
        <mesh position-y={20}>
          <boxGeometry args={[42, 40, 32]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.65} />
        </mesh>
        {/* High-Bay Rollup Doors */}
        <mesh position={[0, 16, 16.1]}>
          <boxGeometry args={[14, 32, 0.2]} />
          <meshStandardMaterial color="#475569" roughness={0.8} />
        </mesh>
        {/* NASA Insignia Blue Circle / Banner */}
        <mesh position={[-10, 28, 16.2]}>
          <circleGeometry args={[4.2, 32]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
      </group>

      {/* Launch Control Center (LCC) */}
      <group position={[-38, 0, -75]}>
        <mesh position-y={6}>
          <boxGeometry args={[18, 12, 12]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        {/* Control Windows */}
        <mesh position={[0, 8.5, 6.1]} rotation-x={-0.2}>
          <boxGeometry args={[16, 2.5, 0.2]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>

      {/* Distant Spaceport City Skyline */}
      {[
        [-110, -140, 22, 50, 18],
        [-85, -150, 18, 38, 18],
        [-125, -165, 20, 62, 22],
        [-60, -145, 16, 32, 16],
        [-140, -135, 18, 44, 20],
        [-40, -160, 24, 28, 20],
      ].map(([x, z, w, h, d], i) => (
        <group key={i} position={[x!, 0, z!]}>
          <mesh position-y={h! / 2}>
            <boxGeometry args={[w!, h!, d!]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>
          {/* Lit Windows */}
          <mesh position={[0, h! / 2, d! / 2 + 0.1]}>
            <planeGeometry args={[w! * 0.8, h! * 0.7]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} />
          </mesh>
          {/* Rooftop Antenna with Warning Light */}
          <mesh position={[0, h! + 3, 0]}>
            <cylinderGeometry args={[0.08, 0.15, 6]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          <pointLight position={[0, h! + 6, 0]} intensity={1.2} distance={20} color="#f59e0b" />
        </group>
      ))}

      {/* Communication Tracking Radar Dish */}
      <group position={[28, 0, -45]}>
        <mesh position-y={2.5}>
          <cylinderGeometry args={[0.4, 0.6, 5]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, 6, 0]} rotation-x={0.4}>
          <sphereGeometry args={[3.2, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
          <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Cryogenic Liquid Hydrogen & Oxygen Storage Spheres */}
      <group position={[-22, 0, 16]}>
        <mesh position-y={3.8}>
          <sphereGeometry args={[3.8, 32, 32]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Support Steel Cradle Leg Columns */}
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((ang, i) => (
          <mesh key={i} position={[Math.cos(ang) * 3.5, 1.8, Math.sin(ang) * 3.5]}>
            <cylinderGeometry args={[0.2, 0.25, 3.6]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        ))}
        {/* LH2 Safety Perimeter Label */}
        <mesh position={[0, 0.08, 0]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[4.2, 4.4, 32]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
      </group>

      {/* LOX Propellant Sphere (East Sector) */}
      <group position={[24, 0, 18]}>
        <mesh position-y={3.2}>
          <sphereGeometry args={[3.2, 32, 32]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.25} />
        </mesh>
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((ang, i) => (
          <mesh key={i} position={[Math.cos(ang) * 3.0, 1.5, Math.sin(ang) * 3.0]}>
            <cylinderGeometry args={[0.18, 0.22, 3.0]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        ))}
      </group>

      {/* Space City Animated Transport Vehicle Traffic */}
      <SpaceCityVehicles />

      {/* Realistic Volumetric Billowing Launch Gas Clouds & Exhaust Steam */}
      <BillowingLaunchGasClouds isIgnited={isIgnited} launchT={t} />
    </group>
  );
}

function SpaceCityVehicles() {
  const carRef1 = useRef<THREE.Group>(null);
  const carRef2 = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (carRef1.current) {
      carRef1.current.position.z = 50 - ((t * 9) % 95);
    }
    if (carRef2.current) {
      carRef2.current.position.z = -15 - ((t * 7) % 75);
    }
  });

  return (
    <>
      <group ref={carRef1} position={[3.5, 0.1, 20]}>
        <Nasa3DModel modelUrl="/models/city-car.glb" targetSize={2.8} autoRotate={false} />
      </group>
      <group ref={carRef2} position={[-24, 0.1, -25]} rotation={[0, Math.PI / 4, 0]}>
        <Nasa3DModel modelUrl="/models/suv.glb" targetSize={3.2} autoRotate={false} />
      </group>
    </>
  );
}

function BillowingLaunchGasClouds({ isIgnited, launchT }: { isIgnited: boolean; launchT: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || !isIgnited) return;
    const t = clock.getElapsedTime();
    const children = groupRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const mesh = children[i] as THREE.Mesh;
      if (!mesh || !mesh.scale) continue;
      mesh.rotation.x = t * 0.35 + i * 0.2;
      mesh.rotation.y = t * 0.25 + i * 0.3;
      const s = 1.0 + Math.sin(t * 2.2 + i * 0.5) * 0.25;
      mesh.scale.set(s, s * 1.15, s);
    }
  });

  if (!isIgnited) return null;

  return (
    <group ref={groupRef} position={[0, 0.6, 0]}>
      {/* Intense Launch Trench Flame Glow Light */}
      <pointLight position={[0, 1.2, 0]} intensity={45} distance={32} color="#ff8800" />
      <pointLight position={[0, 4, 0]} intensity={25} distance={28} color="#ffd27d" />

      {/* Primary Expanding Blast Exhaust Puffs out of Flame Trench */}
      {Array.from({ length: 32 }, (_, i) => {
        const isNorth = i % 2 === 0;
        const angle = isNorth ? (Math.PI * 0.38 + (i * 0.12)) : (Math.PI * 1.38 + (i * 0.12));
        const dist = 3.2 + (i % 7) * 2.0;
        const x = Math.cos(angle) * dist + (Math.sin(i * 2.5) * 1.6);
        const z = Math.sin(angle) * dist * 1.45;
        const y = 0.8 + (i % 6) * 1.3;
        const scale = 2.6 + (i % 4) * 1.3;

        return (
          <mesh key={i} position={[x, y, z]} scale={scale}>
            <sphereGeometry args={[1.6, 16, 16]} />
            <meshStandardMaterial
              color={y < 2.8 ? "#ffeedd" : "#ffffff"}
              transparent
              opacity={Math.max(0.2, 0.72 - (dist / 24))}
              roughness={0.95}
              emissive={y < 2.8 ? "#ff5500" : "#1e293b"}
              emissiveIntensity={y < 2.8 ? 0.4 : 0.05}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function RocketSeparationSequence({
  t,
  craftDesign,
  deploy,
}: {
  t: number;
  craftDesign: Design;
  deploy: number;
}) {
  // Fairing Jettison: starts at t = 23
  const fairingProgress = Math.max(0, Math.min(1, (t - 23) / 3.5));
  const fairingX = fairingProgress * 3.6;
  const fairingZ = fairingProgress * 1.6;
  const fairingRot = fairingProgress * 0.45;
  const fairingVisible = t >= 23 && t < 40;

  // Spacecraft Separation from Rocket Booster: starts at t = 27
  const sepProgress = Math.max(0, Math.min(1, (t - 27) / 4.5));
  const boosterDrop = Math.pow(sepProgress, 1.8) * 16;
  const craftPush = sepProgress * 1.8;

  return (
    <group>
      {/* Separating Upper Stage Rocket Booster drifting backwards */}
      {t < 42 && (
        <group position={[0, -boosterDrop, 0]}>
          {/* Rocket Upper Stage Payload Adapter Ring & Interstage */}
          <group position={[0, 4.2, 0]}>
            <mesh>
              <cylinderGeometry args={[1.3, 1.45, 1.6, 32, 1, true]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[1.22, 1.25, 1.0, 32]} />
              <meshStandardMaterial color="#c29b38" metalness={0.85} roughness={0.25} />
            </mesh>
          </group>

          {/* S-IVB Main Tank Cylinder */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[1.45, 1.5, 4.4, 32]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.35} />
          </mesh>

          {/* J-2 Engine Bell with Residual Thermal Glow */}
          <group position={[0, -1.8, 0]}>
            <mesh rotation-x={Math.PI}>
              <coneGeometry args={[0.75, 1.6, 24, 1, true]} />
              <meshStandardMaterial
                color="#1e293b"
                emissive="#ff4400"
                emissiveIntensity={Math.max(0, 1 - (t - 27) * 0.2)}
                metalness={0.9}
                roughness={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>

          {/* Separation Gas Sparkles & Thruster Puffs */}
          {t >= 27 && t < 32 && (
            <Sparkles
              count={60}
              scale={[2.5, 1.5, 2.5]}
              position={[0, 4.2, 0]}
              size={12}
              speed={3}
              color="#38bdf8"
            />
          )}
        </group>
      )}

      {/* Jettisoned Aerodynamic Payload Fairing Halves splitting and rotating away */}
      {fairingVisible && (
        <group position={[0, 7.8, 0]}>
          {/* Port (Left) Fairing Half */}
          <group
            position={[-fairingX, -fairingProgress * 2.0, -fairingZ]}
            rotation={[0, 0, fairingRot]}
          >
            <mesh>
              <cylinderGeometry args={[0.1, 1.45, 4.0, 24, 1, true, 0, Math.PI]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.2} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, 0.05]}>
              <planeGeometry args={[0.5, 1.0]} />
              <meshBasicMaterial color="#0284c7" />
            </mesh>
          </group>

          {/* Starboard (Right) Fairing Half */}
          <group
            position={[fairingX, -fairingProgress * 2.0, -fairingZ]}
            rotation={[0, 0, -fairingRot]}
          >
            <mesh>
              <cylinderGeometry args={[0.1, 1.45, 4.0, 24, 1, true, Math.PI, Math.PI]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.2} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, -0.05]} rotation-y={Math.PI}>
              <planeGeometry args={[0.5, 1.0]} />
              <meshBasicMaterial color="#0284c7" />
            </mesh>
          </group>
        </group>
      )}

      {/* Spacecraft: Extracts out from the booster adapter ring */}
      <group position={[0, 5.8 + craftPush, 0]}>
        <Spacecraft design={craftDesign} deploy={deploy} targetSize={2.8} />

        {/* Cold-Gas RCS Attitude Control & Separation Puffs */}
        {t >= 27 && t < 31 && (
          <group position={[0, -0.7, 0]}>
            <Sparkles count={40} scale={[1.8, 0.8, 1.8]} size={10} speed={4} color="#7dd3fc" />
          </group>
        )}
      </group>
    </group>
  );
}

export function LaunchScene() {
  useTick(10);
  const reduced = useReducedMotion();
  const s = useMissionStore();
  const d = designOf(s);
  const stack = useRef<THREE.Group>(null);
  const separationGroup = useRef<THREE.Group>(null);
  const orion = useRef<THREE.Group>(null);
  const { camera, scene } = useThree();
  const sky = useMemo(() => ({ a: new THREE.Color("#7fb2e6"), b: new THREE.Color("#01040c"), c: new THREE.Color() }), []);
  const said = useRef(new Set<string>());

  useEffect(() => {
    rt.launchT = 0;
    said.current.clear();
    camera.position.set(10, 5, 16);
  }, [camera]);

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    rt.launchT += dt;
    const t = rt.launchT;
    const st = useMissionStore.getState();
    const once = (k: string, msg: string, tone: "info" | "ok" | "warn" = "info") => {
      if (!said.current.has(k)) {
        said.current.add(k);
        st.say(msg, tone);
      }
    };

    if (t > 2) once("fuel", "Propellant loading complete — Saturn V pressurized");
    if (t > LIFTOFF - 6.6) once("ign", "Main engine ignition sequence start (5× F-1)", "warn");
    if (t > LIFTOFF) once("lift", "All engines running! Liftoff of Saturn V!", "ok");
    if (t > SRB_SEP) once("srb", "First stage S-IC cutoff & staging", "ok");
    if (t > FAIRING_SEP) once("fairing", "Payload fairing jettison confirmed — spacecraft exposed", "ok");
    if (t > CORE_SEP) once("core", "Spacecraft separation from upper stage — spring pushers engaged", "ok");
    if (t > ORBIT) once("orb", "Orbit insertion achieved! Solar arrays deploying in Low Earth Orbit", "ok");

    const inOrbit = t > ORBIT;
    const isSeparating = t >= FAIRING_SEP && t <= ORBIT + 3;
    const lt = Math.max(0, t - LIFTOFF);
    const y = 0.35 * lt * lt;
    const alt = Math.min(1, y / 300);

    sky.c.copy(sky.a).lerp(sky.b, alt);
    scene.background = inOrbit ? sky.b : sky.c;
    scene.fog = inOrbit ? null : new THREE.Fog(sky.c, 60, 400 + y);
    rt.thrust = t > LIFTOFF - 6.6 && t < CORE_SEP ? 1 : 0;

    if (stack.current) {
      stack.current.visible = t < FAIRING_SEP;
      stack.current.position.y = y;
      stack.current.rotation.z = -Math.min(0.4, lt * lt * 0.0012);
    }

    if (separationGroup.current) {
      separationGroup.current.visible = isSeparating;
      separationGroup.current.position.y = y;
      separationGroup.current.rotation.z = -Math.min(0.4, lt * lt * 0.0012);
    }

    if (orion.current) {
      orion.current.visible = inOrbit && !isSeparating;
    }

    const shake = !reduced && rt.thrust ? (t < LIFTOFF + 6 ? 0.09 : 0.035) : 0;
    if (t < FAIRING_SEP && stack.current) {
      const target = stack.current.position.clone().add(new THREE.Vector3(0, 7, 0));
      const want = t < LIFTOFF ? new THREE.Vector3(10, 5, 17) : target.clone().add(new THREE.Vector3(9 + lt * 0.2, -3, 15));
      camera.position.lerp(want, 1 - Math.exp(-2 * dt));
      camera.position.x += (Math.random() - 0.5) * shake;
      camera.position.y += (Math.random() - 0.5) * shake;
      camera.lookAt(target);
    } else if (isSeparating && separationGroup.current) {
      // Smooth cinematic camera focusing directly on the separating spacecraft & fairings
      const sepTarget = separationGroup.current.position.clone().add(new THREE.Vector3(0, 7, 0));
      const sepWant = sepTarget.clone().add(new THREE.Vector3(5.5, 2.5, 7.5));
      camera.position.lerp(sepWant, 1 - Math.exp(-2.5 * dt));
      camera.lookAt(sepTarget);
    } else if (orion.current) {
      camera.position.lerp(new THREE.Vector3(4.2, 1.8, 6.2), 1 - Math.exp(-2 * dt));
      camera.lookAt(0, 0, 0);
      rt.launchT = Math.min(rt.launchT, ORBIT + 60);
    }
  });

  const deploy = Math.max(0, Math.min(1, (rt.launchT - ORBIT) / 4));

  return (
    <>
      <color attach="background" args={["#7fb2e6"]} />
      <hemisphereLight args={["#cfe6ff", "#3f5a32", 0.9]} />
      <directionalLight position={[30, 50, 20]} intensity={2.6} color="#fff1d8" />
      <Studio />
      <Stars radius={300} depth={50} count={3500} factor={6} fade />

      {/* Ground Spaceport & Launchpad Complex */}
      <group>{rt.launchT < FAIRING_SEP && <SpaceportLaunchCity />}</group>

      {/* Authentic NASA Saturn V Rocket Ascent Stack */}
      <group ref={stack}>
        <group position-y={8}>
          <Nasa3DModel modelUrl="/models/saturn-v.glb" targetSize={15} autoRotate={false} />
        </group>

        {/* F-1 Engine Cluster Exhaust Plume */}
        {rt.thrust > 0 && (
          <group position-y={0.5}>
            <Flame power={rt.thrust} y={0} length={9} radius={0.85} />
            <Sparkles count={200} scale={[4, 8, 4]} position-y={-3} size={25} speed={4} color="#ffaa33" />
          </group>
        )}

        {/* Launchpad ignition smoke */}
        {rt.launchT > LIFTOFF - 3 && rt.launchT < LIFTOFF + 8 && (
          <Sparkles count={150} scale={[14, 4, 14]} position-y={0.8} size={28} speed={2} color="#e8e0d6" opacity={0.8} />
        )}
      </group>

      {/* Rocket Separation Sequence (Fairings Jettison & Spacecraft Extraction from Booster) */}
      <group ref={separationGroup} visible={false}>
        <RocketSeparationSequence t={rt.launchT} craftDesign={d} deploy={deploy} />
      </group>

      {/* Orbit Insertion: 3D Earth Globe + Authentic Spacecraft + ISS */}
      <group ref={orion} visible={false}>
        {/* Rotating 3D Blue Marble Earth */}
        <group position={[0, -18, -10]} rotation-y={rt.launchT * 0.04}>
          <Surface body="Earth" radius={15} />
        </group>
        {/* Atmospheric Blue Glow */}
        <mesh position={[0, -18, -10]} scale={1.025}>
          <sphereGeometry args={[15, 48, 24]} />
          <meshBasicMaterial color="#7fc0ff" transparent opacity={0.22} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* Authentic NASA Spacecraft Deployed in Orbit */}
        <group rotation-z={0.3} position={[0, 0, 0]}>
          <Spacecraft design={d} deploy={deploy} targetSize={2.8} />
        </group>

        {/* Authentic 3D International Space Station (ISS) in background LEO */}
        <group position={[6, 3, -5]} rotation={[0.3, 0.8, 0.2]}>
          <Nasa3DModel modelUrl="/models/iss.glb" targetSize={3.8} autoRotate={true} rotationSpeed={0.15} />
        </group>
      </group>
    </>
  );
}

// ---------- Rescue rendezvous / docking with International Space Station (ISS) ----------
export function DockingScene() {
  useTick(10);
  const s = useMissionStore();
  const d = designOf(s);
  const rescue = useRef<THREE.Group>(null);
  const target = useRef<THREE.Group>(null);
  const rescueDesign = useMemo<Design>(
    () => ({
      ...d,
      engine: "chemical",
      engines: 1,
      tanks: 2,
      wings: 4,
      rtgs: 0,
      antennas: 2,
      shield: false,
      battery: true,
      instruments: [],
    }),
    [d]
  );
  const { camera } = useThree();
  const said = useRef(new Set<string>());

  useEffect(() => {
    rt.launchT = 0;
    said.current.clear();
    camera.position.set(7, 3, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    rt.launchT = Math.min(24, rt.launchT + dt);
    const t = rt.launchT;
    const st = useMissionStore.getState();
    const once = (k: string, m: string) => {
      if (!said.current.has(k)) {
        said.current.add(k);
        st.say(m, "ok");
      }
    };

    if (t > 0.5) once("a", "Rendezvous radar locked: International Space Station (ISS)");
    if (t > 6) once("b", "Approaching ISS Harmony docking port — matching orbital velocity");
    if (t > 11) once("c", "Soft capture confirmed — hard-docked to ISS");
    if (t > 13) once("d", "Canadarm robotic repair and component diagnostics in progress");
    if (t >= 24) {
      once("e", "Orbital repairs complete — avionics, fuel valves and power restored!");
      if (!st.rescued) st.set({ rescued: true });
    }

    const spin = Math.max(0, 1 - t / 8);
    if (target.current) target.current.rotation.y += dt * 0.1 * spin;
    if (rescue.current) rescue.current.position.y = 2.0 + Math.max(0, 9 - t) * 1.3;
  });

  const repairing = rt.launchT > 13 && rt.launchT < 24;

  return (
    <>
      <color attach="background" args={["#010308"]} />
      <Stars radius={120} depth={50} count={4500} factor={4} fade />
      <Studio />
      <ambientLight intensity={0.25} />
      <directionalLight position={[8, 5, 6]} intensity={2.8} color="#fff4e0" />

      {/* 3D Earth Globe Rotating in LEO Background */}
      <group position={[-5, -15, -20]} rotation-y={rt.launchT * 0.03}>
        <Surface body="Earth" radius={15} />
      </group>
      <mesh position={[-5, -15, -20]} scale={1.02}>
        <sphereGeometry args={[15, 48, 24]} />
        <meshBasicMaterial color="#7fc0ff" transparent opacity={0.2} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Authentic NASA 3D International Space Station (Target Docking Station) */}
      <group ref={target} position={[0, 0, 0]}>
        <Nasa3DModel modelUrl="/models/iss.glb" targetSize={4.6} autoRotate={false} />
      </group>

      {/* Approaching NASA Spacecraft */}
      <group ref={rescue} rotation-z={Math.PI}>
        <Spacecraft design={rescueDesign} deploy={1} variant="rescue" thrust={rt.launchT < 10 ? 0.35 : 0} targetSize={2.2} />
      </group>

      {/* Robotic Arm Repair Sparkles */}
      {repairing && (
        <Sparkles count={80} scale={[1.6, 1.6, 1.6]} position={[0.4, 0.2, 0.4]} size={8} speed={3.5} color="#ffd48a" />
      )}

      <OrbitControls makeDefault enablePan={false} minDistance={3} maxDistance={18} />
    </>
  );
}

// ---------- Landing / probe entry with Authentic NASA Landers ----------
export function LandingScene() {
  useTick(10);
  const s = useMissionStore();
  const d = designOf(s);
  const body = BODIES[MISSIONS[s.mission].body];
  const stages = landingStages(body.id);
  const lander = useRef<THREE.Group>(null);
  const chute = useRef<THREE.Group>(null);

  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const g = c.getContext("2d")!;
    g.fillStyle = body.color;
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 900; i++) {
      g.fillStyle = i % 3 ? body.color2 : "#ffffff";
      g.globalAlpha = 0.05 + Math.random() * 0.15;
      g.beginPath();
      g.arc(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 18, 0, 7);
      g.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(12, 12);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [body]);

  const gas = body.atmosphere === "gas";
  const terrain = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(260, 260, 72, 72);
    const positions = geometry.getAttribute("position");
    if (positions) {
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i),
          y = positions.getY(i);
        const edge = THREE.MathUtils.smoothstep(Math.hypot(x, y), 6, 35);
        positions.setZ(i, edge * (Math.sin(x * 0.055 + 1) * Math.cos(y * 0.072) * 5 + Math.sin(x * 0.14 + y * 0.09) * 1.5));
      }
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  useEffect(() => () => {
    tex.dispose();
    terrain.dispose();
  }, [tex, terrain]);

  const skyCol =
    body.atmosphere === "none" ? "#010206" : gas ? body.color2 : body.id === "Mars" ? "#c79a72" : "#8ab8e6";
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(8, 6, 12);
  }, [camera]);

  useFrame(({ clock }, raw) => {
    const dt = Math.min(raw, 0.05),
      st = useMissionStore.getState();
    const f = st.landing / stages.length;
    const want = gas ? 30 - f * 40 : 40 * (1 - f) + 0.55 * (f >= 1 ? 1 : 0);
    const g = lander.current;
    if (!g) return;
    g.position.y = THREE.MathUtils.damp(g.position.y, Math.max(gas ? -20 : 0.55, want), 1.5, dt);
    g.rotation.z = Math.sin(clock.elapsedTime * 0.7) * 0.03 * (1 - f);
    const name = stages[st.landing - 1] ?? "";
    if (chute.current)
      chute.current.visible = name.startsWith("Parachute") || ((stages[st.landing] ?? "").startsWith("Heat") && st.landing > 2 && gas);
    rt.thrust = /Powered|Braking|Terminal|Deorbit/.test(name) ? 1 : 0;
    camera.position.lerp(new THREE.Vector3(g.position.x + 7, g.position.y + 3, g.position.z + 10), 1 - Math.exp(-1.5 * dt));
    camera.lookAt(g.position);
  });

  return (
    <>
      <color attach="background" args={[skyCol]} />
      <fog attach="fog" args={[skyCol, 20, gas ? 90 : 220]} />
      {body.atmosphere === "none" && <Stars radius={150} depth={40} count={3000} factor={4} fade />}
      <hemisphereLight args={[skyCol, body.color2, 0.8]} />
      <directionalLight position={[20, 30, 10]} intensity={2.4} color="#fff1dc" />
      {gas ? (
        [0, -12, -24].map((y, i) => (
          <mesh key={y} position-y={y} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[400, 400]} />
            <meshStandardMaterial
              map={tex}
              transparent
              opacity={0.55 + i * 0.15}
              color={i % 2 ? body.color : "#f4e4c8"}
            />
          </mesh>
        ))
      ) : (
        <>
          <mesh rotation-x={-Math.PI / 2} geometry={terrain}>
            <meshStandardMaterial map={tex} roughness={1} />
          </mesh>
          {Array.from({ length: 40 }, (_, i) => (
            <mesh
              key={i}
              position={[Math.sin(i * 12.9) * 40, 0.2, Math.cos(i * 7.3) * 40]}
              scale={0.3 + (i % 5) * 0.3}
            >
              <dodecahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color={body.color2} roughness={1} />
            </mesh>
          ))}
        </>
      )}

      {/* Authentic NASA 3D Lander (Viking for Mars, Apollo LM for Moon, Dawn for Ceres, Galileo for Jupiter) */}
      <group ref={lander} position-y={40}>
        <Spacecraft design={d} variant="lander" thrust={rt.thrust} targetSize={2.4} />
        <group ref={chute} position-y={3.2} visible={false}>
          <mesh>
            <sphereGeometry args={[2, 24, 12, 0, Math.PI * 2, 0, 1.2]} />
            <meshStandardMaterial color="#f4f4f4" side={THREE.DoubleSide} />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <mesh
              key={i}
              position={[Math.cos(i) * 0.9, -1.4, Math.sin(i) * 0.9]}
              rotation-z={Math.cos(i) * 0.4}
            >
              <cylinderGeometry args={[0.01, 0.01, 3]} />
              <meshBasicMaterial color="#ddd" />
            </mesh>
          ))}
        </group>
      </group>

      {s.landing >= stages.length && !gas && (
        <Sparkles count={80} scale={[5, 1, 5]} position-y={0.4} size={10} color={body.color} />
      )}
    </>
  );
}
