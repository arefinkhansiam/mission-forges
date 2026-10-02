# Mission Forge — AI Usage Disclosure

Mission Forge is an independent NASA Space Apps Challenge 2026 project by Team Ghost Hunter. This file documents AI assistance honestly. Items the repository cannot prove are marked **[TEAM TO CONFIRM]**.

## 1. AI Tools Used

| Tool | Status | Purpose | Work assisted | How output was used | Reviewed by team |
|---|---|---|---|---|---|
| Lovable | Verified | Initial prototype & UI scaffold | UI scaffolding, layout exploration, component generation | Iteratively modified and integrated into repo | Yes — team directed and tested in browser |
| Google Antigravity | Verified | Systems architecture & technical audit | TypeScript hardening, NASA API proxy resilience, 3D scenes, asset fixes, and archive systems | Reviewed, run, and verified locally by engineering team | Yes — verified via typecheck and automated build |
| Anthropic Claude | Verified | Technical documentation & audit | Scientific accuracy review, NASA data provenance auditing, copyediting | Refined project documentation and review checksheets | Yes — team verified against NASA mission fact sheets |
| Web Speech API | Native Browser | Dr. Ayesha voice mentor | In-browser speech synthesis (`window.speechSynthesis`) | Uses user's client-side TTS engine — no remote AI voice API | Yes — team tested across supported locales |

## 2. AI Prompts Used

### Verbatim prompts

[TEAM: paste real prompts from Lovable chat history here, with date]

### Representative prompts (NOT verbatim)

Not all historical AI prompts were preserved during development. The examples below are representative prompts describing the major categories of AI-assisted work performed on Mission Forge and are not presented as a complete verbatim transcript.

| AI Tool | Representative Prompt | Purpose / Reasoning | Output Used For |
|---|---|---|---|
| Lovable | "Build and modify Mission Forge as an interactive space mission design game for the NASA Space Apps Challenge Space Mission Design Game challenge. Preserve the existing architecture and implement the requested mission-planning and simulation functionality." | Application implementation | Mission store, planning screens, hangar, flight, landing, rescue, report |
| Lovable | "Improve the Mission Forge interface so students can understand mission planning, spacecraft configuration, launch, hazards, landing, and mission reports while preserving existing functionality." | Make complex concepts easier to understand | HUD screens, landscape game frame, mentor panel |
| Lovable | "Integrate the relevant NASA/JPL data source into the Mission Forge data layer. Clearly distinguish live NASA/JPL data from fallback/demo data and never present game-generated values as NASA observations." | External data integration with provenance | `getNasa` server function, cache, DEMO DATA labels |
| Lovable | "Implement the Tsiolkovsky rocket equation in the Mission Forge mission simulation and clearly distinguish scientific calculations from simplified game mechanics." | Scientific model | `analyze()` in `src/lib/mission-sim.ts` |
| Lovable | "Inspect the current implementation for errors, identify the cause, and fix the issue without breaking existing Mission Forge functionality." | Debugging | Bug fixes, layout fixes |
| Lovable | "Review the Mission Forge repository and create accurate documentation describing architecture, NASA/JPL data sources, scientific models, gameplay mechanics, setup instructions, and attribution." | Documentation | README, `docs/`, this file |

## 3. Why AI Was Used

- Speed up prototyping within the hackathon timeline
- Handle repetitive implementation (screens, translations, styling)
- Help find and fix bugs
- Explore UI/UX layouts
- Organize technical documentation
- Turn the team's product ideas into working code

AI was a development assistant. It was **not** the authority for NASA data or science values.

## 4. Data and Information Used With AI

**Public / project information given to Lovable:** Mission Forge source code, the team's written requirements and screen-flow descriptions, UI reference images supplied by the team, public NASA/JPL API endpoint documentation, and project architecture.

**Sensitive information:** Confirmed: No secrets, credentials, or proprietary tokens were ever shared with AI tools. The NASA API key is read solely on the server from an environment variable with a public `DEMO_KEY` fallback; `.env.example` contains only benign placeholders.

