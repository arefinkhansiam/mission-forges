# Mission Forge 2026 — Model Context Protocol (MCP) Specification

## 1. Overview & Protocol Purpose
The **Model Context Protocol (MCP)** enables AI assistants and autonomous coding agents (such as Antigravity, Claude, or custom NASA telemetry agents) to interact directly with the Mission Forge engine, querying live aerospace physics, executing trajectory trade studies, and retrieving semantic urban data.

---

## 2. Exposed MCP Tool Specifications

### 2.1. `calculate_delta_v`
Computes the mission Delta-V using the deterministic Tsiolkovsky equation, taking into account engine specific impulse, stage count, dry mass, and speculative anti-gravity field reductions.

```json
{
  "name": "calculate_delta_v",
  "description": "Calculates available vs required Delta-V and propellant margins for a specified planetary mission.",
  "parameters": {
    "type": "object",
    "properties": {
      "missionTarget": {
        "type": "string",
        "enum": ["Moon", "Mars", "Ceres", "Jupiter", "Saturn"]
      },
      "route": {
        "type": "string",
        "enum": ["safe", "fast", "science", "risky"]
      },
      "engine": {
        "type": "string",
        "enum": ["chemical", "ion", "nuclear"]
      },
      "tanks": { "type": "integer", "minimum": 1, "maximum": 8 },
      "antiGravityLift": { "type": "number", "minimum": 0.0, "maximum": 1.0 }
    },
    "required": ["missionTarget", "route", "engine", "tanks"]
  }
}
```

### 2.2. `query_jpl_ephemeris`
Fetches verified heliocentric orbital coordinates, distance from Sun, and light-time delay for any Solar System body.

```json
{
  "name": "query_jpl_ephemeris",
  "description": "Queries NASA/JPL planetary ephemeris vectors and astronomical parameters.",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "string",
        "enum": ["Sun", "Mercury", "Venus", "Earth", "Moon", "Mars", "Ceres", "Jupiter", "Saturn", "Uranus", "Neptune"]
      },
      "epochDays": { "type": "number", "description": "Days since J2000 epoch" }
    },
    "required": ["body"]
  }
}
```

### 2.3. `inspect_citygml_district`
Retrieves 3DCityDB LoD semantic building data and aerospace facilities for Forge City.

```json
{
  "name": "inspect_citygml_district",
  "description": "Queries OGC CityGML semantic metadata for a specific Forge City district.",
  "parameters": {
    "type": "object",
    "properties": {
      "districtId": {
        "type": "string",
        "enum": ["space-center", "academy", "launch-complex", "antigravity", "hangar", "observatory"]
      }
    },
    "required": ["districtId"]
  }
}
```
