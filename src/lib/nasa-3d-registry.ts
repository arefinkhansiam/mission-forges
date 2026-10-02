/**
 * NASA 3D RESOURCES REGISTRY & PROVENANCE SYSTEM
 * Official Source: NASA/NASA-3D-Resources (https://github.com/nasa/NASA-3D-Resources)
 * License / Usage: NASA Open Source Agreement v1.3 / Public Domain
 * Usage Guidelines: https://www.nasa.gov/nasa-brand-center/images-and-media
 * 
 * IMPORTANT ARCHITECTURAL PRINCIPLE:
 * These assets are VISUAL REPRESENTATIONS only. They do not constitute scientific calculation
 * data. Mission calculations (Δv, ephemerides, solar flux, trajectories) are derived from
 * NASA/JPL Horizons, Tsiolkovsky equations, and physical constants.
 */

export interface Nasa3DAsset {
  id: string;
  name: string;
  category: "Spacecraft" | "Celestial" | "Asteroid" | "Rotorcraft" | "Observatory" | "Textures";
  source: "NASA 3D Resources";
  repository: "NASA/NASA-3D-Resources";
  originalPath: string;
  organization: string;
  license: string;
  originalFormat: string;
  webFormat: string;
  fileSizeKb: number;
  localPath: string;
  usedIn: string[];
  attribution: string;
  description: string;
  technicalNotes?: string;
}

export interface RejectedAssetAudit {
  name: string;
  path: string;
  originalFormat: string;
  fileSizeApprox: string;
  rejectionReason: "STL mesh lacks UV/material maps" | "Requires desktop Blender (.blend)" | "Excessive archive size (>50MB)" | "Irrelevant to planetary mission simulation";
  notes: string;
}

/**
 * Curated and verified NASA 3D assets integrated into Mission Forge.
 * Every single entry below physically exists in public/models/ or public/textures/nasa-3d/
 * and maps 1:1 to NASA/NASA-3D-Resources.
 */
