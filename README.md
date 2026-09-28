# Mission Forge

**An Interactive Space Mission Design & Simulation Game**

## NASA Space Apps Challenge 2026
Challenge: Space Mission Design Game — by **Team Ghost Hunter**.

## The Problem
Space mission design involves tradeoffs between mass, fuel, power, route and risk that are hard for students to picture.

## Our Solution
Mission Forge is an educational space mission design game where players build spacecraft, select destinations, manage resources, make mission decisions, launch, navigate hazards, perform landing sequences, and evaluate mission outcomes.

- NASA/JPL data is used as an **external data layer**.
- The gameplay simulation is **our own implementation**.
- Some gameplay values, rules, hazards, scoring and estimates are **game mechanics**, not NASA mission data.
- NASA-inspired does **not** mean NASA endorsed or developed this project.

## How It Works
Plan a mission step by step, assemble a craft in a 3D hangar, pass a readiness check and GO/NO-GO poll, then fly it in 3D from launch to landing. Physics (rocket equation, solar flux) decides whether your design can reach the target.

## Features
- Destination selection (Moon, Mars, Ceres, Jupiter, Saturn)
- Mission brief and objectives
- Route choice and route preview
- Budget, fuel, power, communications and instrument decision screens
- Mission overview
- Spacecraft presets and 3D hangar configuration (engines, tanks, solar wings, RTGs, battery, antennas, shield, instruments)
- Propulsion selection (chemical, ion, nuclear)
- Mission readiness check
- GO/NO-GO launch poll using live DONKI solar-flare data
- 3D launch sequence
- 3D flight with orbit / chase / cockpit cameras and time warp
- Mission hazard encounters with player decisions
- Docking / rescue mission mechanics
- Landing sequence and mission report
- NASA Data Demo (APOD, NeoWs, DONKI) and live JPL planet positions
- Learn Lab, Dr. Ayesha mentor with text-to-speech, six languages

## NASA & JPL Data Sources
All calls run on the server through one function with caching. When a source is unavailable the UI shows **DEMO DATA** labels.

| Source | Provides | Used in | Live |
|---|---|---|---|
| [NASA APOD](https://api.nasa.gov/planetary/apod) | Astronomy picture of the day | Home NASA Data Demo | Yes |
| [NeoWs](https://api.nasa.gov/neo/rest/v1/feed) | Near-Earth object approaches | Home NASA Data Demo | Yes |
| [DONKI FLR](https://api.nasa.gov/DONKI/FLR) | Solar flares | Home feed, GO/NO-GO poll | Yes |
| [NASA Image and Video Library](https://images-api.nasa.gov/search) | Mission imagery | Mission brief | Yes |
| [JPL Horizons](https://ssd.jpl.nasa.gov/api/horizons.api) | Planet position vectors | Route map positions panel | Yes |

Not every NASA source drives gameplay; the NASA Data Demo is intentionally separate from the simulation. EPIC, Mars Rover Photos, JPL SBDB and JPL Sentry exist in the server proxy but are **inactive** (no screen uses them).

### Fallback / Demo Data
If a NASA/JPL API cannot be reached, labeled fallback content is shown. The UI distinguishes live NASA data from **DEMO DATA**; fallback values are never presented as real observations.

## Scientific Concepts
Tsiolkovsky rocket equation `Δv = Isp × g₀ × ln(m₀ / mf)` and inverse-square solar flux. See [docs/scientific-models.md](docs/scientific-models.md).

## Simulation & Game Mechanics
Readiness, scoring, route multipliers, hazards, damage and rescue are Mission Forge mechanics. See [docs/gameplay.md](docs/gameplay.md).

## Architecture
See [docs/architecture.md](docs/architecture.md).

## Data Provenance
See [docs/data-sources.md](docs/data-sources.md).

## Screenshots
No screenshots are committed yet. Add PNGs to [`/screenshots`](screenshots/): Home, Mission Brief, Spacecraft Builder, Route Preview, Launch, Mission Hazard, Landing, Mission Report, NASA Data Demo.

## Local Setup
Requirements: Node.js 20+ and npm (Bun also works; a `bun.lock` is included).

```bash
git clone https://github.com/arefinkhansiam/mission-forges.git
cd mission-forges
npm install
cp .env.example .env
npm run dev        # development
npm run build      # production build
npm run preview    # preview the build
npm run lint       # lint
```

## Environment Variables
| Name | Where | Purpose |
|---|---|---|
| `NASA_API_KEY` | Server only | NASA API key; falls back to NASA's public `DEMO_KEY` if unset |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` | Browser (publishable) | Backend client |
| `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` | Server | Backend client during SSR |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only, secret | NASA response cache |

The NASA key is deliberately **not** a `VITE_` variable so it never ships to the browser.

## Deployment
The live build is hosted at https://mission-forge-replicant.lovable.app. The project is built for an edge/Worker runtime (Cloudflare Workers-style, `wrangler` config via the Vite plugin). Vercel is not a drop-in target without changing the TanStack Start deployment preset. Set the environment variables above in your host.

## Attribution
Mission Forge is an independent project created for the NASA Space Apps Challenge. NASA and JPL data/services are used where indicated. This project is not an official NASA product and is not endorsed by NASA.

- NASA Open APIs: https://api.nasa.gov
- NASA Image and Video Library: https://images.nasa.gov
- JPL Horizons: https://ssd.jpl.nasa.gov/horizons/
- NASA Blue Marble: https://visibleearth.nasa.gov
- NASA NSSDCA Planetary Fact Sheets: https://nssdc.gsfc.nasa.gov/planetary/factsheet/

NASA imagery follows NASA media usage guidelines; we claim no ownership of it.

## Team Ghost Hunter
- Arefin Khan Siam — Team Lead
- Melita Mehzabin Neha
- Angkon Roy
- Rizvi Hasan
- Taspiha Tabassum

## Future Improvements
We plan to integrate more relevant data sources, add deeper scientific calculations, improve mission modeling, improve UI/UX, make the experience easier to understand and use, and continue improving educational value.

## License
Source code: [MIT](LICENSE). NASA/JPL content is excluded from this license.
