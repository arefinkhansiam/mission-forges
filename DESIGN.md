# Mission Forge 2026 — Game Design Document & UI/UX Specification

## 1. Game Design Pillars
1. **Playable Physics, Not Fictional Magic:** Every rocket burn, trajectory choice, and payload mass calculation is grounded in the Tsiolkovsky rocket equation and orbital mechanics.
2. **Kid-Friendly Delight & Intuitive Onboarding:** Complex aerospace concepts are gamified with immediate visual feedback, audio blips, and an encouraging AI voice mentor.
3. **Inclusive Mobile-First Accessibility:** Operable across smartphones, tablets, laptops, and ultra-wide desktop monitors without sacrificing tactile precision.

---

## 2. Visual Style & UI/UX Matrix
- **Aesthetic Direction:** *Cyber-Glass Aerospace Telemetry.* Clean, modern dark-slate surfaces (`bg-slate-950/80`) paired with crisp cyan (`#06b6d4`), emerald (`#10b981`), amber (`#f59e0b`), and electric violet accents.
- **Typography:**
  - *Headings & Titles:* Bold geometric sans-serif for futuristic command readability.
  - *Telemetry Data & Coordinates:* Monospaced numeric fonts (`font-mono`) to prevent layout shifts during numerical updates.
  - *Voice Subtitles:* High-legibility captions with subtle glowing text shadows for high contrast over 3D scenes.
- **Micro-Interactions:**
  - Tactile button press scaling (`active:scale-95`).
  - Smooth glassmorphic backdrop filters (`backdrop-blur-md`).
  - Animated pulsing indicators for live telemetry links, anti-gravity flux fields, and primary launch actions.

---

## 3. Dual-Input Control Architecture

```
                    ┌─────────────────────────────────┐
                    │      Player Movement Input      │
                    └────────────────┬────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌───────────────────────┐                           ┌───────────────────────┐
│  Desktop / Keyboard   │                           │     Mobile / Touch    │
│  - WASD / Arrows: Move│                           │  - Virtual Joystick   │
│  - Shift: Sprint (18m/s)                           │  - Analog Vector 360° │
│  - [E]: Interact / Act│                           │  - [⚡] Sprint Toggle  │
│  - [I]: CityGML Inspect                           │  - [🚀] Action Button │
│  - Mouse Orbit Camera │                           │  - [🎙️] Voice Briefing │
└───────────────────────┘                           └───────────────────────┘
```

### 3.1. Virtual Analog Joystick (Bottom-Left)
- **Geometry:** 128px circular bounding box with glowing cyan border and internal crosshairs.
- **Thumb Knob:** 56px gradient disc that tracks finger touch coordinates up to a 52px radius.
- **Kinematic Mapping:** Converts 2D screen coordinates $(dx, dy)$ into normalized 3D velocity vectors:
  $$\vec{v}_{move} = (normX, 0, normY)$$
  where pushing up ($dy < 0$) corresponds to forward motion along $-Z$.
- **Spring Damping:** Instant spring-back interpolation to $(0, 0)$ on finger release.

### 3.2. Action Button Cluster (Bottom-Right)
- **⚡ Sprint Toggle:** Activates speed multiplier ($9.5\text{ m/s} \to 18.0\text{ m/s}$) with amber glow.
- **🎙️ Voice Brief:** Triggers Ayesha AI speech synthesis to explain the current district or mission target.
- **🔬 Inspect [I]:** Opens the OGC 3DCityDB semantic metadata inspector.
- **🚀 Primary Action [E]:** Dynamically activates the active district (enters flight academy, opens launchpad countdown, or initiates lunar descent).

---

## 4. Anti-Gravity UI & Visual Effects
- **Volumetric Spatial Pulse:** Rendered in Three.js as an additive-blended wireframe sphere with oscillating sinusoidal opacity:
  $$\text{Opacity}(t) = 0.04 + 0.02 \cdot \sin(2.5 \cdot t)$$
- **Levitation Physics:** When the player avatar enters the field radius ($R < 8.5\text{ m}$), a buoyant vertical upward vector is smoothly interpolated:
  $$y_{hover} = \left(\sin(3t) \cdot 0.8 + 1.2\right) \cdot \lambda_{lift} \cdot \left(1 - \frac{r}{R}\right)$$
- **Glassmorphic Telemetry HUD:**
  - Real-time gravity field slider ($0.0 \to 1.0$).
  - Dynamic orbital Delta-V savings calculator.
  - Interactive frequency harmonic spectrum visualization.

---

## 5. Kid-Friendly Learning Guidance System
- **Tone:** Encouraging, scientifically accurate, and empowering.
- **Visual Status Signals:**
  - 🟢 **Green (Nominal):** Positive margins, sufficient Delta-V, redundant communications.
  - 🟡 **Amber (Advisory):** Tight margins (<10% fuel buffer, single antenna, thin power).
  - 🔴 **Red (Hazard):** Mass exceeds SLS limit (>95 t), negative Delta-V, complete power deficit.
- **Voice Mentor Character (Ayesha):**
  - Speaks key milestones automatically (entering launch pad, engaging anti-gravity field).
  - Explains the "why" behind rocket science: *"Cryogenic engines burn propellant rapidly with high thrust, while ion engines are 10x more efficient but need steady electrical power!"*
