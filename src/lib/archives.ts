// NASA Spacecraft and Science Instrument Reference Archives (§Master Build)
// Every entry contains verified real-world NASA specifications contrasted with Mission Forge game simulation models.
// Source citations reference official NASA / JPL mission pages and NSSDCA master catalogs.

export interface SpacecraftRecord {
  id: string;
  name: string;
  agency: string;
  launchDate: string;
  target: string;
  status: "Active" | "Completed" | "Interstellar" | "En Route";
  realSpecs: {
    launchMassKg: number;
    propulsionType: string;
    propellantMassKg?: number;
    primaryPower: string;
    missionCost?: string;
  };
  simulationModel: {
    engineEquivalent: string;
    massTier: string;
    powerSource: string;
    gameInstruments: string[];
    simplificationNote: string;
  };
  significance: string;
  sourceUrl: string;
  imageUrl: string;
}

export interface InstrumentRecord {
  id: string;
  acronym: string;
  name: string;
  hostMission: string;
  targetBody: string;
  realSpecs: {
    massKg: number;
    powerWatts: number;
    measurementType: string;
    resolutionOrBand?: string;
  };
  simulationMapping: {
    gameInstrumentId: "camera" | "spectrometer" | "radiation" | "radar" | "drill";
    gameSciencePoints: number;
    gameKwDraw: number;
    gameMassKg: number;
    fidelityComparison: string;
  };
  primaryDiscovery: string;
  sourceUrl: string;
}

