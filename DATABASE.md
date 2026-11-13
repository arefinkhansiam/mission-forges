# Mission Forge 2026 — Database & 3DCityDB Architecture

## 1. Overview & Geospatial Standard Alignment
Mission Forge 2026 uses the **OGC CityGML (Open Geospatial Consortium)** standard and the **3DCityDB** relational database schema for semantic urban modeling. This enables Forge City to operate as a true smart digital twin of an aerospace operations center, where every building, road, launch pad, and hangar contains semantic engineering metadata rather than merely untextured 3D meshes.

---

## 2. 3DCityDB Relational Schema (PostgreSQL / PostGIS)

```
┌─────────────────────────────────────────────────────────────┐
│                         CITYOBJECT                          │
├─────────────────────────────────────────────────────────────┤
│ id: BIGSERIAL PRIMARY KEY                                   │
│ gmlid: VARCHAR(256) UNIQUE (e.g. 'FC_BLDG_PAD_39X')         │
│ name: VARCHAR(1000)                                         │
│ description: TEXT                                           │
│ objectclass_id: INT (references OBJECTCLASS)                │
│ envelope: GEOMETRY(POLYGONZ, 4326)                          │
│ creation_date: TIMESTAMP                                    │
│ termination_date: TIMESTAMP                                 │
└──────────────────────────────┬──────────────────────────────┘
                               │ 1:1
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                          BUILDING                           │
├─────────────────────────────────────────────────────────────┤
│ id: BIGINT PRIMARY KEY (FK -> CITYOBJECT.id)                │
│ building_parent_id: BIGINT                                  │
│ class: VARCHAR(256) ('Aerospace Launch Complex')            │
│ function: VARCHAR(256) ('Orbital Rocket Integration')       │
│ usage: VARCHAR(256) ('Mission Critical Operations')         │
│ year_of_construction: INT (2026)                            │
│ roof_type: VARCHAR(256) ('Flat Reinforced Steel')           │
│ measured_height: DOUBLE PRECISION (112.5 meters)            │
│ lod2_multi_surface_id: BIGINT                               │
│ lod3_multi_surface_id: BIGINT                               │
│ lod4_multi_surface_id: BIGINT                               │
└──────────────────────────────┬──────────────────────────────┘
                               │ 1:N
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      THEMATIC_SURFACE                       │
├─────────────────────────────────────────────────────────────┤
│ id: BIGINT PRIMARY KEY                                      │
│ building_id: BIGINT (FK -> BUILDING.id)                     │
│ type: VARCHAR(50) ('WallSurface', 'RoofSurface', 'Ground')  │
│ lod2_multi_surface_id: BIGINT                               │
│ lod3_multi_surface_id: BIGINT                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Forge City GML District Catalog

| GML ID | District Name | Object Class | LoD Level | Function / Attributes |
| :--- | :--- | :--- | :--- | :--- |
| `FC_DIST_PAD39X` | Orbital Launch Complex 39X | `Building` / `Industrial` | LoD 3 | Saturn V Mobile Launcher, Flame Trench, Cryogenic Fuel Loading |
| `FC_DIST_OPS` | Flight Operations Center | `Building` / `Administrative` | LoD 3 | Telemetry Array, Mission Control consoles, Deep Space Network link |
| `FC_DIST_ACAD` | Flight Academy & Classroom | `Building` / `Educational` | LoD 4 | Interactive lecture hall, Tsiolkovsky whiteboard, STEM tutorials |
| `FC_DIST_VIF` | Vehicle Integration Hangar | `Building` / `Industrial` | LoD 3 | High-bay gantry cranes, stage stacking, thermal tile installation |
| `FC_DIST_AGZONE` | Anti-Gravity Research Facility | `Building` / `Experimental` | LoD 3 | Speculative Spacetime Metric Chamber, Superconducting ring |
| `FC_ROAD_NET` | Forge Transit Network | `TransportationComplex` | LoD 2 | Dual-lane asphalt, pedestrian crossings, autonomous rover paths |

---

## 4. Mission Persistence & Telemetry Schema (Supabase / PostgreSQL)

In addition to 3DCityDB urban semantics, player mission history, spacecraft blueprints, and lunar discoveries are persisted to Supabase tables:

```sql
-- Spacecraft Design Blueprints
CREATE TABLE spacecraft_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  craft_name VARCHAR(100) NOT NULL,
  mission_target VARCHAR(50) NOT NULL, -- 'Moon', 'Mars', 'Ceres', etc.
  engine_id VARCHAR(50) NOT NULL,      -- 'chemical', 'ion', 'nuclear'
  engine_count INT DEFAULT 1,
  tank_count INT DEFAULT 4,
  wing_count INT DEFAULT 4,
  rtg_count INT DEFAULT 0,
  antenna_count INT DEFAULT 1,
  shield_equipped BOOLEAN DEFAULT TRUE,
  battery_equipped BOOLEAN DEFAULT FALSE,
  instruments TEXT[] DEFAULT ARRAY['camera'],
  fuel_percentage INT DEFAULT 100,
  anti_gravity_scalar NUMERIC(3,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flight Telemetry & Mission Outcomes
CREATE TABLE flight_telemetry_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID REFERENCES spacecraft_blueprints(id),
  launch_timestamp TIMESTAMPTZ DEFAULT NOW(),
  total_dv_spent_kms NUMERIC(6,3) NOT NULL,
  final_hull_integrity INT NOT NULL,
  total_science_yield INT NOT NULL,
  outcome_status VARCHAR(50) NOT NULL, -- 'success', 'rescued', 'failure'
  lunar_landing_site VARCHAR(100),     -- e.g. 'Shackleton Crater'
  blackbox_log TEXT
);
```
