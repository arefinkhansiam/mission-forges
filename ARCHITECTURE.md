# Mission Forge 2026 — System Architecture Document

## 1. High-Level System Architecture

Mission Forge 2026 is built on a modular, decoupled web architecture separating 3D WebGL rendering, deterministic orbital simulation physics, persistent mission state, and responsive multi-touch HUD interfaces:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             BROWSER VIEWPORT                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   ┌─────────────────────────────────┐  │
│  │     3D WebGL Canvas Layer       │   │    2D DOM / HUD Overlay Layer   │  │
│  │   (React Three Fiber / Three)   │   │     (Tailwind CSS / Lucide)     │  │
│  │                                 │   │                                 │  │
│  │  - Forge City Digital Twin      │   │  - District Navigation Cards    │  │
│  │  - GitCity Avatar & Traffic     │   │  - Virtual Touch Joystick       │  │
│  │  - NASA 3D High-Poly Models     │   │  - Premium AntiGravity HUD      │  │
│  │  - AntiGravity Spatial Field    │   │  - 3DCityDB Semantic Inspector  │  │
│  │  - Dynamic Third-Person Camera  │   │  - Flight Academy Classrooms    │  │
│  └────────────────┬────────────────┘   └────────────────┬────────────────┘  │
│                   │                                     │                   │
│                   ▼                                     ▼                   │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                 Zustand Global Mission Store (v3)                     │  │
│  │    - Spacecraft Configuration (Payload, Tanks, Wings, RTGs, ISP)      │  │
│  │    - Live Coordinates & Anti-Gravity Lift Scalar (0.0 -> 1.0)         │  │
│  │    - Multi-touch Analog Movement Vectors (touchMove: {x, z})          │  │
│  │    - Phase State Machine (City -> Hangar -> Launch -> Moon Surface)   │  │
│  └────────────────┬──────────────────────────────────┬───────────────────┘  │
│                   │                                  │                      │
│                   ▼                                  ▼                      │
│  ┌─────────────────────────────────┐   ┌─────────────────────────────────┐  │
│  │   Deterministic Physics Engine  │   │    Audio & Speech Engine        │  │
│  │  - Tsiolkovsky Rocket Equation  │   │  - Web Audio Synthesizer (SFX)  │  │
│  │  - Gravity Loss Mitigation      │   │  - Web SpeechSynthesis (Voice)  │  │
│  │  - Inverse-Square Solar Flux    │   │  - Ayesha AI Mentor Guidance    │  │
│  │  - Keplerian Orbit Angles       │   │  - Synchronized HUD Subtitles   │  │
│  └─────────────────────────────────┘   └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Pillars

### 2.1. WebGL Pierced-Property Crash Polyfill
In modern React Three Fiber workflows combined with TanStack Start, bundlers inject development attributes such as `data-tsd-source` into JSX elements. In R3F, compound attribute names containing dots or hyphens trigger pierced property traversal (`target.data.source`), which causes fatal runtime crashes when targets (`BufferGeometry`, `Texture`, `Material`, `Object3D`) lack an object container.

**The Mission Forge Engine Polyfill:**
```typescript
function ensureDataProp(proto: any) {
  if (proto && !("data" in proto)) {
    Object.defineProperty(proto, "data", {
      get() {
        if (!this._customData) this._customData = {};
        return this._customData;
      },
      set(val) {
        this._customData = val;
      },
      configurable: true,
      enumerable: false,
    });
  }
}

// Polyfill all Three.js prototype hierarchies
ensureDataProp(THREE.Object3D.prototype);
ensureDataProp(THREE.Material.prototype);
ensureDataProp(THREE.BufferGeometry.prototype);
ensureDataProp(THREE.Texture.prototype);
```
This guarantees **100% crash-free rendering** across all 3D geometries, materials, and canvas context switches.

### 2.2. Deterministic Aerospace Physics (`mission-sim.ts`)
1. **Tsiolkovsky Rocket Equation:**
   $$\Delta v = I_{sp} \cdot g_0 \cdot \ln\left(\frac{m_{dry} + m_{prop}}{m_{dry}}\right)$$
2. **Anti-Gravity Gravitational Loss Reduction:**
   $$Required\,\Delta v = (\Delta v_{orbit} \cdot \Delta v_{route}) \cdot \left(1 - \lambda_{ag} \cdot 0.40\right)$$
   Where $\lambda_{ag} \in [0, 1]$ represents the anti-gravity lift factor, saving up to 40% in orbital launch propellant.
3. **Solar Flux Inverse-Square Falloff:**
   $$P_{solar}(r) = P_{1\,AU} \cdot \left(\frac{1}{r_{AU}^2}\right)$$
   Demonstrating why outer-planet missions (Jupiter, Saturn) require Radioisotope Thermoelectric Generators (MMRTGs) instead of solar wings.

---

## 3. Directory & Module Hierarchy

```
mission-forges/
├── public/
│   ├── models/                # Verified NASA 3D Models & GitCity Assets
│   │   ├── saturn-v.glb       # NASA Saturn V Launch Vehicle
│   │   ├── apollo-lunar-module.glb  # NASA Apollo 11 Lunar Module
│   │   ├── ingenuity.glb      # NASA Mars Ingenuity Helicopter
│   │   ├── voyager-probe.glb  # NASA Voyager Interstellar Spacecraft
│   │   ├── citizen-male.glb   # Player Character Avatar (GitCity)
│   │   └── sedan.glb / suv.glb# City Autonomous Traffic Fleet
│   └── materials/             # PBR Textures (concrete, grass, asphalt)
├── src/
│   ├── components/
│   │   ├── game/
│   │   │   ├── city/          # Forge City 3D Components
│   │   │   │   ├── ForgeCity.tsx           # Scene Root & Player Controller
│   │   │   │   ├── CityOverlay.tsx         # HUD Matrix, Minimap & Modals
│   │   │   │   ├── MobileTouchControls.tsx # Virtual Joystick & Actions
│   │   │   │   ├── AntiGravityZone.tsx     # Three.js Levitation Trigger
│   │   │   │   ├── PremiumMissionHUD.tsx   # Glassmorphic Telemetry HUD
│   │   │   │   ├── CityGmlInspector.tsx    # 3DCityDB Semantic Inspector
│   │   │   │   └── EnterableInteriors.tsx  # Interior Space Architectures
│   │   │   └── Nasa3DModel.tsx             # GLTF Parser & Error Boundaries
│   ├── lib/
│   │   ├── mission-sim.ts     # Tsiolkovsky Rocket Equation & Physics
│   │   ├── nasa-data.ts       # NSSDCA Verified Constants & Ephemerides
│   │   ├── audio.ts           # Web Audio API Synthesizer (SFX)
│   │   └── voice-mentor.ts    # Web SpeechSynthesis Ayesha AI Engine
│   └── stores/
│       └── mission-store.ts   # Zustand State Store with LocalStorage
```

---

## 4. State Lifecycle & Checkpoint Safety
The state is managed using Zustand with persistent LocalStorage serialization. During transitions (e.g., from `city` into `missions` or `launch`), inflight states are checkpointed:
- If a user refreshes during `launch`, the store safely recovers to `check`.
- If a user refreshes during `docking`, the store safely recovers to `rescue`.
- All touch joystick states automatically zero on component unmount, preventing ghost movement vectors.