export const NASA_SPACECRAFT_ARCHIVE: SpacecraftRecord[] = [
  {
    id: "orion",
    name: "Orion MPCV",
    agency: "NASA / ESA",
    launchDate: "2022-11-16 (Artemis I)",
    target: "Moon (Cislunar / NRHO)",
    status: "Active",
    realSpecs: {
      launchMassKg: 25848,
      propulsionType: "Aerojet AJ10-190 (OMS-E) + 8 aux thrusters (hypergolic)",
      propellantMassKg: 8600,
      primaryPower: "4 solar array wings (11.1 kW total at 1 AU)",
    },
    simulationModel: {
      engineEquivalent: "Chemical Rocket (RL10 / Hydrolox analog)",
      massTier: "Heavy Crew Vehicle (25,000+ kg)",
      powerSource: "4x High-Efficiency Solar Wings",
      gameInstruments: ["camera", "radiation"],
      simplificationNote: "In Mission Forge, Orion's chassis is modularized into configurable tank rings, solar wings, and science bays for deep-space exploration.",
    },
    significance: "Exploration-class crew vehicle for NASA Artemis lunar missions and future human deep-space operations.",
    sourceUrl: "https://www.nasa.gov/humans-in-space/orion-spacecraft/",
    imageUrl: "/images/nasa-earth-blue-marble.svg",
  },
  {
    id: "jwst",
    name: "James Webb Space Telescope (JWST)",
    agency: "NASA / ESA / CSA",
    launchDate: "2021-12-25",
    target: "Sun-Earth L2 Lagrange Point (~1.5M km)",
    status: "Active",
    realSpecs: {
      launchMassKg: 6161,
      propulsionType: "Secondary Combustion Augmented Thrusters (SCAT) hydrazine/NTO",
      propellantMassKg: 301,
      primaryPower: "Deployable solar array (2.0 kW)",
    },
    simulationModel: {
      engineEquivalent: "Low-thrust Stationkeeping Monopropellant",
      massTier: "Medium Observatory (~6,200 kg)",
      powerSource: "Deployable Solar Array + 5-Layer Sunshield",
      gameInstruments: ["camera", "spectrometer"],
      simplificationNote: "Mission Forge models JWST's extreme thermal isolation requirements through radiation and shield durability parameters.",
    },
    significance: "Premier infrared space observatory unraveling cosmic dawn, early galaxy formation, and exoplanet atmospheric chemistry.",
    sourceUrl: "https://webb.nasa.gov/",
    imageUrl: "/images/nasa-earth-blue-marble.svg",
  },
  {
    id: "perseverance",
    name: "Perseverance Rover & Ingenuity",
    agency: "NASA / JPL",
    launchDate: "2020-07-30",
    target: "Mars (Jezero Crater)",
    status: "Active",
    realSpecs: {
      launchMassKg: 1025,
      propulsionType: "Sky Crane descent stage (hydrazine thrusters)",
      primaryPower: "MMRTG (~110 W electric) + Li-ion batteries",
    },
    simulationModel: {
      engineEquivalent: "Terminal Descent Thruster Stage",
      massTier: "Heavy Surface Rover (1,025 kg)",
      powerSource: "Multi-Mission Radioisotope Thermoelectric Generator (MMRTG)",
      gameInstruments: ["camera", "spectrometer", "drill", "radiation", "radar"],
      simplificationNote: "The Entry, Descent, and Landing (EDL) phase in Mission Forge replicates Perseverance's heatshield jettison, parachute, and terminal thruster sequence.",
    },
    significance: "Seeking signs of ancient microbial life and collecting sealed core rock samples for Mars Sample Return.",
    sourceUrl: "https://mars.nasa.gov/mars2020/",
    imageUrl: "/images/nasa-mars.svg",
  },
  {
    id: "europa-clipper",
    name: "Europa Clipper",
    agency: "NASA / JPL / APL",
    launchDate: "2024-10-14",
    target: "Jupiter & Europa",
    status: "En Route",
    realSpecs: {
      launchMassKg: 6000,
      propulsionType: "Bipropellant MMH / MON-3 engines (24 x 27.5 N thrusters)",
      propellantMassKg: 2750,
      primaryPower: "Massive 30-meter span solar wings (700 W at Jupiter)",
    },
    simulationModel: {
      engineEquivalent: "Chemical / Bi-propellant Deep-Space Engine",
      massTier: "Large Planetary Explorer (6,000 kg)",
      powerSource: "Ultra-Large Solar Wings (4-6 wings required at 5.2 AU)",
      gameInstruments: ["radar", "spectrometer", "camera", "radiation"],
      simplificationNote: "Reflects the severe inverse-square solar flux penalty modeled in Mission Forge's power balance calculations.",
    },
    significance: "Investigating the ice shell, subsurface ocean, composition, and geology of Jupiter's moon Europa for habitability.",
    sourceUrl: "https://science.nasa.gov/mission/europa-clipper/",
    imageUrl: "/images/nasa-europa.svg",
  },
  {
    id: "dawn",
    name: "Dawn",
    agency: "NASA / JPL",
    launchDate: "2007-09-27",
    target: "Asteroid Belt (Vesta & Ceres)",
    status: "Completed",
    realSpecs: {
      launchMassKg: 1218,
      propulsionType: "3 x NSTAR Xenon Ion Thrusters (Isp 3,100 s, 92 mN thrust)",
      propellantMassKg: 425,
      primaryPower: "Dual 8.3-meter solar arrays (10 kW at 1 AU, 1.3 kW at Ceres)",
    },
    simulationModel: {
      engineEquivalent: "NSTAR Ion Thruster (Isp 3,100 s in Mission Forge)",
      massTier: "Compact Probe (~1,200 kg)",
      powerSource: "High-Area Solar Arrays",
      gameInstruments: ["camera", "spectrometer"],
      simplificationNote: "Dawn is the real-world operational gold standard for the Ion engine available in Mission Forge's Hangar.",
    },
    significance: "First spacecraft to orbit two separate extraterrestrial bodies (Vesta in 2011, Ceres in 2015) using continuous solar-electric propulsion.",
    sourceUrl: "https://science.nasa.gov/mission/dawn/",
    imageUrl: "/images/nasa-ceres.svg",
  },
  {
    id: "cassini",
    name: "Cassini-Huygens",
    agency: "NASA / ESA / ASI",
    launchDate: "1997-10-15",
    target: "Saturn & Titan",
    status: "Completed",
    realSpecs: {
      launchMassKg: 5712,
      propulsionType: "Dual 445 N R-4D bipropellant engines",
      propellantMassKg: 3132,
      primaryPower: "3 x GPHS-RTG (~885 W at launch, 633 W at end of mission)",
    },
    simulationModel: {
      engineEquivalent: "Chemical Engine + Multi-RTG Power Architecture",
      massTier: "Flagship Deep Space Craft",
      powerSource: "Radioisotope Thermoelectric Generators (RTG)",
      gameInstruments: ["radar", "spectrometer", "camera", "radiation"],
      simplificationNote: "Proves the necessity of RTG power at Saturn (~9.5 AU), where solar panels produce less than 1.1% of terrestrial power.",
    },
    significance: "Discovered active water vapor cryogeysers on Enceladus and methane lakes and dense organic haze on Titan.",
    sourceUrl: "https://science.nasa.gov/mission/cassini/",
    imageUrl: "/images/nasa-saturn.svg",
  },
  {
    id: "lro",
    name: "Lunar Reconnaissance Orbiter (LRO)",
    agency: "NASA / GSFC",
    launchDate: "2009-06-18",
    target: "Moon (Low Lunar Orbit)",
    status: "Active",
    realSpecs: {
      launchMassKg: 1916,
      propulsionType: "Hydrazine monopropellant thrusters (890 kg fuel)",
      primaryPower: "Single solar array wing (1,850 W) + Li-ion batteries",
    },
    simulationModel: {
      engineEquivalent: "Chemical Orbit-Insertion System",
      massTier: "Lunar Orbital Scout (~1,900 kg)",
      powerSource: "Solar Array + Battery Storage",
      gameInstruments: ["camera", "radar", "radiation"],
      simplificationNote: "Supplied the high-precision elevation and thermal data underlying Mission Forge's Lunar landing targets.",
    },
    significance: "Created the most comprehensive topographical 3D map of the Moon and identified water ice deposits in permanently shadowed craters.",
    sourceUrl: "https://science.nasa.gov/mission/lro/",
    imageUrl: "/images/nasa-moon.svg",
  },
  {
    id: "voyager1",
    name: "Voyager 1 & 2",
    agency: "NASA / JPL",
    launchDate: "1977-08-20 & 1977-09-05",
    target: "Outer Planets & Interstellar Space",
    status: "Interstellar",
    realSpecs: {
      launchMassKg: 815,
      propulsionType: "16 x hydrazine monopropellant MR-102 thrusters",
      propellantMassKg: 104,
      primaryPower: "3 x MHW-RTG (470 W at launch, currently ~220 W)",
    },
    simulationModel: {
      engineEquivalent: "Gravity Assist Trajectory + Micro-Hydrazine Reaction Control",
      massTier: "Deep Space Scout (815 kg)",
      powerSource: "Plutonium-238 RTG (Continuous >48 year lifetime)",
      gameInstruments: ["radiation", "camera", "spectrometer"],
      simplificationNote: "Voyager's trajectory inspired the 'Gravity Assist' route option in Mission Forge, minimizing required propellant mass.",
    },
    significance: "Farthest human-made object in history (>162 AU from Earth), actively transmitting telemetry from beyond the heliopause.",
    sourceUrl: "https://voyager.jpl.nasa.gov/",
    imageUrl: "/images/nasa-earth-blue-marble.svg",
  },
];