export const NASA_3D_ASSETS: Nasa3DAsset[] = [
  {
    id: "voyager-probe",
    name: "Voyager 1 & 2 Interstellar Probe",
    category: "Spacecraft",
    source: "NASA 3D Resources",
    repository: "NASA/NASA-3D-Resources",
    originalPath: "3D Models/Voyager Probe (A)/Voyager Probe (A).glb",
    organization: "NASA Jet Propulsion Laboratory (JPL-Caltech)",
    license: "NASA Open Source Agreement / Public Domain",
    originalFormat: "GLB (glTF 2.0 Binary)",
    webFormat: "GLB 2.0 (Optimized PBR)",
    fileSizeKb: 279,
    localPath: "/models/voyager-probe.glb",
    usedIn: ["3D Hangar (Voyager Preset)", "Deep Space Flight Simulation", "NASA 3D Asset Library"],
    attribution: "NASA / JPL-Caltech / NASA 3D Resources",
    description: "Twin probes launched in 1977 that explored Jupiter, Saturn, Uranus, Neptune and entered interstellar space. Features 3.7m high-gain antenna, RTGs, and magnetometer boom.",
    technicalNotes: "Superb web optimization: only 279 KB, native Three.js GLTFLoader support with low draw-call overhead."
  },
  {
    id: "galileo",
    name: "Galileo Jupiter Orbiter & Probe",
    category: "Spacecraft",
    source: "NASA 3D Resources",
    repository: "NASA/NASA-3D-Resources",
    originalPath: "3D Models/Galileo/Galileo.glb",
    organization: "NASA Jet Propulsion Laboratory (JPL-Caltech)",
    license: "NASA Open Source Agreement / Public Domain",
    originalFormat: "GLB (glTF 2.0 Binary)",
    webFormat: "GLB 2.0 (Optimized PBR)",
    fileSizeKb: 243,
    localPath: "/models/galileo.glb",
    usedIn: ["Jupiter Atmospheric Mission", "3D Hangar Spacecraft Selection", "NASA 3D Asset Library"],
    attribution: "NASA / JPL-Caltech / NASA 3D Resources",
    description: "The first spacecraft to orbit Jupiter and deploy an atmospheric descent probe into its clouds in 1995. Revealed liquid oceans beneath Europa's icy crust.",
    technicalNotes: "Ultra-compact 243 KB binary mesh. Dual-spin design with spun and despun sections preserved."
  },
  {
    id: "dawn",
    name: "Dawn Asteroid Belt Explorer",
    category: "Spacecraft",
    source: "NASA 3D Resources",
    repository: "NASA/NASA-3D-Resources",
    originalPath: "3D Models/Dawn/Dawn.glb",
    organization: "NASA Jet Propulsion Laboratory (JPL-Caltech)",
    license: "NASA Open Source Agreement / Public Domain",
    originalFormat: "GLB (glTF 2.0 Binary)",
    webFormat: "GLB 2.0 (Optimized PBR)",
    fileSizeKb: 905,
    localPath: "/models/dawn.glb",
    usedIn: ["Ceres Mission Visualizer", "Ion Engine Craft View", "NASA 3D Asset Library"],
    attribution: "NASA / JPL-Caltech / Orbital Sciences / NASA 3D Resources",
    description: "NASA mission that orbited both giant asteroid Vesta and dwarf planet Ceres utilizing high-efficiency xenon ion propulsion (NSTAR thrusters).",
    technicalNotes: "High-resolution solar arrays (19.7m wingspan) with accurate ion engine gimbal nozzle placement."
  },
  {
    id: "deep-space-1",
    name: "Deep Space 1 Ion Propulsion Demonstrator",
    category: "Spacecraft",
    source: "NASA 3D Resources",
    repository: "NASA/NASA-3D-Resources",
    originalPath: "3D Models/Deep Space 1/Deep Space 1.glb",
    organization: "NASA Jet Propulsion Laboratory / New Millennium Program",
    license: "NASA Open Source Agreement / Public Domain",
    originalFormat: "GLB (glTF 2.0 Binary)",
    webFormat: "GLB 2.0 (Optimized PBR)",
    fileSizeKb: 913,
    localPath: "/models/deep-space-1.glb",
    usedIn: ["Ion Engine Technical Drawer", "Hangar Alternative Craft", "NASA 3D Asset Library"],
    attribution: "NASA / JPL / NASA 3D Resources",
    description: "First operational spacecraft to fly the 30 cm NSTAR electrostatic xenon ion engine, testing 12 high-risk breakthrough technologies.",
    technicalNotes: "Includes SCARLET concentrating solar array panels and hydrazine attitude-control thrusters."
  },
  {
    id: "asteroid-bennu",
    name: "Near-Earth Asteroid 101955 Bennu (1999 RQ36)",
    category: "Asteroid",
    source: "NASA 3D Resources",
    repository: "NASA/NASA-3D-Resources",
    originalPath: "3D Models/1999 RQ36 asteroid/1999 RQ36 asteroid.glb",
    organization: "NASA Goddard Space Flight Center / OSIRIS-REx Team",
    license: "NASA Open Source Agreement / Public Domain",
    originalFormat: "GLB (glTF 2.0 Binary)",
    webFormat: "GLB 2.0 (Optimized PBR)",
    fileSizeKb: 322,
    localPath: "/models/asteroid-bennu.glb",
    usedIn: ["Asteroid Rendezvous Orbit Scene", "Ceres/Small-Body Encounter", "NASA 3D Asset Library"],
    attribution: "NASA / GSFC / University of Arizona / NASA 3D Resources",
    description: "Topographically accurate shape model of carbonaceous asteroid Bennu derived from radar delay-Doppler observations and OSIRIS-REx altimetry.",
    technicalNotes: "Equatorial ridge and rubble-pile morphology accurately preserved at 322 KB."
  },
  {
    id: "parker-solar-probe",
    name: "Parker Solar Probe",
    category: "Spacecraft",
    source: "NASA 3D Resources",
    repository: "NASA/NASA-3D-Resources",
    originalPath: "3D Models/Parker Solar Probe/Parker Solar Probe.glb",
    organization: "NASA Goddard Space Flight Center / Johns Hopkins APL",
    license: "NASA Open Source Agreement / Public Domain",
    originalFormat: "GLB (glTF 2.0 Binary)",
    webFormat: "GLB 2.0 (Optimized PBR)",
    fileSizeKb: 433,
    localPath: "/models/parker-solar-probe.glb",
    usedIn: ["Mercury Extreme Flux Trajectory", "Thermal Protection Inspection", "NASA 3D Asset Library"],
    attribution: "NASA / JHUAPL / NASA 3D Resources",
    description: "Spacecraft designed to plunge through the Sun's corona at 700,000 km/h, protected by an 11.4 cm thick carbon-composite Thermal Protection Shield (TPS).",
    technicalNotes: "Features white-coated alumina front heat shield and retracted solar arrays for high-heat passes."
  },
  {
    id: "apollo-lunar-module",
    name: "Apollo Lunar Module (Eagle)",
    category: "Spacecraft",
    source: "NASA 3D Resources",
    repository: "NASA/NASA-3D-Resources",
    originalPath: "3D Models/Apollo Lunar Module/Apollo Lunar Module.glb",
    organization: "NASA Johnson Space Center (JSC)",
    license: "NASA Open Source Agreement / Public Domain",
    originalFormat: "GLB (glTF 2.0 Binary)",
    webFormat: "GLB 2.0 (Optimized PBR)",
    fileSizeKb: 716,
    localPath: "/models/apollo-lunar-module.glb",
    usedIn: ["Moon Landing Stage Simulator", "Descent Engine Demonstration", "NASA 3D Asset Library"],
    attribution: "NASA / JSC / Grumman Aerospace / NASA 3D Resources",
    description: "The two-stage descent/ascent vehicle that carried astronauts to the lunar surface. Features throttleable descent engine and Kapton thermal shielding foil.",
    technicalNotes: "Authentic multi-layer insulation (gold/amber Kapton foil) shaders with descent landing gear feet."
  },
  {
    id: "cassini-huygens",
    name: "Cassini-Huygens Saturn Orbiter & Titan Probe",
    category: "Spacecraft",
    source: "NASA 3D Resources",
    repository: "NASA/NASA-3D-Resources",
    originalPath: "3D Models/Cassini-Huygens (A)/Cassini-Huygens (A).glb",
    organization: "NASA Jet Propulsion Laboratory / ESA / ASI",
    license: "NASA Open Source Agreement / Public Domain",
    originalFormat: "GLB (glTF 2.0 Binary)",
    webFormat: "GLB 2.0 (Optimized PBR)",
    fileSizeKb: 1622,
    localPath: "/models/cassini-huygens.glb",
    usedIn: ["Saturn System Flyby", "Titan Entry Visualizer", "NASA 3D Asset Library"],
    attribution: "NASA / JPL-Caltech / ESA / ASI / NASA 3D Resources",
    description: "Massive outer-planet flagship orbiter that explored Saturn, its rings and moons for 13 years, carrying the ESA Huygens probe that landed on Titan.",
    technicalNotes: "Includes 4-meter Cassegrain high-gain antenna, Huygens heat shield, 3 MMRTG radioisotope units, and dual 445 N R-4D main engines."
  },
  {
    id: "hubble",
    name: "Hubble Space Telescope",
    category: "Observatory",
    source: "NASA 3D Resources",
    repository: "NASA/NASA-3D-Resources",
    originalPath: "3D Models/Hubble Space Telescope (A)/Hubble Space Telescope (A).glb",
    organization: "NASA Goddard Space Flight Center (GSFC) / ESA",
    license: "NASA Open Source Agreement / Public Domain",
    originalFormat: "GLB (glTF 2.0 Binary)",
    webFormat: "GLB 2.0 (Optimized PBR)",
    fileSizeKb: 1655,
    localPath: "/models/hubble.glb",
    usedIn: ["Docking & Orbital Repair Stage", "Avionics Maintenance Mission", "NASA 3D Asset Library"],
    attribution: "NASA / GSFC / STScI / ESA / NASA 3D Resources",
    description: "Pioneering 2.4-meter Ritchey-Chrétien space telescope launched in 1990. Serviced in orbit 5 times by NASA Space Shuttle astronaut crews.",
    technicalNotes: "Aperture door, solar arrays, and aft shroud with orbital replacement handrails accurately modeled."
  },
  {
    id: "viking-lander",
    name: "Viking Mars Lander",
    category: "Spacecraft",
    source: "NASA 3D Resources",
    repository: "NASA/NASA-3D-Resources",
    originalPath: "3D Models/Viking Lander/Viking Lander.glb",
    organization: "NASA Langley Research Center / NASA JPL",
    license: "NASA Open Source Agreement / Public Domain",
    originalFormat: "GLB (glTF 2.0 Binary)",
    webFormat: "GLB 2.0 (Optimized PBR)",
    fileSizeKb: 1806,
    localPath: "/models/viking-lander.glb",
    usedIn: ["Mars Landing Sequence", "Historic Lander Comparison", "NASA 3D Asset Library"],
    attribution: "NASA / LaRC / Martin Marietta / NASA 3D Resources",
    description: "First American probe to achieve a sustained soft landing on Mars in 1976. Included biology experiments, meteorology mast, and soil sampling arm.",
    technicalNotes: "Terminal descent engines, meteorology boom, RTG wind covers, and GCMS inlet modeled."
  },
  {
    id: "ingenuity",
    name: "Ingenuity Mars Helicopter",
    category: "Rotorcraft",
    source: "NASA 3D Resources",
    repository: "NASA/NASA-3D-Resources",
    originalPath: "3D Models/Ingenuity Mars Helicopter/Ingenuity Mars Helicopter.glb",
    organization: "NASA Jet Propulsion Laboratory (JPL-Caltech)",
    license: "NASA Open Source Agreement / Public Domain",
    originalFormat: "GLB (glTF 2.0 Binary)",
    webFormat: "GLB 2.0 (Optimized PBR)",
    fileSizeKb: 1972,
    localPath: "/models/ingenuity.glb",
    usedIn: ["Atmospheric Drone Instrument Detail", "Mars Surface Flight Ops", "NASA 3D Asset Library"],
    attribution: "NASA / JPL-Caltech / AeroVironment / NASA 3D Resources",
    description: "First aircraft to achieve controlled, powered flight on another planet. 1.2-meter counter-rotating coaxial carbon-fiber rotor blades spinning at ~2,400 RPM.",
    technicalNotes: "Detailed swashplates, avionics fuselage box, solar panel mast, and compliant landing legs."
  },
  // PLANETARY & CELESTIAL TEXTURES (NASA Solar System Simulator)
  {
    id: "tex-earth",
    name: "Earth Global Cylindrical Map",
    category: "Textures",
    source: "NASA 3D Resources",
    repository: "NASA/NASA-3D-Resources",
    originalPath: "Images and Textures/Earth (A)/preview.webp",
    organization: "NASA Solar System Simulator / Visible Earth",
    license: "NASA Open Source Agreement / Public Domain",
    originalFormat: "WebP / JPEG / TIFF",
    webFormat: "WebP (462 KB Equirectangular)",
    fileSizeKb: 462,
    localPath: "/textures/nasa-3d/earth.webp",
    usedIn: ["Universe Earth Celestial Sphere", "Home Globe Backdrop", "NASA 3D Asset Library"],
    attribution: "NASA / Goddard Space Flight Center / NASA Solar System Simulator",
    description: "True-color global cylindrical projection texture of Earth based on NASA satellite imagery (MODIS / Blue Marble).",
    technicalNotes: "2048x1024 equirectangular mapping with cloud systems and bathymetry."
  },
  {
    id: "tex-moon",
    name: "Moon Global Albedo Map",
    category: "Textures",
    source: "NASA 3D Resources",
    repository: "NASA/NASA-3D-Resources",
    originalPath: "Images and Textures/Moon/preview.webp",
    organization: "NASA Solar System Simulator / USGS / LRO",
    license: "NASA Open Source Agreement / Public Domain",
    originalFormat: "WebP / JPEG / TIFF",
    webFormat: "WebP (377 KB Equirectangular)",
    fileSizeKb: 377,
    localPath: "/textures/nasa-3d/moon.webp",
    usedIn: ["Universe Moon Celestial Sphere", "Lunar Reconnaissance Orbit", "NASA 3D Asset Library"],
    attribution: "NASA / GSFC / Arizona State University / USGS",
    description: "Global photometric albedo map of the Moon based on Lunar Reconnaissance Orbiter Camera (LROC) Wide Angle Camera mosaics.",
    technicalNotes: "Covers maria, highlands, and far-side impact basins."
  },
  {
    id: "tex-mars",
    name: "Mars Surface Color Mosaic",
    category: "Textures",
    source: "NASA 3D Resources",
    repository: "NASA/NASA-3D-Resources",
    originalPath: "Images and Textures/Mars/preview.webp",
    organization: "NASA Solar System Simulator / USGS Astrogeology",
    license: "NASA Open Source Agreement / Public Domain",
    originalFormat: "WebP / JPEG / TIFF",
    webFormat: "WebP (332 KB Equirectangular)",
    fileSizeKb: 332,
    localPath: "/textures/nasa-3d/mars.webp",
    usedIn: ["Universe Mars Celestial Sphere", "Mars Trajectory & EDL Stage", "NASA 3D Asset Library"],
    attribution: "NASA / JPL-Caltech / USGS Astrogeology Science Center",
    description: "Global color map of Mars combining Viking Orbiter and Mars Global Surveyor (MGS) Mars Orbiter Camera mosaics.",
    technicalNotes: "Displays Valles Marineris canyon system, Olympus Mons, and polar ice caps."
  },
  {
    id: "tex-venus",
    name: "Venus Radar & Atmospheric Composite",
    category: "Textures",
    source: "NASA 3D Resources",
    repository: "NASA/NASA-3D-Resources",
    originalPath: "Images and Textures/Venus/preview.webp",
    organization: "NASA Solar System Simulator / Magellan Project",
    license: "NASA Open Source Agreement / Public Domain",
    originalFormat: "WebP / JPEG / TIFF",
    webFormat: "WebP (422 KB Equirectangular)",
    fileSizeKb: 422,
    localPath: "/textures/nasa-3d/venus.webp",
    usedIn: ["Universe Venus Celestial Sphere", "Venus Atmosphere Mission", "NASA 3D Asset Library"],
    attribution: "NASA / JPL-Caltech / Magellan Mission",
    description: "Synthetic aperture radar surface map combined with cloud ultraviolet brightness variations from Pioneer Venus and Magellan.",
    technicalNotes: "Simulates dense golden runaway greenhouse atmosphere."
  },
  {
    id: "tex-jupiter",
    name: "Jupiter Atmospheric Banding Map",
    category: "Textures",
    source: "NASA 3D Resources",
    repository: "NASA/NASA-3D-Resources",
    originalPath: "Images and Textures/Jupiter/preview.webp",
    organization: "NASA Solar System Simulator / Cassini Imaging Team",
    license: "NASA Open Source Agreement / Public Domain",
    originalFormat: "WebP / JPEG / TIFF",
    webFormat: "WebP (74 KB Equirectangular)",
    fileSizeKb: 74,
    localPath: "/textures/nasa-3d/jupiter.webp",
    usedIn: ["Universe Jupiter Celestial Sphere", "Galileo Probe Entry", "NASA 3D Asset Library"],
    attribution: "NASA / JPL / Space Science Institute (Cassini flyby)",
    description: "True-color cylindrical map of Jupiter's dynamic cloud belts, zones, and Great Red Spot compiled during the Cassini-Huygens flyby.",
    technicalNotes: "Super-compact 74 KB WebP with high visual fidelity."
  },
  {
    id: "tex-europa",
    name: "Europa Ice Fractures & Plumes Map",
    category: "Textures",
    source: "NASA 3D Resources",
    repository: "NASA/NASA-3D-Resources",
    originalPath: "Images and Textures/Jupiter - Europa/preview.webp",
    organization: "NASA Solar System Simulator / Galileo Project",
    license: "NASA Open Source Agreement / Public Domain",
    originalFormat: "WebP / JPEG / TIFF",
    webFormat: "WebP (239 KB Equirectangular)",
    fileSizeKb: 239,
    localPath: "/textures/nasa-3d/europa.webp",
    usedIn: ["Universe Europa Celestial Sphere", "Ocean Worlds Explorer", "NASA 3D Asset Library"],
    attribution: "NASA / JPL-Caltech / DLR / Galileo SSI",
    description: "Mosaic of Europa showing mineral-stained lineae, lenticulae, and chaos terrain indicating an underlying global saltwater ocean.",
    technicalNotes: "High-contrast reddish-brown lineae cracks on icy white plains."
  },
  {
    id: "tex-saturn",
    name: "Saturn Atmosphere & Ring Shadow Map",
    category: "Textures",
    source: "NASA 3D Resources",
    repository: "NASA/NASA-3D-Resources",
    originalPath: "Images and Textures/Saturn/preview.webp",
    organization: "NASA Solar System Simulator / Cassini Project",
    license: "NASA Open Source Agreement / Public Domain",
    originalFormat: "WebP / JPEG / TIFF",
    webFormat: "WebP (83 KB Equirectangular)",
    fileSizeKb: 83,
    localPath: "/textures/nasa-3d/saturn.webp",
    usedIn: ["Universe Saturn Celestial Sphere", "Deep Space Flyby", "NASA 3D Asset Library"],
    attribution: "NASA / JPL-Caltech / Space Science Institute",
    description: "Global cylindrical map of Saturn showing subtle atmospheric banding, polar hexagon hues, and equatorial storm belts.",
    technicalNotes: "Subtle butterscotch tones with polar vortex tinting."
  },
  {
    id: "tex-titan",
    name: "Titan Smog Atmosphere & Surface Map",
    category: "Textures",
    source: "NASA 3D Resources",
    repository: "NASA/NASA-3D-Resources",
    originalPath: "Images and Textures/Saturn - Titan/Saturn - Titan.jpg",
    organization: "NASA Solar System Simulator / Cassini VIMS",
    license: "NASA Open Source Agreement / Public Domain",
    originalFormat: "JPEG / TIFF",
    webFormat: "JPEG (48 KB Cylindrical)",
    fileSizeKb: 48,
    localPath: "/textures/nasa-3d/titan.jpg",
    usedIn: ["Universe Titan Celestial Sphere", "Dragonfly Mission Visualizer", "NASA 3D Asset Library"],
    attribution: "NASA / JPL-Caltech / University of Arizona / Cassini VIMS",
    description: "Infrared view peering through Titan's dense nitrogen-methane smog to reveal dark hydrocarbon sand dunes and methane seas.",
    technicalNotes: "48 KB cylindrical map with distinct Xanadu and Shangri-La geographic formations."
  }
];

