import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const useAntiGravityPhysics = (
  entityRef: React.MutableRefObject<THREE.Mesh | THREE.Group | null>,
  physicsApi: any,
  fieldPosition: [number, number, number],
  fieldRadius: number,
  liftIntensity: number
) => {
  const zoneCenter = new THREE.Vector3(...fieldPosition);

  useFrame(() => {
    if (!entityRef.current) return;

    const entityPos = entityRef.current.position;
    const distance = entityPos.distanceTo(zoneCenter);

    // Check if player/rocket is inside the bounds of the Anti-Gravity field
    if (distance < fieldRadius) {
      // Linear dampening fallback interpolation matrix
      const dropFactor = 1 - (distance / fieldRadius);
      const targetUpwardForce = 9.81 * liftIntensity * dropFactor;

      // Inject upward anti-velocity scalar into the physics engine
      if (physicsApi?.velocity?.set) {
        physicsApi.velocity.set(0, targetUpwardForce, 0);
      } else {
        // Direct kinematic fallback if no physics engine body is bound
        entityPos.y = THREE.MathUtils.lerp(entityPos.y, targetUpwardForce * 0.4 + 1.2, 0.08);
      }
    }
  });
};

export default useAntiGravityPhysics;
