import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AntiGravityFieldProps {
  position: [number, number, number];
  radius: number;
  liftIntensity: number; // 0.00 = Normal Ground Vectors, 1.00 = Absolute Float
  fieldColor?: string;
}

export const AntiGravityField: React.FC<AntiGravityFieldProps> = ({ 
  position, 
  radius, 
  liftIntensity,
  fieldColor = '#00f3ff' 
}) => {
  const visualMeshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (visualMeshRef.current) {
      const elapsed = state.clock.getElapsedTime();
      const material = visualMeshRef.current.material as THREE.MeshBasicMaterial;
      
      // Premium volumetric spatial wave pulse animation
      material.opacity = 0.04 + Math.sin(elapsed * 2.5) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={visualMeshRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial 
          color={fieldColor} 
          transparent 
          wireframe
          opacity={0.05}
          blending={THREE.AdditiveBlending} 
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default AntiGravityField;