export const NASA_INSTRUMENTS_ARCHIVE: InstrumentRecord[] = [
  {
    id: "mastcam",
    acronym: "Mastcam",
    name: "Mast Camera System",
    hostMission: "Curiosity (MSL) & Perseverance (Mastcam-Z)",
    targetBody: "Mars",
    realSpecs: {
      massKg: 4.0,
      powerWatts: 13,
      measurementType: "Multispectral stereo color imaging & 4K video",
      resolutionOrBand: "1600x1200 CCD with optical zoom 28-100mm",
    },
    simulationMapping: {
      gameInstrumentId: "camera",
      gameSciencePoints: 15,
      gameKwDraw: 0.2,
      gameMassKg: 85,
      fidelityComparison: "Mission Forge groups optical and stereoscopic imager payloads into the standard high-resolution camera assembly.",
    },
    primaryDiscovery: "Identified cross-bedding sedimentary structures in Gale Crater confirming sustained ancient river flows.",
    sourceUrl: "https://mars.nasa.gov/msl/spacecraft/instruments/mastcam/",
  },
  {
    id: "hirise",
    acronym: "HiRISE",
    name: "High Resolution Imaging Science Experiment",
    hostMission: "Mars Reconnaissance Orbiter (MRO)",
    targetBody: "Mars",
    realSpecs: {
      massKg: 65.0,
      powerWatts: 60,
      measurementType: "Ultra-high resolution telescopic imaging (visible & near-IR)",
      resolutionOrBand: "0.5m aperture Cassegrain telescope (up to 30 cm/pixel resolution)",
    },
    simulationMapping: {
      gameInstrumentId: "camera",
      gameSciencePoints: 20,
      gameKwDraw: 0.3,
      gameMassKg: 85,
      fidelityComparison: "Provides the orbital imaging baseline used to scout landing sites across Mars in the simulator.",
    },
    primaryDiscovery: "Detected seasonal Recurring Slope Lineae (RSL), avalanche events, and dynamic dust devil tracks in Martian dunes.",
    sourceUrl: "https://www.uahirise.org/",
  },
  {
    id: "mise",
    acronym: "MISE",
    name: "Mapping Imaging Spectrometer for Europa",
    hostMission: "Europa Clipper",
    targetBody: "Europa",
    realSpecs: {
      massKg: 29.5,
      powerWatts: 42,
      measurementType: "Short-wave Infrared Imaging Spectrometry (0.8 to 5.0 µm)",
      resolutionOrBand: "High spectral resolution to detect organics, salts, and hydrated minerals",
    },
    simulationMapping: {
      gameInstrumentId: "spectrometer",
      gameSciencePoints: 25,
      gameKwDraw: 0.4,
      gameMassKg: 120,
      fidelityComparison: "Corresponds directly to the game's onboard Spectrometer instrument required for high-tier chemistry objectives.",
    },
    primaryDiscovery: "Designed to identify ocean salts and organic compounds deposited on Europa's young fractured surface ridges.",
    sourceUrl: "https://science.nasa.gov/mission/europa-clipper/spacecraft-instruments/mise/",
  },
  {
    id: "rad",
    acronym: "RAD",
    name: "Radiation Assessment Detector",
    hostMission: "Curiosity Rover (MSL)",
    targetBody: "Mars (Cruise & Surface)",
    realSpecs: {
      massKg: 1.56,
      powerWatts: 4.2,
      measurementType: "Energetic particle detector (Galactic Cosmic Rays & Solar Particle Events)",
      resolutionOrBand: "Measures atomic numbers Z=1 to Z=26 with energy from 10 to 1000 MeV/nuc",
    },
    simulationMapping: {
      gameInstrumentId: "radiation",
      gameSciencePoints: 20,
      gameKwDraw: 0.25,
      gameMassKg: 95,
      fidelityComparison: "Direct real-world basis for the 'Radiation Sensor' in Mission Forge that mitigates space weather hazard encounters.",
    },
    primaryDiscovery: "Quantified cosmic radiation dosage during interplanetary transit (~1.8 mSv/day), crucial for human Mars mission architectures.",
    sourceUrl: "https://www.nasa.gov/mission_pages/msl/building_curiosity/rad.html",
  },
  {
    id: "reason",
    acronym: "REASON",
    name: "Radar for Europa Assessment and Sounding: Ocean to Near-surface",
    hostMission: "Europa Clipper",
    targetBody: "Europa",
    realSpecs: {
      massKg: 43.6,
      powerWatts: 75,
      measurementType: "Dual-frequency ice-penetrating radar (9 MHz & 60 MHz)",
      resolutionOrBand: "Penetration depth up to 30 km into cryogenic water ice",
    },
    simulationMapping: {
      gameInstrumentId: "radar",
      gameSciencePoints: 25,
      gameKwDraw: 0.5,
      gameMassKg: 140,
      fidelityComparison: "Mirrors the game's Ice-Penetrating Radar instrument for probing Europa, Enceladus, and Mars polar caps.",
    },
    primaryDiscovery: "Engineered to map the thickness of Europa's icy shell and determine if warm pockets or liquid water reach near the crust.",
    sourceUrl: "https://science.nasa.gov/mission/europa-clipper/spacecraft-instruments/reason/",
  },
  {
    id: "lola",
    acronym: "LOLA",
    name: "Lunar Orbiter Laser Altimeter",
    hostMission: "Lunar Reconnaissance Orbiter (LRO)",
    targetBody: "Moon",
    realSpecs: {
      massKg: 11.4,
      powerWatts: 33.7,
      measurementType: "5-beam Nd:YAG laser altimeter pulses at 28 Hz (1064 nm)",
      resolutionOrBand: "Vertical precision < 10 cm, horizontal surface footprint ~5 m",
    },
    simulationMapping: {
      gameInstrumentId: "radar",
      gameSciencePoints: 20,
      gameKwDraw: 0.35,
      gameMassKg: 140,
      fidelityComparison: "Simulates topographic LIDAR and radar altimetry essential for safe obstacle avoidance during descent.",
    },
    primaryDiscovery: "Produced the most precise global elevation model of any celestial body, identifying optimal permanently lit crater rims for Artemis base camps.",
    sourceUrl: "https://lola.gsfc.nasa.gov/",
  },
  {
    id: "sam",
    acronym: "SAM",
    name: "Sample Analysis at Mars",
    hostMission: "Curiosity Rover (MSL)",
    targetBody: "Mars",
    realSpecs: {
      massKg: 38.0,
      powerWatts: 150,
      measurementType: "Quadrupole mass spectrometer, gas chromatograph & tunable laser spectrometer",
      resolutionOrBand: "Detects trace volatile organic compounds down to parts-per-billion",
    },
    simulationMapping: {
      gameInstrumentId: "drill",
      gameSciencePoints: 30,
      gameKwDraw: 0.8,
      gameMassKg: 210,
      fidelityComparison: "Represented in Mission Forge as the combined Core Drill & Chemical Sample Analysis package for surface landers.",
    },
    primaryDiscovery: "First in-situ detection of indigenous organic molecules (chlorobenzene, sulfur-bearing thiophenes) in ancient Martian mudstone.",
    sourceUrl: "https://science.nasa.gov/mission/curiosity/instruments/sam/",
  },
];
