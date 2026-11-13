# Mission Forge 2026 — API Specification & Data Endpoints

## 1. NASA Open Science Data Integrations

Mission Forge 2026 consumes verified public datasets and live APIs from NASA and JPL. When client machines operate offline or experience rate limits, the platform seamlessly fails over to pre-bundled local snapshots with zero runtime disruption.

---

## 2. Integrated NASA APIs

### 2.1. NASA JPL Horizons Ephemeris API
- **Endpoint:** `https://ssd.jpl.nasa.gov/api/horizons.api`
- **Method:** `GET`
- **Purpose:** Computes high-precision heliocentric coordinates, orbital eccentricities, mean longitudes, and one-way light-time communication delays for target celestial bodies (Earth, Moon, Mars, Ceres, Jupiter, Saturn).
- **Parameters:**
  ```json
  {
    "format": "json",
    "COMMAND": "'499'", // Mars Center
    "EPHEM_TYPE": "VECTORS",
    "CENTER": "'@sun'",
    "START_TIME": "2026-10-01",
    "STOP_TIME": "2026-10-02",
    "STEP_SIZE": "1d"
  }
  ```
- **Response Fields Consumed:**
  - `X, Y, Z`: Heliocentric positions in AU.
  - `VX, VY, VZ`: Velocity vectors in km/s.
  - `LT`: Light-time travel delay (seconds) utilized in communication lag calculations.

### 2.2. NASA Astronomy Picture of the Day (APOD)
- **Endpoint:** `https://api.nasa.gov/planetary/apod`
- **Method:** `GET`
- **Query Parameters:** `api_key=DEMO_KEY` (or custom NASA Space Apps API Key), `thumbs=true`.
- **Purpose:** Surfaces high-resolution astronomical photography and scientific research summaries in the Flight Academy classroom and Mission Briefing terminal.

### 2.3. NASA NSSDCA Planetary Fact Sheet Data
- **Source:** `https://nssdc.gsfc.nasa.gov/planetary/factsheet/`
- **Integration:** Embedded verified mathematical tables in `src/lib/nasa-data.ts`:
  - Gravitational acceleration ($g$, $\text{m/s}^2$)
  - Planetary mean radius and diameter (km)
  - Orbital period (Earth days)
  - Atmospheric pressure and density classifications (`thick`, `thin`, `gas`, `none`)

### 2.4. NASA 3D Resources Repository
- **Source:** Official NASA 3D Vault (`https://github.com/nasa/NASA-3D-Resources`)
- **Assets Integrated:**
  - `saturn-v.glb`: High-poly Saturn V rocket stage stack.
  - `apollo-lunar-module.glb`: Apollo 11 Lunar Descent & Ascent Stage.
  - `ingenuity.glb`: Mars 2020 Ingenuity Helicopter with dual counter-rotating rotors.
  - `voyager-probe.glb`: Voyager 1 & 2 Interstellar Spacecraft with High-Gain Antenna.

---

## 3. Internal Application Endpoints & Functions

### 3.1. `nasa.functions.ts` (TanStack Start Server Actions)
- `fetchJplEphemeris(bodyId: string, timestamp: number)`: Queries or computes Keplerian body angles using verified J2000 epoch equations.
- `calculateTransferWindow(source: BodyId, target: BodyId)`: Calculates Hohmann transfer delta-v, transit duration, and departure phase angles.
- `fetchApodDaily()`: Fetches the latest verified NASA astronomy photo of the day.

### 3.2. Telemetry Ingestion Contract
```typescript
interface TelemetryPayload {
  missionId: "Moon" | "Mars" | "Ceres" | "Jupiter" | "Saturn";
  routeId: "safe" | "fast" | "science" | "risky";
  engineType: "chemical" | "ion" | "nuclear";
  deltaVBudget: number; // km/s
  antiGravityFactor: number; // 0.00 to 1.00
  payloadMassKg: number;
  scienceReturnScore: number;
}
```
