import React, { Suspense, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Nasa3DModel } from "./Nasa3DModel";

// 3D Rotating Earth with Atmospheric Rim Glow
function EarthGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // Load verified NASA Blue Marble high-res texture
  const earthTexture = useTexture("/textures/nasa-3d/earth-blue-marble.jpg");
  earthTexture.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group position={[0, 4.5, -9]}>
      {/* Planetary Body Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[4.2, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Atmospheric Haze Glow */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[4.32, 64, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer Ionosphere Aurora Rim */}
      <mesh>
        <sphereGeometry args={[4.45, 48, 48]} />
        <meshBasicMaterial
          color="#0284c7"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// 3D Animated Astronaut / Space Commander Character
function WalkingAstronaut() {
  const groupRef = useRef<THREE.Group>(null);
  const walkingOffset = useRef(0);
  const direction = useRef(1);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Procedural walking back and forth along the deck (X: -2.8 to 2.8)
    walkingOffset.current += 0.012 * direction.current;
    if (walkingOffset.current > 2.8) {
      direction.current = -1;
    } else if (walkingOffset.current < -2.8) {
      direction.current = 1;
    }

    // Apply movement
    groupRef.current.position.x = walkingOffset.current;
    // Walk bobbing motion
    groupRef.current.position.y = -1.35 + Math.abs(Math.sin(t * 5)) * 0.05;
    // Rotate character smoothly to face walking direction
    const targetRotY = direction.current > 0 ? Math.PI / 2 : -Math.PI / 2;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.1);
    // Subtle walking sway
    groupRef.current.rotation.z = Math.sin(t * 5) * 0.04;
  });

  return (
    <group ref={groupRef} position={[0, -1.35, 1.8]}>
      {/* 3D Human / Astronaut Model */}
      <Suspense fallback={null}>
        <Nasa3DModel
          modelUrl="/models/citizen-male.glb"
          targetSize={1.7}
          autoRotate={false}
          position={[0, 0, 0]}
        />
      </Suspense>

      {/* Character Shadow Disc */}
      <mesh position-y={0.01} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.42, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.55} />
      </mesh>

      {/* Futuristic EVA Suit Spotlight / Chest Beacon */}
      <pointLight position={[0, 1.1, 0.3]} intensity={4.5} distance={3} color="#38bdf8" />
    </group>
  );
}

// Modern Aerospace Launch Base Observation Deck
function SpaceportDeck() {
  return (
    <group position={[0, -1.4, 0]}>
      {/* Deck Main Floor with Glass / Carbon Metal Panels */}
      <mesh rotation-x={-Math.PI / 2} position-y={0}>
        <boxGeometry args={[14, 10, 0.2]} />
        <meshStandardMaterial
          color="#040816"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>

      {/* Glowing Hexagonal Floor Lines & Grid */}
      <gridHelper args={[14, 14, "#38bdf8", "#0e2340"]} position-y={0.11} />

      {/* Deck Perimeter Illuminated Glass Railings */}
      <mesh position={[0, 0.7, -4.9]}>
        <boxGeometry args={[13.8, 1.2, 0.08]} />
        <meshStandardMaterial
          color="#38bdf8"
          transparent
          opacity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[0, 1.3, -4.9]}>
        <boxGeometry args={[13.8, 0.08, 0.12]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Side Railings */}
      <mesh position={[-6.9, 0.7, 0]} rotation-y={Math.PI / 2}>
        <boxGeometry args={[9.8, 1.2, 0.08]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.3} />
      </mesh>
      <mesh position={[6.9, 0.7, 0]} rotation-y={Math.PI / 2}>
        <boxGeometry args={[9.8, 1.2, 0.08]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.3} />
      </mesh>

      {/* Holographic Nav Waypoint Disc */}
      <mesh position={[0, 0.12, 1.8]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[1.2, 1.25, 48]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
      </mesh>
      <mesh position={[0, 0.12, 1.8]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[2.2, 2.24, 64]} />
        <meshBasicMaterial color="#0284c7" transparent opacity={0.4} />
      </mesh>

      {/* Distant Launch Complex Silhouettes in the Background Horizon */}
      <group position={[8, 0, -8]}>
        {/* Launch Tower Truss */}
        <mesh position={[0, 4.5, 0]}>
          <boxGeometry args={[0.8, 9, 0.8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        {/* Flashing Red Aviation Beacon on Tower Tip */}
        <pointLight position={[0, 9.2, 0]} intensity={8} distance={15} color="#ef4444" />
      </group>
    </group>
  );
}

export function EarthLaunchLobbyScene() {
  return (
    <>
      <color attach="background" args={["#030712"]} />

      {/* Starfield */}
      <Stars radius={120} depth={50} count={3500} factor={4} saturation={0} fade speed={1} />

      {/* Lighting: Pure Deep Space Ambient + Blue/Cyan Accents */}
      <ambientLight intensity={0.5} color="#040d21" />
      <directionalLight position={[6, 8, 4]} intensity={2.8} color="#ffffff" />
      <directionalLight position={[-6, 3, -4]} intensity={2.0} color="#38bdf8" />
      <pointLight position={[0, 2, 2]} intensity={5} distance={10} color="#38bdf8" />

      {/* 3D Earth Globe Floating in Space */}
      <Suspense fallback={null}>
        <EarthGlobe />
      </Suspense>

      {/* Spaceport Observation Platform */}
      <SpaceportDeck />

      {/* Walking Commander / Astronaut */}
      <WalkingAstronaut />

      {/* Orbit Controls with gentle clamping */}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={true}
        minDistance={3.5}
        maxDistance={12}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2 - 0.05}
        target={[0, 0.2, 0]}
      />
    </>
  );
}