export const NASA_PLANET_TEXTURES = NASA_3D_ASSETS.filter((a) => a.category === "Textures");

/**
 * Audit of assets evaluated from NASA/NASA-3D-Resources that were intentionally
 * rejected to prevent browser bloat, broken rendering, or irrelevant gameplay.
 */
export const AUDITED_REJECTED_ASSETS: RejectedAssetAudit[] = [
  {
    name: "Curiosity Rover (MSL)",
    path: "3D Models/Curiosity Rover (MSL)/Curiosity Rover (MSL) (Clean).blend",
    originalFormat: ".blend",
    fileSizeApprox: "10.2 MB",
    rejectionReason: "Requires desktop Blender (.blend)",
    notes: "No native browser-compatible GLB was provided in this directory. Converting 10MB raw blender geometry with procedural cycles nodes would cause heavy memory spikes."
  },
  {
    name: "Space Launch System Block 1 (Scanline)",
    path: "3D Models/Space Launch System Block 1/Block 1 (GNC markings scanline).7z.001",
    originalFormat: ".7z (3ds Max multi-part archive)",
    fileSizeApprox: "74.4 MB",
    rejectionReason: "Excessive archive size (>50MB)",
    notes: "Proprietary 3ds Max scanline render archive with multi-part 7z compression. Uncompressed payload exceeds 250MB, making it unsuitable for client-side web loading."
  },
  {
    name: "Asteroid 4 Vesta (East & West)",
    path: "3D Printing/Asteroid 4 Vesta (A)/Asteroid 4 Vesta (A).stl",
    originalFormat: ".stl",
    fileSizeApprox: "39.1 MB",
    rejectionReason: "STL mesh lacks UV/material maps",
    notes: "Physical 3D printing STL file containing untextured raw triangular facets without UV coordinates, normals, or PBR materials. Replaced with web-optimized Bennu GLB."
  },
  {
    name: "Astronaut Tool Set (Grease Gun, Pistol Grip Tool, Wrench)",
    path: "3D Models/Grease Gun/, 3D Models/Wrench/, 3D Models/Pistol Grip Tool/",
    originalFormat: ".obj / .stl",
    fileSizeApprox: "15 MB",
    rejectionReason: "Irrelevant to planetary mission simulation",
    notes: "Individual mechanical shop tools do not contribute to planetary trajectory design or spacecraft bus engineering."
  },
  {
    name: "Earth 3D Printing Globe",
    path: "3D Printing/Earth/Earth.7z.001",
    originalFormat: ".7z (STL archive)",
    fileSizeApprox: "68.2 MB",
    rejectionReason: "Excessive archive size (>50MB)",
    notes: "Multi-part archive for multi-material physical 3D printers. Incompatible with browser WebGL textures."
  },
  {
    name: "Hurricane Katrina & Sandy Vis Models",
    path: "3D Printing/Hurricane Katrina/, 3D Printing/Hurricane Sandy/",
    originalFormat: ".stl",
    fileSizeApprox: "12 MB",
    rejectionReason: "Irrelevant to planetary mission simulation",
    notes: "Terrestrial weather phenomena visualizations; outside the scope of deep-space orbital mechanics."
  }
];

