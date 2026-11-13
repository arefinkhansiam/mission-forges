# Mission Forge 2026 — Developer Guidelines & Standards

## 1. Codebase Conventions & Quality Standards

### 1.1. React Three Fiber Rules
1. **Never pierce un-polyfilled properties in JSX:**
   Always ensure `ensureDataProp` covers prototypes before mounting components.
   ```typescript
   // Correct pattern:
   <mesh geometry={customGeo} material={customMat} position={[0, 1, 0]} />
   ```
2. **Component Fast Refresh Export Boundary:**
   Never export non-component objects, schemas, or data arrays from the same file as a React component. Place data arrays in `*-data.ts` or `*-registry.ts` files to avoid full page reloads during hot module replacement.
3. **Deterministic cleanup in `useEffect`:**
   Always remove global window event listeners (`keydown`, `keyup`, `touchstart`, `touchmove`, `touchend`).

### 1.2. Responsive & Mobile-First Design
1. **Touch Target Sizing:** All interactive buttons must have a minimum bounding box of $48\times 48\text{px}$ to prevent mis-clicks on mobile touchscreens.
2. **Text Visibility:** Use `select-none` on UI controls to prevent mobile OS text selection callouts during rapid tapping.
3. **Color Contrast:** Telemetry values must maintain a minimum contrast ratio of $4.5:1$ against the dark-slate backdrops.

---

## 2. Adding New Spacecraft Payloads & Scientific Instruments

To register a new instrument payload:
1. Open `src/lib/mission-sim.ts` (or `instrument-registry.ts`).
2. Add the instrument key to the `Instrument` union type.
3. Define its physical attributes:
   ```typescript
   magnetometer: {
     name: "Fluxgate Magnetometer",
     mass: 45,       // kg
     kw: 0.015,      // kW power draw
     science: 30     // science yield
   }
   ```
4. Verify power budgets across all destination bodies in the simulator.

---

## 3. Adding New NASA 3D Models
1. Place the optimized `.glb` binary in `public/models/`.
2. Ensure textures are power-of-two and Draco/Meshopt compressed using `gltf-pipeline`.
3. Wrap within `Nasa3DModel.tsx` with fallback bounding spheres to prevent scene crashes if assets fail to download.
