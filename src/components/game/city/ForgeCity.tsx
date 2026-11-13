import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMissionStore } from "../../../stores/mission-store";
import { CITY_MATERIALS, createFaçadeBays } from "./city-materials";
import { RoadNetwork } from "./RoadNetwork";
import {
  SpaceCenterLobbyInterior,
  ClassroomInterior,
  LaboratoryInterior,
  RocketHangarInterior,
} from "./EnterableInteriors";
import { GitCityRepoDistrict } from "./GitCityRepoDistrict";
import { FORGE_CITY_DISTRICTS } from "./city-data";
import { Nasa3DModel } from "../Nasa3DModel";

export type { ZoneLocation } from "./city-data";
export { FORGE_CITY_DISTRICTS };

export function ForgeCity() {
  const { camera } = useThree();
  const playerPos = useRef(new THREE.Vector3(0, 0, 8));
  const playerVelocity = useRef(new THREE.Vector3(0, 0, 0));
  const keys = useRef<{ [k: string]: boolean }>({});
  const activeZone = useMissionStore((s) => s.activeCityZone);
  const setStore = useMissionStore((s) => s.set);
  const go = useMissionStore((s) => s.go);
  const say = useMissionStore((s) => s.say);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
      if (e.key === "e" || e.key === "E") {
        const curZone = FORGE_CITY_DISTRICTS.find((z) => {
          const d = playerPos.current.distanceTo(new THREE.Vector3(...z.pos));
          return d <= z.radius;
        });
        if (curZone) {
          if (curZone.targetPhase) {
            say(`Entering ${curZone.name}`, "ok");
            go(curZone.targetPhase as never);
          } else {
            say(`${curZone.name}: Advanced Research Campus Facility`, "info");
          }
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [go, say]);

  useFrame((_, delta) => {
    const touchMove = useMissionStore.getState().touchMove;
    const isTouchSprinting = useMissionStore.getState().isTouchSprinting;
    const speed = (keys.current["shift"] || isTouchSprinting) ? 15 : 8.5;
    const moveDir = new THREE.Vector3();

    if (keys.current["w"] || keys.current["arrowup"]) moveDir.z -= 1;
    if (keys.current["s"] || keys.current["arrowdown"]) moveDir.z += 1;
    if (keys.current["a"] || keys.current["arrowleft"]) moveDir.x -= 1;
    if (keys.current["d"] || keys.current["arrowright"]) moveDir.x += 1;

    // Mobile / touch joystick support
    if (touchMove && (touchMove.x !== 0 || touchMove.z !== 0)) {
      moveDir.x += touchMove.x;
      moveDir.z += touchMove.z;
    }

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize();
      playerVelocity.current.lerp(moveDir.multiplyScalar(speed), 0.18);
    } else {
      playerVelocity.current.lerp(new THREE.Vector3(0, 0, 0), 0.22);
    }

    playerPos.current.addScaledVector(playerVelocity.current, delta);

    // Bounded city perimeters
    playerPos.current.x = Math.max(-50, Math.min(50, playerPos.current.x));
    playerPos.current.z = Math.max(-60, Math.min(32, playerPos.current.z));

    // Smooth camera follow with pleasant third-person angle
    const targetCamPos = new THREE.Vector3(
      playerPos.current.x,
      playerPos.current.y + 6.8,
      playerPos.current.z + 12.0
    );
    camera.position.lerp(targetCamPos, 0.12);
    camera.lookAt(playerPos.current.x, playerPos.current.y + 1.4, playerPos.current.z - 2.5);

    // Active zone detection
    let detectedZone: string | null = null;
    for (const z of FORGE_CITY_DISTRICTS) {
      const d = playerPos.current.distanceTo(new THREE.Vector3(...z.pos));
      if (d <= z.radius) {
        detectedZone = z.id;
        break;
      }
    }
    if (detectedZone !== activeZone) {
      setStore({ activeCityZone: detectedZone });
    }
  });

  return (
    <group>
      {/* 1. Cinematic Aerospace Lighting & Sky Atmosphere */}
      <color attach="background" args={["#050B18"]} />
      <fog attach="fog" args={["#050B18", 35, 120]} />
      <ambientLight intensity={0.65} color="#E0F2FE" />
      <directionalLight
        position={[45, 65, 35]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        color="#F8FAFC"
      />
      <directionalLight position={[-30, 35, -25]} intensity={0.5} color="#00F0FF" />
      <pointLight position={[0, 15, 0]} intensity={1.8} distance={40} color="#00F0FF" />

      {/* 2. City Pavement, Connected Roads & Animated Traffic */}
      <RoadNetwork />
      <CityTraffic />
      <StreetLights />

      {/* 3. Central Plaza Monument & Holographic Beacon */}
      <group position={[0, 0, 0]}>
        {/* Hologram Celestial Beacon */}
        <mesh position={[0, 3.2, 0]} material={CITY_MATERIALS.solarAtriumGlass}>
          <sphereGeometry args={[1.5, 32, 32]} />
        </mesh>
        <mesh position={[0, 1.2, 0]} material={CITY_MATERIALS.silverTitanium}>
          <cylinderGeometry args={[2.8, 3.4, 2.4, 32]} />
        </mesh>
        {/* Glowing holographic beacon ring */}
        <mesh position={[0, 4.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2, 2.3, 32]} />
          <meshBasicMaterial color="#00F0FF" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      </group>

      {/* 4. DISTRICT 1: MISSION FORGE SPACE CENTER (Hero Landmark) */}
      <group position={[0, 0, -22]}>
        {/* Architectural Exterior Massing */}
        <mesh position={[0, 11, 0]} castShadow material={CITY_MATERIALS.whiteComposite}>
          <boxGeometry args={[22, 22, 16]} />
        </mesh>
        {/* Double-Height Glass Atrium Entrance */}
        <mesh position={[0, 5.5, 8.1]} material={CITY_MATERIALS.cyanCurtainGlass}>
          <boxGeometry args={[12, 11, 0.4]} />
        </mesh>
        {/* Enterable Space Center Lobby */}
        <SpaceCenterLobbyInterior position={[0, 0, 0]} />
      </group>

      {/* 5. DISTRICT 2: SPACE SCIENCE ACADEMY (Enterable Classroom + Ingenuity Display) */}
      <group position={[-24, 0, -10]}>
        <mesh position={[0, 6, 0]} castShadow material={CITY_MATERIALS.whiteComposite}>
          <boxGeometry args={[16, 12, 16]} />
        </mesh>
        <mesh position={[0, 3.5, 8.1]} material={CITY_MATERIALS.cyanCurtainGlass}>
          <boxGeometry args={[6, 7, 0.4]} />
        </mesh>
        <ClassroomInterior position={[0, 0, 0]} />

        {/* Authentic 3D NASA Ingenuity Mars Helicopter on pedestal */}
        <group position={[0, 0, 9.8]}>
          <mesh position={[0, 0.4, 0]} material={CITY_MATERIALS.silverTitanium}>
            <cylinderGeometry args={[1.5, 1.8, 0.8, 24]} />
          </mesh>
          <Nasa3DModel
            modelUrl="/models/ingenuity.glb"
            targetSize={2.8}
            position={[0, 2.2, 0]}
            autoRotate={true}
            rotationSpeed={0.8}
          />
        </group>
      </group>

      {/* 6. DISTRICT 3: ASTRONAUT TRAINING FACILITY (+ Apollo LM 3D Lander) */}
      <group position={[24, 0, -10]}>
        <mesh position={[0, 6, 0]} castShadow material={CITY_MATERIALS.silverTitanium}>
          <cylinderGeometry args={[8, 8.8, 12, 32]} />
        </mesh>
        <mesh position={[0, 3.5, 8.1]} material={CITY_MATERIALS.solarAtriumGlass}>
          <boxGeometry args={[5, 7, 0.4]} />
        </mesh>

        {/* Authentic 3D NASA Apollo Lunar Descent Module */}
        <group position={[0, 0, 9.5]}>
          <mesh position={[0, 0.3, 0]} material={CITY_MATERIALS.plazaConcrete}>
            <cylinderGeometry args={[3, 3.4, 0.6, 32]} />
          </mesh>
          <Nasa3DModel
            modelUrl="/models/apollo-lunar-module.glb"
            targetSize={4.6}
            position={[0, 2.8, 0]}
            autoRotate={true}
            rotationSpeed={0.4}
          />
        </group>
      </group>

      {/* 7. DISTRICT 4: AEROSPACE RESEARCH CAMPUS & LABS (+ Voyager 3D Probe) */}
      <group position={[26, 0, 14]}>
        <mesh position={[0, 5, 0]} castShadow material={CITY_MATERIALS.whiteComposite}>
          <boxGeometry args={[18, 10, 16]} />
        </mesh>
        <LaboratoryInterior position={[0, 0, 0]} />

        {/* Authentic 3D NASA Voyager Interstellar Probe */}
        <group position={[0, 0, 9.5]}>
          <mesh position={[0, 0.3, 0]} material={CITY_MATERIALS.silverTitanium}>
            <cylinderGeometry args={[2.2, 2.5, 0.6, 24]} />
          </mesh>
          <Nasa3DModel
            modelUrl="/models/voyager-probe.glb"
            targetSize={3.8}
            position={[0, 2.4, 0]}
            autoRotate={true}
            rotationSpeed={0.5}
          />
        </group>
      </group>

      {/* 8. DISTRICT 5: ROCKET ASSEMBLY HANGAR (VIF) */}
      <group position={[-24, 0, 14]}>
        <mesh position={[0, 7.5, 0]} castShadow material={CITY_MATERIALS.darkAerospace}>
          <boxGeometry args={[26, 15, 24]} />
        </mesh>
        <RocketHangarInterior position={[0, 0, 0]} />
      </group>

      {/* 9. DISTRICT 6: ORBITAL LAUNCH COMPLEX 39X (Hero Saturn V Launch System) */}
      <group position={[0, 0, -48]}>
        {/* Launch Pad Pedestal */}
        <mesh position={[0, 1.8, 0]} castShadow receiveShadow material={CITY_MATERIALS.plazaConcrete}>
          <cylinderGeometry args={[14, 16, 3.6, 32]} />
        </mesh>
        {/* Red Launch Umbilical Tower */}
        <mesh position={[-7.5, 20, 0]} castShadow material={CITY_MATERIALS.hazardRed}>
          <boxGeometry args={[3.2, 40, 3.2]} />
        </mesh>
        {/* Service Arms connecting to rocket */}
        <mesh position={[-4, 28, 0]} material={CITY_MATERIALS.silverTitanium}>
          <boxGeometry args={[4, 1, 1]} />
        </mesh>
        <mesh position={[-4, 18, 0]} material={CITY_MATERIALS.silverTitanium}>
          <boxGeometry args={[4, 1, 1]} />
        </mesh>

        {/* Authentic 3D NASA Saturn V Rocket Staged on Pad */}
        <Nasa3DModel
          modelUrl="/models/saturn-v.glb"
          targetSize={36}
          position={[0, 20, 0]}
          autoRotate={false}
        />
      </group>

      {/* 10. DISTRICT 7: GITCITY OPEN-SOURCE REPO NEIGHBORHOOD (ethanplusai/gitcity.co) */}
      <GitCityRepoDistrict position={[0, 0, 36]} />

      {/* 11. International Space Station Orbiting in Sky */}
      <group position={[0, 38, -12]}>
        <Nasa3DModel
          modelUrl="/models/iss.glb"
          targetSize={16}
          autoRotate={true}
          rotationSpeed={0.15}
        />
        <pointLight intensity={1.5} distance={30} color="#00F0FF" />
      </group>

      {/* 12. District Trigger Rings on Ground */}
      {FORGE_CITY_DISTRICTS.map((z) => (
        <group key={z.id} position={z.pos}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
            <ringGeometry args={[z.radius - 0.4, z.radius, 48]} />
            <meshBasicMaterial color={z.color} side={THREE.DoubleSide} transparent opacity={0.75} />
          </mesh>
        </group>
      ))}

      {/* 13. Third-Person Player Character Avatar */}
      <PlayerAvatar playerPos={playerPos} />
    </group>
  );
}

function CityTraffic() {
  const carsRef = useRef<THREE.Group>(null);
  const carsData = useRef([
    { pos: [3.2, 0.4, -40] as [number, number, number], speed: 10, dir: 1, axis: "z", min: -50, max: 48, rot: 0, color: "#00F0FF" },
    { pos: [3.2, 0.4, 0] as [number, number, number], speed: 8.5, dir: 1, axis: "z", min: -50, max: 48, rot: 0, color: "#FFFFFF" },
    { pos: [-3.2, 0.4, 40] as [number, number, number], speed: 9.2, dir: -1, axis: "z", min: -50, max: 48, rot: Math.PI, color: "#3B82F6" },
    { pos: [-3.2, 0.4, -10] as [number, number, number], speed: 11, dir: -1, axis: "z", min: -50, max: 48, rot: Math.PI, color: "#F59E0B" },
    { pos: [-35, 0.4, 12] as [number, number, number], speed: 8, dir: 1, axis: "x", min: -42, max: 42, rot: Math.PI / 2, color: "#10B981" },
    { pos: [35, 0.4, -12] as [number, number, number], speed: 9, dir: -1, axis: "x", min: -42, max: 42, rot: -Math.PI / 2, color: "#EC4899" },
  ]);

  useFrame((_, delta) => {
    if (!carsRef.current) return;
    carsData.current.forEach((car, i) => {
      const child = carsRef.current?.children[i];
      if (!child) return;
      if (car.axis === "z") {
        car.pos[2] += car.speed * car.dir * delta;
        if (car.dir > 0 && car.pos[2] > car.max) car.pos[2] = car.min;
        if (car.dir < 0 && car.pos[2] < car.min) car.pos[2] = car.max;
      } else {
        car.pos[0] += car.speed * car.dir * delta;
        if (car.dir > 0 && car.pos[0] > car.max) car.pos[0] = car.min;
        if (car.dir < 0 && car.pos[0] < car.min) car.pos[0] = car.max;
      }
      child.position.set(car.pos[0], car.pos[1], car.pos[2]);
    });
  });

  return (
    <group ref={carsRef}>
      {carsData.current.map((car, idx) => (
        <group key={idx} position={car.pos} rotation={[0, car.rot, 0]}>
          {/* Cyber vehicle body */}
          <mesh castShadow position={[0, 0.35, 0]}>
            <boxGeometry args={[1.6, 0.6, 3.4]} />
            <meshStandardMaterial color={car.color} roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Cabin glass */}
          <mesh position={[0, 0.8, -0.2]}>
            <boxGeometry args={[1.3, 0.5, 1.8]} />
            <meshStandardMaterial color="#0A1628" roughness={0.1} metalness={0.9} />
          </mesh>
          {/* Headlights */}
          <mesh position={[-0.55, 0.4, 1.71]}>
            <boxGeometry args={[0.3, 0.15, 0.05]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0.55, 0.4, 1.71]}>
            <boxGeometry args={[0.3, 0.15, 0.05]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          {/* Taillights */}
          <mesh position={[-0.55, 0.4, -1.71]}>
            <boxGeometry args={[0.3, 0.15, 0.05]} />
            <meshBasicMaterial color="#FF3366" />
          </mesh>
          <mesh position={[0.55, 0.4, -1.71]}>
            <boxGeometry args={[0.3, 0.15, 0.05]} />
            <meshBasicMaterial color="#FF3366" />
          </mesh>
          {/* Wheels */}
          {[-0.85, 0.85].map((x) =>
            [-1.1, 1.1].map((z) => (
              <mesh key={`${x}-${z}`} position={[x, 0.15, z]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.28, 0.28, 0.2, 16]} />
                <meshStandardMaterial color="#1E293B" roughness={0.8} />
              </mesh>
            ))
          )}
        </group>
      ))}
    </group>
  );
}

