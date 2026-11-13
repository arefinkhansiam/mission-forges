# Mission Forge 2026 — Autonomous Agents & AI Mentor Specification

## 1. Multi-Agent Aerospace Intelligence System

Mission Forge incorporates a team of specialized AI agents designed to guide learners, enforce engineering safety, and simulate real NASA mission control protocols.

```
                         ┌─────────────────────────────┐
                         │   Mission Director / User   │
                         └──────────────┬──────────────┘
                                        │
             ┌──────────────────────────┼──────────────────────────┐
             ▼                          ▼                          ▼
  ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
  │   Ayesha Mentor AI   │    │  Flight Director AI │    │ Flight Dynamics AI  │
  │ (STEM Voice Coach)  │    │  (Mission Control)  │    │ (Delta-V Audits)    │
  └─────────────────────┘    └─────────────────────┘    └─────────────────────┘
             │                          │                          │
             └──────────────────────────┼──────────────────────────┘
                                        ▼
                         ┌─────────────────────────────┐
                         │    Anti-Gravity Lab AI      │
                         │ (Spacetime Metric & Lift)   │
                         └─────────────────────────────┘
```

---

## 2. Agent Catalog & Responsibilities

### 2.1. Ayesha (Chief Aerospace Mentor AI)
- **Role:** Interactive voice guide and empathetic teacher for students and young explorers.
- **Engine:** Pure browser Web SpeechSynthesis API with zero server latency or token costs.
- **Tone:** Encouraging, scientifically rigorous, and conversational.
- **Key Behaviors:**
  - Greets the player upon entering Forge City.
  - Automatically explains complex rocket science when students interact with launch pads or the anti-gravity chamber.
  - Speaks closed captions directly to the HUD for multi-modal learning.
  - Informs students why missions fail (e.g. *"Our spacecraft ran out of electrical power because sunlight at Jupiter is 25 times weaker than at Earth!"*).

### 2.2. Flight Director (FLIGHT) AI
- **Role:** Leads Mission Control launch operations and enforces Go / No-Go polling.
- **Validation Protocol:**
  - Verifies total wet mass does not exceed the Space Launch System (SLS) 95 metric ton LEO payload limit.
  - Checks life-support power budgets across day/night cycles.
  - Validates thermal Whipple shield integrity for asteroid belt trajectories.

### 2.3. Flight Dynamics Officer (FDO) AI
- **Role:** Orbital mechanics calculator and trajectory optimizer.
- **Mathematical Engine:**
  - Evaluates Tsiolkovsky Delta-V requirements across all 4 flight routes:
    - *Hohmann Transfer:* Minimum-energy ellipse ($1.05\times$ base $\Delta v$).
    - *Fast Transfer:* High-thrust burn saving transit time ($1.30\times$ base $\Delta v$).
    - *Science Flyby:* Detour path maximizing sensor exposure ($1.12\times$ base $\Delta v$).
    - *Gravity Assist:* Planetary flyby saving fuel ($0.88\times$ base $\Delta v$).

### 2.4. Anti-Gravity Field Engineer AI
- **Role:** Oversees the speculative physics chamber and harmonic frequency tuning.
- **Functions:**
  - Monitors the superconducting levitation ring in the Astronaut Training Facility.
  - Calibrates gravitational loss dampeners, converting anti-gravity scalar values into orbital fuel savings.
  - Alerts pilots to field resonance limits and vector stability thresholds.

---

## 3. Autonomous Coding Agent Hard Directives (Antigravity & Lovable Rules)

> **CRITICAL WARNING FOR ALL AI AGENTS & LOVABLE:**  
> This project is connected to Lovable (`.lovable/`) and deployed to production. **NEVER rewrite git history** (`git push --force`, rebase altering upstream history). Always preserve commit linear integrity.

### 3.1. Absolute Engineering Rules
1. **Design Tokens & Visibility:**
   - UI/UX and font changes must be **visible in the browser**.
   - Change design tokens directly in the real `@theme` block in `src/styles.css`.
   - Never rely on disconnected inline hex values when global tokens exist.
   - Always load required web fonts (`Space Grotesk`, `Inter`, `JetBrains Mono`, `Fredoka`, `Hind Siliguri`) with preconnect in `index.html`.
2. **Zero Fabricated Data at Runtime:**
   - Strictly prohibit invented, fake, or mocked numbers in science/telemetry screens.
   - Every science value must adhere to the `Verified<T>` contract:
     ```ts
     export type Provenance = {
       source: string;
       url: string;
       fetchedAt: string; // ISO 8601 string
       status: "live" | "snapshot" | "unavailable";
       license?: string;
     };
     export type Verified<T> = { data: T | null; provenance: Provenance };
     ```
   - If an external live API is unreachable or rate-limited, display the **last verified snapshot with its real fetch timestamp** or an honest `"unavailable"` state with retry. **Never display a "DEMO DATA" badge.**
3. **Responsive Mobile First (No Rotation Hacks):**
   - **Never force-rotate the page.** The `.mf-game-viewport` `transform: rotate(90deg)` hack is strictly prohibited.
   - Mobile portrait (360×640 to 430×932) must render a native vertical layout: 3D canvas top 45–55%, controls bottom sheet (snap points 30/60/90%).
   - Minimum touch target: $\ge 48\text{px}$ (Commander/Cadet) and $\ge 64\text{px}$ (Kid Mode).
4. **Architectural Guardrails:**
   - Keep the single game store and 23-phase lifecycle in `src/stores/mission-store.ts`.
   - Keep all NASA/NOAA/ESA external API calls strictly in TanStack Start server functions (`src/lib/*.functions.ts`) with `nasa_cache`.
   - Keep scientific numbers and physical constants out of localization files (`src/locales/resources.ts`).
5. **Quality & Continuous Validation:**
   - Every commit must pass `npx tsc --noEmit`.
   - Commit messages must follow Conventional Commits: `feat(scope): ...`, `fix(scope): ...`.

