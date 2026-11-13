# Mission Forge 2026 — External Integrations & Asset Sources

## 1. Open Source Asset Ecosystem

Mission Forge 2026 incorporates verified, open-source 3D models, textures, and datasets under permissible open licenses (CC0, MIT, NASA Open Government Data):

| Resource | Source Repository | License | Integration in Mission Forge |
| :--- | :--- | :--- | :--- |
| **GitCity Engine** | `github.com/ethanplusai/gitcity.co` | MIT | Player avatar character (`citizen-male.glb`), autonomous vehicle fleet (`sedan.glb`, `suv.glb`), urban materials |
| **NASA 3D Resources Vault** | `github.com/nasa/NASA-3D-Resources` | Public Domain (NASA) | Pad 39X Saturn V, Apollo Lunar Module, Mars Ingenuity helicopter, Voyager probe |
| **Kenney Space Kit** | `kenney.nl/assets/space-kit` | CC0 1.0 Universal | Sci-fi landing pads, communication dishes, gantry trusses |
| **Quaternius Sci-Fi Pack** | `quaternius.com` | CC0 1.0 Universal | Laboratory workstations, cleanroom modular partitions, airlocks |
| **3DCityDB Suite** | `github.com/3dcitydb/3dcitydb` | Apache 2.0 | OGC CityGML semantic spatial schema for Forge City digital twin |

---

## 2. Browser Web Platform APIs
- **WebGL2 via Three.js / React Three Fiber:** Hardware-accelerated 3D rendering with additive blending, dynamic lighting, and PBR textures.
- **Web Audio API:** Zero-dependency procedural synthesis of rocket thrust rumbles, UI clicks, radar beacons, and countdown beeps (`src/lib/audio.ts`).
- **Web SpeechSynthesis API:** Voice mentor engine delivering real-time educational audio guidance for K-12 students (`src/lib/voice-mentor.ts`).
- **Touch & Pointer Events:** Cross-platform touch gesture recognition powering the virtual analog thumbstick (`src/components/game/city/MobileTouchControls.tsx`).