**AI vs. NASA data:** AI helped write code that fetches NASA/JPL data at runtime. No AI model analyzes or alters live NASA data inside the running app.

## 5. Human Team Contribution

The team decided: the project concept and challenge interpretation; the gameplay loop (destination → objective → route → resources → craft → readiness → GO/NO-GO → launch → flight → hazards → landing → rescue → report); spacecraft configuration and decision systems; the rescue-mission idea; which NASA/JPL sources to use; the rule that real data and game mechanics must be labeled separately; visual direction; testing; final feature choices; integration; and the final submission.

## 6. Human Review and Validation

AI output was reviewed, tested in the live preview, changed, or rejected before being kept. AI output was not automatically treated as authoritative. NASA/JPL values and scientific claims are checked against NASA sources where applicable (see `docs/data-sources.md`). Game mechanics are reviewed as Mission Forge's own rules and labeled "game estimate".

## 7. AI, NASA Data, and Simulation Separation

Current system architecture:

```text
NASA APOD / NeoWs / DONKI FLR / DSCOVR EPIC / Mars Photos / JPL SBDB / Sentry / Horizons
        |
getNasa server function (src/lib/nasa.functions.ts) + database cache
        |  (clearly labeled LIVE, CACHED, or DEMO DATA fallback)
        v
NASA Mission Data Center & Flight Feeds (APOD, NeoWs, DONKI, EPIC, Mars, SBDB, Sentry)
```

```text
Human-designed gameplay (src/stores/mission-store.ts)
   -> Scientific calculations (Tsiolkovsky, inverse-square flux in src/lib/mission-sim.ts)
   -> Mission Forge simulation (analyze(), readiness, hazards)
   -> Player decisions -> Mission outcome -> Mission report
```

Categories: **NASA/JPL live data** (APIs above); **NASA-published reference values** (NSSDCA planet facts, engine Isp/thrust); **physics calculations** (equations); **game estimates** (masses, route multipliers, Δv simplifications); **gameplay mechanics** (readiness, scoring, damage, rescue); **AI-assisted development** (the code itself). AI assistance does not turn gameplay values into NASA data.

## 8. AI-Generated Content and Assets

| Item | Status |
|---|---|
| Code | AI-assisted (Lovable / Google Antigravity), team-directed and reviewed |
| Documentation | AI-assisted (Lovable / Google Antigravity / Claude), team-reviewed |
| UI text and translations (6 languages) | Multi-locale string trees verified with i18next |
| NASA imagery (Blue Marble, Hubble, Curiosity) | Public NASA assets — not AI-generated |
| Vector illustrations (destinations) | Mathematical SVG vector illustrations created in code |
| 3D spacecraft, launch pad, procedural planet textures | Built in Three.js code (mesh primitives, shaders, dynamic canvas) |
| Dr. Ayesha text-to-speech | Native browser Web Speech API (`window.speechSynthesis`), zero external AI voice APIs |
| Logo & icons | Vector assets based on Lucide rocket and modern UI typography |

## 9. Summary Table

| AI Tool | Task | Prompt | Data/Context Provided | Why AI Was Used | Human Contribution |
|---|---|---|---|---|---|
| Lovable | App code, UI, 3D, data layer | Representative prompt (Section 2) | Source code, requirements, reference images, public API docs | Speed and prototyping | Concept, design decisions, testing, acceptance |
| Google Antigravity | Systems architecture, TypeScript fixes, NASA proxy hardening, Data Center | Audit & build prompts | Codebase, compiler diagnostics, NASA data specs | Code safety, robust offline fallbacks, comprehensive archives | Technical direction, verification, final review |
| Anthropic Claude | Technical audit & documentation review | Audit prompts | Repository documentation, NASA fact sheets | Scientific honesty verification | Data cross-checking, prompt disclosure verification |

A short version for the submission form is in [docs/nasa-ai-disclosure.md](docs/nasa-ai-disclosure.md).
