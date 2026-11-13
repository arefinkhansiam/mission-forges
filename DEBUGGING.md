# Mission Forge 2026 — Forensic Debugging & Troubleshooting Guide

## 1. Resolved Critical Incidents & Root Causes

### Incident 1: "Cannot set 'data-tsd-source'. Ensure it is an object before setting 'source'"
- **Symptoms:** The entire 3D canvas crashed with a fatal React Error Boundary message when rendering 3D geometries or materials.
- **Root Cause:** TanStack Start and modern dev bundlers attach debugging attributes (such as `data-tsd-source`) to JSX elements. React Three Fiber treats dotted or hyphenated properties as pierced attributes into sub-objects (`target.data.source`). When applied to Three.js classes (`BufferGeometry`, `Texture`, `Material`, `Object3D`) which lack a default `.data` object, JavaScript threw `TypeError: Cannot set property 'source' of undefined`.
- **The Resolution:** Attaching a non-enumerable, lazy-instantiated `data` getter/setter to all foundational Three.js prototypes (`ensureDataProp`) in `Game.tsx` and `city-materials.ts`.

### Incident 2: `@react-three/cannon` Missing Context Crash
- **Symptoms:** Importing physics triggers threw `useSphere must be used within a <Physics> component` and failed during SSR bundling.
- **Root Cause:** External physics engines require global rigid body simulation loops that clash with lightweight web-first architectures and mobile battery constraints.
- **The Resolution:** Replaced `@react-three/cannon` with pure native React Three Fiber vector distance calculations and smooth lerp interpolations (`AntiGravityZone.tsx` and `ForgeCity.tsx`). Zero external native dependencies, zero crash risk.

### Incident 3: Mobile Touch Ghost Locomotion
- **Symptoms:** When releasing a virtual thumbstick outside the screen boundary, player avatars continued moving infinitely.
- **Root Cause:** Missing `touchcancel` and global `window.mouseup` fallbacks.
- **The Resolution:** Bound `onTouchEnd` and `onTouchCancel` on the joystick element, combined with window-level pointer move listeners, guaranteeing that velocity vectors reset to $(0, 0)$ whenever finger contact terminates.

---

## 2. Common Troubleshooting Steps

| Issue | Diagnostic Check | Recommended Fix |
| :--- | :--- | :--- |
| **Black Canvas / WebGL Failure** | Check `chrome://gpu` for WebGL2 support | Enable Hardware Acceleration in browser settings |
| **No Voice Audio** | Check if browser muted tab or speech engine is initializing | Click anywhere in the viewport to activate user-gesture audio context |
| **Model Fails to Render** | Open DevTools Network tab, filter for `.glb` | Ensure GLB file is present in `public/models/` and referenced with absolute `/models/` path |