/**
 * Look up a 3D asset by its ID
 */
export function getNasa3DAsset(id: string): Nasa3DAsset | undefined {
  return NASA_3D_ASSETS.find((a) => a.id === id);
}

/**
 * Look up recommended 3D asset for a given mission destination or spacecraft type
 */
export function getAssetForMission(mission: string): Nasa3DAsset | undefined {
  switch (mission) {
    case "Moon": return getNasa3DAsset("apollo-lunar-module");
    case "Mars": return getNasa3DAsset("viking-lander");
    case "Jupiter": return getNasa3DAsset("galileo");
    case "Saturn": return getNasa3DAsset("cassini-huygens");
    case "Titan": return getNasa3DAsset("ingenuity"); // Autonomous atmospheric aerial explorer
    case "Ceres": return getNasa3DAsset("dawn");
    case "Mercury": return getNasa3DAsset("parker-solar-probe");
    default: return getNasa3DAsset("voyager-probe");
  }
}

/**
 * Look up recommended planetary texture path for a given celestial body ID
 */
export function getNasaPlanetTexture(bodyId: string): string | null {
  const map: Record<string, string> = {
    Earth: "/textures/nasa-3d/earth.webp",
    Moon: "/textures/nasa-3d/moon.webp",
    Mars: "/textures/nasa-3d/mars.webp",
    Venus: "/textures/nasa-3d/venus.webp",
    Jupiter: "/textures/nasa-3d/jupiter.webp",
    Europa: "/textures/nasa-3d/europa.webp",
    Saturn: "/textures/nasa-3d/saturn.webp",
    Titan: "/textures/nasa-3d/titan.jpg",
  };
  return map[bodyId] ?? null;
}
