// NASA Real Mission Presets & Registry (§Master Build Phase 2)
// Provides historical reference missions that can be directly loaded into the Mission Forge simulator.
// Clearly marked as "MISSION-INSPIRED GAME CONFIGURATION" — never implying players operate real flight hardware.

import type { EngineId, Instrument, MissionId, RouteId } from "./mission-sim";

export interface MissionPreset {
  id: string;
  name: string;
  badge: string;
  referenceMission: string;
  agency: string;
  launchYear: number;
  destination: MissionId;
  route: RouteId;
  objective: "surface" | "orbit" | "survey";
  craftConfiguration: {
    craft: "explorer" | "surveyor" | "guardian";
    engine: EngineId;
    engines: number;
    tanks: number;
    wings: number;
    rtgs: number;
    antennas: number;
    shield: boolean;
    battery: boolean;
    instruments: Instrument[];
    budget: number;
  };
  summary: string;
  scientificMilestone: string;
  engineeringTradeoff: string;
  officialSource: string;
  sourceUrl: string;
  verified: boolean;
}

export const REAL_MISSION_PRESETS: MissionPreset[] = [
  {
    id: "perseverance-preset",
    name: "Perseverance-Inspired",
    badge: "Mars 2020",
    referenceMission: "Mars 2020 Perseverance & Ingenuity",
    agency: "NASA / JPL",
    launchYear: 2020,
    destination: "Mars",
    route: "safe",
    objective: "surface",
    craftConfiguration: {
      craft: "explorer",
      engine: "chemical",
      engines: 1,
      tanks: 4,
      wings: 2,
      rtgs: 1,
      antennas: 2,
      shield: true,
      battery: true,
      instruments: ["camera", "spectrometer", "radar"],
      budget: 3,
    },
    summary: "Heavy robotic surface rover equipped with MMRTG nuclear power, high-gain communications, and subsurface sounding radar for crater exploration.",
    scientificMilestone: "Collecting the first hermetically sealed rock cores from Mars for Earth return; conducted first powered flight on another planet.",
    engineeringTradeoff: "Heavy payload mass (>1,025 kg) requires a dedicated heat shield and terminal retro-propulsion stage for safe entry descent.",
    officialSource: "NASA JPL Mars 2020 Mission Overview",
    sourceUrl: "https://mars.nasa.gov/mars2020/",
    verified: true,
  },
  {
    id: "dawn-preset",
    name: "Dawn-Inspired",
    badge: "Discovery 9",
    referenceMission: "Dawn (Vesta & Ceres)",
    agency: "NASA / JPL",
    launchYear: 2007,
    destination: "Ceres",
    route: "science",
    objective: "orbit",
    craftConfiguration: {
      craft: "surveyor",
      engine: "ion",
      engines: 1,
      tanks: 2,
      wings: 6,
      rtgs: 0,
      antennas: 2,
      shield: false,
      battery: true,
      instruments: ["camera", "spectrometer", "radiation"],
      budget: 2,
    },
    summary: "Solar-electric ion-propelled scout with large solar arrays, trading low instantaneous thrust for extraordinary specific impulse (Isp 3,100 s).",
    scientificMilestone: "First spacecraft to orbit two separate extraterrestrial bodies, discovering bright sodium carbonate brine deposits in Occator Crater.",
    engineeringTradeoff: "Ion propulsion requires high electrical power (2.3 kW per engine) and gradual transfer times, but dramatically reduces propellant mass.",
    officialSource: "NASA JPL Dawn Science Mission",
    sourceUrl: "https://science.nasa.gov/mission/dawn/",
    verified: true,
  },
  {
    id: "europa-clipper-preset",
    name: "Europa Clipper-Inspired",
    badge: "Ocean Worlds",
    referenceMission: "Europa Clipper",
    agency: "NASA / JPL / APL",
    launchYear: 2024,
    destination: "Europa",
    route: "science",
    objective: "orbit",
    craftConfiguration: {
      craft: "guardian",
      engine: "chemical",
      engines: 2,
      tanks: 4,
      wings: 6,
      rtgs: 1,
      antennas: 2,
      shield: true,
      battery: true,
      instruments: ["radar", "spectrometer", "camera", "radiation"],
      budget: 3,
    },
    summary: "Flagship deep-space explorer carrying massive solar wings and ice-penetrating radar to study Jupiter's ocean moon Europa under severe radiation.",
    scientificMilestone: "Investigating the salinity, depth, and habitability of Europa's subsurface ocean through 49 low-altitude flybys.",
    engineeringTradeoff: "Extreme Jovian radiation demands thick titanium shielding and Whipple shields, while low solar flux at 5.2 AU requires giant solar arrays.",
    officialSource: "NASA Europa Clipper Mission Site",
    sourceUrl: "https://science.nasa.gov/mission/europa-clipper/",
    verified: true,
  },
  {
    id: "voyager-preset",
    name: "Voyager-Inspired",
    badge: "Grand Tour",
    referenceMission: "Voyager 1 & 2",
    agency: "NASA / JPL",
    launchYear: 1977,
    destination: "Saturn",
    route: "safe",
    objective: "survey",
    craftConfiguration: {
      craft: "surveyor",
      engine: "chemical",
      engines: 1,
      tanks: 3,
      wings: 0,
      rtgs: 3,
      antennas: 2,
      shield: true,
      battery: false,
      instruments: ["camera", "radiation", "spectrometer"],
      budget: 2,
    },
    summary: "Deep-space reconnaissance probe powered entirely by radioisotope thermoelectric generators (RTGs) and directed via gravity-assist trajectories.",
    scientificMilestone: "Carried humanity's Golden Record and crossed the heliopause into interstellar space after exploring Jupiter, Saturn, Uranus, and Neptune.",
    engineeringTradeoff: "Zero solar panel reliance ensures uninterrupted continuous power beyond 10 AU, at the cost of fixed isotope thermal decay over decades.",
    officialSource: "NASA JPL Voyager Interstellar Mission",
    sourceUrl: "https://voyager.jpl.nasa.gov/",
    verified: true,
  },
  {
    id: "juno-preset",
    name: "Juno-Inspired",
    badge: "New Frontiers",
    referenceMission: "Juno (Jupiter Polar Explorer)",
    agency: "NASA / JPL / SwRI",
    launchYear: 2011,
    destination: "Jupiter",
    route: "fast",
    objective: "orbit",
    craftConfiguration: {
      craft: "guardian",
      engine: "chemical",
      engines: 1,
      tanks: 4,
      wings: 6,
      rtgs: 0,
      antennas: 2,
      shield: true,
      battery: true,
      instruments: ["camera", "spectrometer", "radiation"],
      budget: 2,
    },
    summary: "Pioneering solar-powered Jupiter orbiter in a highly eccentric polar orbit designed to skim under the most lethal radiation belts.",
    scientificMilestone: "Discovered Jupiter's diluted core, giant geometric polar storms, and deep water-vapor atmospheric composition.",
    engineeringTradeoff: "Requires 6 solar wings to extract enough electricity from 4% terrestrial sunlight at 5.2 AU.",
    officialSource: "NASA JPL Juno Mission",
    sourceUrl: "https://science.nasa.gov/mission/juno/",
    verified: true,
  },
  {
    id: "artemis-orion-preset",
    name: "Artemis Orion-Inspired",
    badge: "Artemis I",
    referenceMission: "Orion Multi-Purpose Crew Vehicle",
    agency: "NASA / ESA",
    launchYear: 2022,
    destination: "Moon",
    route: "safe",
    objective: "surface",
    craftConfiguration: {
      craft: "explorer",
      engine: "chemical",
      engines: 1,
      tanks: 4,
      wings: 4,
      rtgs: 0,
      antennas: 2,
      shield: true,
      battery: true,
      instruments: ["camera", "radiation"],
      budget: 3,
    },
    summary: "Heavy exploration crew spacecraft built for lunar transit, high-speed atmospheric re-entry, and deep-space cislunar endurance.",
    scientificMilestone: "Successfully completed Artemis I 2.2-million-kilometer lunar orbital shakedown, validating heat shield endurance at 40,000 km/h entry speed.",
    engineeringTradeoff: "Very high launch mass (~25,800 kg) demands the heavy-lift capacity of the Space Launch System (SLS Block 1).",
    officialSource: "NASA Artemis Program",
    sourceUrl: "https://www.nasa.gov/humans-in-space/orion-spacecraft/",
    verified: true,
  },
  {
    id: "titan-dragonfly-preset",
    name: "Dragonfly-Inspired",
    badge: "New Frontiers 4",
    referenceMission: "Dragonfly Rotorcraft",
    agency: "NASA / JHU APL",
    launchYear: 2028,
    destination: "Titan",
    route: "science",
    objective: "surface",
    craftConfiguration: {
      craft: "explorer",
      engine: "chemical",
      engines: 1,
      tanks: 3,
      wings: 0,
      rtgs: 2,
      antennas: 2,
      shield: true,
      battery: true,
      instruments: ["drone", "spectrometer", "radar"],
      budget: 3,
    },
    summary: "Dual-quadcopter rotorcraft lander that exploits Titan's dense nitrogen atmosphere (4x Earth surface density) and low gravity (0.14g) to fly between science sites.",
    scientificMilestone: "Designed to search for chemical biosignatures and prebiotic organic synthesis across Selk Crater sand dunes.",
    engineeringTradeoff: "Requires MMRTG nuclear battery to recharge overnight in dense cryogenic nitrogen air (-180°C).",
    officialSource: "Johns Hopkins APL Dragonfly Mission",
    sourceUrl: "https://dragonfly.jhuapl.edu/",
    verified: true,
  },
];
