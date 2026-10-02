import { useEffect, useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

interface Nasa3DModelProps {
  modelUrl: string;
  targetSize?: number;
  autoRotate?: boolean;
  rotationSpeed?: number;
  wireframe?: boolean;
  onLoad?: () => void;
  onError?: (err: Error) => void;
}

// In-memory GLTF cache to prevent re-fetching across tab/modal switches
const gltfCache = new Map<string, GLTF>();

export function Nasa3DModel({
  modelUrl,
  targetSize = 2.2,
  autoRotate = true,
  rotationSpeed = 0.5,
  wireframe = false,
  onLoad,
  onError,
}: Nasa3DModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [gltf, setGltf] = useState<GLTF | null>(() => gltfCache.get(modelUrl) ?? null);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(!gltfCache.has(modelUrl));

  useEffect(() => {
    let active = true;
    setLoadError(false);

    if (gltfCache.has(modelUrl)) {
      setGltf(gltfCache.get(modelUrl)!);
      setLoading(false);
      onLoad?.();
      return;
    }

    setLoading(true);
    const loader = new GLTFLoader();

    loader.load(
      modelUrl,
      (data) => {
        if (!active) return;
        gltfCache.set(modelUrl, data);
        setGltf(data);
        setLoading(false);
        onLoad?.();
      },
      undefined,
      (err) => {
        if (!active) return;
        console.warn(`[Nasa3DModel] Fallback activated for ${modelUrl}:`, err);
        setLoadError(true);
        setLoading(false);
        onError?.(err instanceof Error ? err : new Error(String(err)));
      }
    );

    return () => {
      active = false;
    };
  }, [modelUrl, onLoad, onError]);

  // Clone and normalize geometry to fit targetSize and center at origin
  const normalizedScene = useMemo(() => {
    if (!gltf) return null;

    const cloned = gltf.scene.clone(true);

    // Compute bounding box
    const box = new THREE.Box3().setFromObject(cloned);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    // Re-center object
    cloned.position.x = -center.x;
    cloned.position.y = -center.y;
    cloned.position.z = -center.z;

    // Normalization scale factor
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? targetSize / maxDim : 1;

    // Apply materials and wireframe
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => {
            const mat = m.clone();
            if ("wireframe" in mat) (mat as any).wireframe = wireframe;
            return mat;
          });
        } else if (mesh.material) {
          const mat = mesh.material.clone();
          if ("wireframe" in mat) (mat as any).wireframe = wireframe;
          mesh.material = mat;
        }
      }
    });

    const wrapper = new THREE.Group();
    wrapper.add(cloned);
    wrapper.scale.setScalar(scale);

    return wrapper;
  }, [gltf, targetSize, wireframe]);

  // Gentle auto-rotation
  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  // Layer 2 Fallback: If GLB failed to load, render clean procedural spacecraft
  if (loadError || !normalizedScene) {
    if (loading) {
      return (
        <group ref={groupRef}>
          {/* Subtle loading wireframe placeholder */}
          <mesh>
            <octahedronGeometry args={[0.8, 2]} />
            <meshBasicMaterial color="#00f0ff" wireframe opacity={0.3} transparent />
          </mesh>
        </group>
      );
    }

    return (
      <group ref={groupRef}>
        {/* Layer 2: Optimized Procedural Fallback Mesh */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.7, 1.4, 16]} />
          <meshStandardMaterial color="#c5cbd3" metalness={0.7} roughness={0.3} wireframe={wireframe} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <coneGeometry args={[0.5, 0.5, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.4} wireframe={wireframe} />
        </mesh>
        {/* Solar wings */}
        <mesh position={[1.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.04, 1.4, 0.4]} />
          <meshStandardMaterial color="#1a365d" emissive="#0d2347" emissiveIntensity={0.4} wireframe={wireframe} />
        </mesh>
        <mesh position={[-1.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.04, 1.4, 0.4]} />
          <meshStandardMaterial color="#1a365d" emissive="#0d2347" emissiveIntensity={0.4} wireframe={wireframe} />
        </mesh>
        {/* High-gain dish antenna */}
        <mesh position={[0, 0.4, 0.6]} rotation={[Math.PI / 4, 0, 0]}>
          <sphereGeometry args={[0.35, 16, 8, 0, Math.PI * 2, 0, Math.PI / 3]} />
          <meshStandardMaterial color="#edf2f7" side={THREE.DoubleSide} wireframe={wireframe} />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      <primitive object={normalizedScene} />
    </group>
  );
}
