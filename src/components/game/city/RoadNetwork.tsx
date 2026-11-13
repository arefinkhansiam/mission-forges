import * as THREE from "three";
import { CITY_MATERIALS } from "./city-materials";

/**
 * Procedural Road & Pavement Network
 * Connects Central Plaza, Space Center, Research Campus, Hangar, Spaceport, and the GitCity District
 */
export function RoadNetwork() {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main North-South Central Boulevard (Launch Complex -> Space Center -> Plaza -> GitCity) */}
      {/* Roadbed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow material={CITY_MATERIALS.asphaltRoad}>
        <planeGeometry args={[14, 115]} />
      </mesh>
      {/* Road Centerline Dashes */}
      {Array.from({ length: 26 }).map((_, i) => (
        <mesh
          key={`dash-ns-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.03, 52 - i * 4.2]}
          material={CITY_MATERIALS.roadMarking}
        >
          <planeGeometry args={[0.3, 2.4]} />
        </mesh>
      ))}
      {/* Sidewalks (West & East) */}
      <mesh position={[-7.75, 0.12, 0]} receiveShadow material={CITY_MATERIALS.curbStone}>
        <boxGeometry args={[1.5, 0.24, 115]} />
      </mesh>
      <mesh position={[7.75, 0.12, 0]} receiveShadow material={CITY_MATERIALS.curbStone}>
        <boxGeometry args={[1.5, 0.24, 115]} />
      </mesh>

      {/* 2. East-West Avenues */}
      {/* South Avenue (z = 12) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 12]} receiveShadow material={CITY_MATERIALS.asphaltRoad}>
        <planeGeometry args={[95, 12]} />
      </mesh>
      {/* Mid Avenue (z = -12) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -12]} receiveShadow material={CITY_MATERIALS.asphaltRoad}>
        <planeGeometry args={[95, 12]} />
      </mesh>
      {/* GitCity Software District Avenue (z = 36) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 36]} receiveShadow material={CITY_MATERIALS.asphaltRoad}>
        <planeGeometry args={[75, 12]} />
      </mesh>

      {/* East-West Dashed Markings */}
      {Array.from({ length: 18 }).map((_, i) => (
        <mesh
          key={`dash-ew1-${i}`}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          position={[-42 + i * 5, 0.03, 12]}
          material={CITY_MATERIALS.roadMarking}
        >
          <planeGeometry args={[0.3, 2.5]} />
        </mesh>
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <mesh
          key={`dash-ew-git-${i}`}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          position={[-32 + i * 5, 0.03, 36]}
          material={CITY_MATERIALS.roadMarking}
        >
          <planeGeometry args={[0.3, 2.5]} />
        </mesh>
      ))}

      {/* 3. Central Plaza Pedestrian Pavement (Around Coordinate Origin) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow material={CITY_MATERIALS.plazaConcrete}>
        <planeGeometry args={[36, 36]} />
      </mesh>

      {/* Landscaping Green Belts / Parks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-25, 0.025, 0]} receiveShadow material={CITY_MATERIALS.campusGreen}>
        <planeGeometry args={[20, 18]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[25, 0.025, 0]} receiveShadow material={CITY_MATERIALS.campusGreen}>
        <planeGeometry args={[20, 18]} />
      </mesh>

      {/* Street Light Posts with Warm Lighting Pools */}
      {[-44, -32, -20, -8, 8, 20, 32, 44].map((zPos, idx) => (
        <group key={`light-ns-${idx}`}>
          {/* West Post */}
          <group position={[-8.8, 0, zPos]}>
            <mesh position={[0, 3, 0]} material={CITY_MATERIALS.silverTitanium}>
              <cylinderGeometry args={[0.08, 0.12, 6, 8]} />
            </mesh>
            <mesh position={[0.6, 5.8, 0]} material={CITY_MATERIALS.darkAerospace}>
              <boxGeometry args={[1.2, 0.15, 0.3]} />
            </mesh>
            <mesh position={[1.0, 5.68, 0]}>
              <boxGeometry args={[0.4, 0.08, 0.22]} />
              <meshBasicMaterial color="#38BDF8" />
            </mesh>
          </group>

          {/* East Post */}
          <group position={[8.8, 0, zPos]}>
            <mesh position={[0, 3, 0]} material={CITY_MATERIALS.silverTitanium}>
              <cylinderGeometry args={[0.08, 0.12, 6, 8]} />
            </mesh>
            <mesh position={[-0.6, 5.8, 0]} material={CITY_MATERIALS.darkAerospace}>
              <boxGeometry args={[1.2, 0.15, 0.3]} />
            </mesh>
            <mesh position={[-1.0, 5.68, 0]}>
              <boxGeometry args={[0.4, 0.08, 0.22]} />
              <meshBasicMaterial color="#38BDF8" />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}
