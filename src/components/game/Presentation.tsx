import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, Stars, useGLTF } from "@react-three/drei";
import { useTranslation } from "react-i18next";
import * as THREE from "three";
import { BODIES, type BodyId } from "../../lib/nasa-data";
import { useMissionStore } from "../../stores/mission-store";
import earth from "../../assets/nasa-earth-blue-marble.jpg.asset.json";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

const maps: Partial<Record<BodyId, string>> = {
  Earth: earth.url, Mars: "/textures/nasa-3d/mars.jpg", Moon: "/textures/nasa-3d/moon.jpg",
  Jupiter: "/textures/nasa-3d/jupiter.jpg", Saturn: "/textures/nasa-3d/saturn.jpg",
};

// Each mounted globe owns its texture. Failed requests retain a readable, untextured globe.
export function Surface({ body, radius = 1 }: { body: BodyId; radius?: number }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [failed, setFailed] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    let active = true;
    setTexture(null); setFailed(false);
    const url = maps[body];
    if (!url) return;
    const tex = new THREE.TextureLoader().load(url, loaded => {
      loaded.colorSpace = THREE.SRGBColorSpace; loaded.anisotropy = 4;
      if (active) setTexture(loaded);
    }, undefined, () => { if (active) setFailed(true); });
    return () => { active = false; tex.dispose(); };
  }, [body]);
  return <>
    <mesh><sphereGeometry args={[radius, 64, 40]} /><meshStandardMaterial key={texture?.uuid ?? "fallback"} map={texture} color={texture ? "#ffffff" : BODIES[body].color} roughness={0.94} /></mesh>
    {failed && <Html position={[0, -radius - 0.25, 0]} center><span className="mf-asset-label">{t("exp.textureFallback")}</span></Html>}
  </>;
}

export function PlanetScene() {
  const phase = useMissionStore(s => s.phase), mission = useMissionStore(s => s.mission);
  const quality = useMissionStore(s => s.quality);
  const reduced = useReducedMotion();
  const { camera, viewport } = useThree();
  const planet = useRef<THREE.Group>(null);
  const body = phase === "menu" ? "Earth" : mission;
  useEffect(() => { camera.position.set(0, 0, 7); camera.lookAt(0, 0, 0); }, [camera]);
  useFrame((_, dt) => { if (planet.current && !reduced) planet.current.rotation.y += Math.min(dt, 0.05) * 0.025; });
  const x = viewport.width * 0.22;
  return <>
    <color attach="background" args={["#05090f"]} />
    <ambientLight intensity={0.16} color="#a4bfd9" />
    <directionalLight position={[-3, 4, 6]} intensity={2.5} color="#fff4e4" />
    <Stars radius={70} depth={30} count={quality === "high" ? 1200 : 400} factor={2} fade speed={0} />
    <group position={[x, 0.05, 0]} rotation-z={0.18}>
      <group ref={planet} rotation-y={body === "Earth" ? 2.8 : 0.6}><Surface key={body} body={body} radius={2.28} /></group>
      {body === "Earth" && <mesh scale={1.012}><sphereGeometry args={[2.28, 48, 24]} /><meshBasicMaterial color="#8ac7ef" transparent opacity={0.13} side={THREE.BackSide} /></mesh>}
      {body === "Saturn" && <mesh rotation-x={1.14}><ringGeometry args={[2.7, 3.8, 96]} /><meshStandardMaterial color="#b8ac8c" transparent opacity={0.7} side={THREE.DoubleSide} /></mesh>}
    </group>
  </>;
}

class AssetBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function Model() {
  const gltf = useGLTF("/models/mro.glb", "/decoders/draco/");
  const normalized = useMemo(() => {
    const clone = gltf.scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    clone.position.sub(center);
    return { clone, scale: 4.3 / Math.max(size.x, size.y, size.z) };
  }, [gltf.scene]);
  // Cached geometry/materials belong to useGLTF, never dispose them on a scene transition.
  return <group scale={normalized.scale} rotation={[0.3, -0.5, 0.1]} dispose={null}><primitive object={normalized.clone} /></group>;
}

export function Nasa3DModel() {
  const { t } = useTranslation();
  const label = (key: string) => <Html center><div className="mf-asset-label" role="status">{t(key)}</div></Html>;
  return <AssetBoundary fallback={label("exp.modelFallback")}><Suspense fallback={label("exp.modelLoading")}><Model /></Suspense></AssetBoundary>;
}

export function SceneControls() {
  const { t } = useTranslation();
  return <div className="mf-scene-controls" role="group" aria-label={t("exp.camera")}>
    {(["left", "right", "in", "out", "reset"] as const).map((action, i) => <button key={action} aria-label={t(`exp.camera_${action}`)} title={t(`exp.camera_${action}`)} onClick={() => window.dispatchEvent(new CustomEvent("mf-camera", { detail: action }))}>{["↶", "↷", "+", "−", "⌖"][i]}</button>)}
  </div>;
}