function StreetLights() {
  const zPositions = [-45, -30, -15, 0, 15, 30, 45];
  return (
    <group>
      {zPositions.map((z, i) => (
        <group key={`light-${i}`}>
          {/* West Side Lamppost */}
          <group position={[-7.8, 0, z]}>
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.08, 0.1, 5, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0.6, 5, 0]}>
              <boxGeometry args={[1.2, 0.1, 0.2]} />
              <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[1.1, 4.9, 0]}>
              <boxGeometry args={[0.3, 0.08, 0.2]} />
              <meshBasicMaterial color="#00F0FF" />
            </mesh>
          </group>
          {/* East Side Lamppost */}
          <group position={[7.8, 0, z]}>
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.08, 0.1, 5, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[-0.6, 5, 0]}>
              <boxGeometry args={[1.2, 0.1, 0.2]} />
              <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[-1.1, 4.9, 0]}>
              <boxGeometry args={[0.3, 0.08, 0.2]} />
              <meshBasicMaterial color="#00F0FF" />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

function PlayerAvatar({ playerPos }: { playerPos: React.MutableRefObject<THREE.Vector3> }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(playerPos.current);
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 8]}>
      {/* Sci-Fi Flight Suit Body */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <capsuleGeometry args={[0.35, 0.7, 8, 16]} />
        <meshStandardMaterial color="#0284C7" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Aerospace Helmet & Gold Visor */}
      <mesh position={[0, 1.95, 0]} castShadow>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.95, 0.2]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#00F0FF"
          roughness={0.1}
          metalness={0.9}
          emissive="#00F0FF"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Life Support Thruster Pack */}
      <mesh position={[0, 1.35, -0.3]} castShadow>
        <boxGeometry args={[0.4, 0.55, 0.2]} />
        <meshStandardMaterial color="#1E293B" roughness={0.5} metalness={0.7} />
      </mesh>
      {/* Player Ground Shadow Disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[0.55, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
