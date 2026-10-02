// NASA & International Science Instrument Registry (§Master Build Phase 2)
// Comprehensive catalog of real-world scientific instruments across 10 disciplines.
// Strict separation between verified real flight specifications and Mission Forge game simulation parameters.

export type InstrumentCategory =
  | "imaging"
  | "spectrometry"
  | "radiation"
  | "radar"
  | "altimetry"
  | "magnetometry"
  | "seismology"
  | "atmospheric"
  | "mass-spec"
  | "dust"
  | "radio";

export interface RegistryInstrument {
  id: string;
  acronym: string;
  name: string;
  category: InstrumentCategory;
  hostMission: string;
  hostSpacecraft: string;
  agency: string;
  targetBody: string;
  measurementType: string;
  scientificPurpose: string;
  realSpecs: {
    massKg: number | string;
    powerWatts: number | string;
    resolutionOrBand?: string;
    operatingTemp?: string;
  };
  gameParameters: {
    gameId: "camera" | "spectrometer" | "radiation" | "radar" | "drone" | "drill";
    scienceYield: number;
    kwDraw: number;
    massKg: number;
    simulationNotes: string;
  };
  whyItMatters: string;
  tradeoffs: {
    advantages: string[];
    demands: string[];
  };
  officialSource: string;
  sourceUrl: string;
  verified: boolean;
}

export const INSTRUMENT_REGISTRY: RegistryInstrument[] = [
  // --- IMAGING ---
  {
    id: "hirise",
    acronym: "HiRISE",
    name: "High Resolution Imaging Science Experiment",
    category: "imaging",
    hostMission: "Mars Reconnaissance Orbiter (MRO)",
    hostSpacecraft: "MRO",
    agency: "NASA / JPL / University of Arizona",
    targetBody: "Mars",
    measurementType: "Sub-meter orbital telescopic visible imaging (0.5m aperture)",
    scientificPurpose: "Examine surface geological features, sedimentary stratification, dune migration, active dust devils, and certify landing sites for future rovers and crewed missions.",
    realSpecs: {
      massKg: 65.0,
      powerWatts: 60.0,
      resolutionOrBand: "Up to 25–30 cm/pixel resolution from 300 km orbit (0.4 to 1.0 µm)",
    },
    gameParameters: {
      gameId: "camera",
      scienceYield: 35,
      kwDraw: 0.15,
      massKg: 150,
      simulationNotes: "Direct baseline for the standard high-resolution camera package used in orbital survey missions.",
    },
    whyItMatters: "Most powerful optical camera ever sent to another planet; detected recurring slope lineae (possible seasonal brine flows) and active rock avalanches.",
    tradeoffs: {
      advantages: ["Unrivaled sub-meter spatial resolution", "Crucial for identifying safe, obstacle-free landing sites"],
      demands: ["Generates gigabytes of raw data per strip, demanding high-gain antenna bandwidth", "Substantial payload mass (65 kg)"],
    },
    officialSource: "University of Arizona / NASA JPL HiRISE Project",
    sourceUrl: "https://www.uahirise.org/",
    verified: true,
  },
  {
    id: "mastcam-z",
    acronym: "Mastcam-Z",
    name: "Mast Camera Zoom System",
    category: "imaging",
    hostMission: "Mars 2020",
    hostSpacecraft: "Perseverance Rover",
    agency: "NASA / JPL / ASU",
    targetBody: "Mars",
    measurementType: "Multispectral stereoscopic 3D zoom color imaging & 4K video",
    scientificPurpose: "Characterize landscape geomorphology, petrology, and color properties of Jezero Crater; identify and document samples before core drilling.",
    realSpecs: {
      massKg: 4.0,
      powerWatts: 17.4,
      resolutionOrBand: "Dual cameras with 3:1 optical zoom (28mm to 100mm focal length)",
    },
    gameParameters: {
      gameId: "camera",
      scienceYield: 30,
      kwDraw: 0.05,
      massKg: 85,
      simulationNotes: "Represents rover-mounted surface visual reconnaissance in Mission Forge.",
    },
    whyItMatters: "Provides 3D spatial vision for rover navigation and multispectral rock analysis, capturing the first high-definition audio/video of atmospheric flight by Ingenuity.",
    tradeoffs: {
      advantages: ["Low mass (4 kg) and low power demand", "Zoom capability resolves millimeter-scale rock grain textures from distance"],
      demands: ["Surface-only field of view; cannot map regional planetary scales alone"],
    },
    officialSource: "NASA JPL Mars 2020 Mastcam-Z Instrument Page",
    sourceUrl: "https://mars.nasa.gov/mars2020/spacecraft/instruments/mastcam-z/",
    verified: true,
  },
  {
    id: "lroc-nac",
    acronym: "LROC",
    name: "Lunar Reconnaissance Orbiter Camera (NAC/WAC)",
    category: "imaging",
    hostMission: "Lunar Reconnaissance Orbiter",
    hostSpacecraft: "LRO",
    agency: "NASA / GSFC / ASU",
    targetBody: "Moon",
    measurementType: "High-resolution narrow-angle and wide-angle lunar mapping",
    scientificPurpose: "Map polar illumination conditions, assess resources, and image Apollo landing sites and robotic impact craters at 50 cm resolution.",
    realSpecs: {
      massKg: 19.2,
      powerWatts: 24.0,
      resolutionOrBand: "0.5 m/pixel resolution across 5 km swaths",
    },
    gameParameters: {
      gameId: "camera",
      scienceYield: 25,
      kwDraw: 0.08,
      massKg: 110,
      simulationNotes: "Supplies the optical visual maps used in the Moon mission destination brief.",
    },
    whyItMatters: "Imaged the hardware left on the Moon by Apollo 11, 12, 14, 15, 16, and 17, and identified permanently illuminated peaks at the lunar south pole.",
    tradeoffs: {
      advantages: ["High-precision mapping of landing hazards (boulders, slopes)", "Comprehensive coverage of both near and far sides"],
      demands: ["Requires low orbital altitude (~50 km) which experiences gravitational anomalies (mascons)"],
    },
    officialSource: "Arizona State University / NASA LROC",
    sourceUrl: "https://www.lroc.asu.edu/",
    verified: true,
  },

  // --- SPECTROMETRY ---
  {
    id: "mise",
    acronym: "MISE",
    name: "Mapping Imaging Spectrometer for Europa",
    category: "spectrometry",
    hostMission: "Europa Clipper",
    hostSpacecraft: "Europa Clipper",
    agency: "NASA / JPL / APL",
    targetBody: "Europa (Jupiter Moon)",
    measurementType: "Short-wave infrared imaging spectrometry (0.8 to 5.0 µm)",
    scientificPurpose: "Identify and map distributions of ices, salts, organics, and warm thermal anomalies on Europa's surface to determine ocean habitability.",
    realSpecs: {
      massKg: 29.5,
      powerWatts: 42.0,
      resolutionOrBand: "Infrared band 0.8–5.0 µm with 10 nm spectral resolution",
    },
    gameParameters: {
      gameId: "spectrometer",
      scienceYield: 45,
      kwDraw: 0.12,
      massKg: 180,
      simulationNotes: "Primary high-value instrument for Europa chemical survey objectives.",
    },
    whyItMatters: "Will determine whether salts on Europa's fractured surface originate from the warm subsurface ocean below.",
    tradeoffs: {
      advantages: ["Pinpoints chemical signatures of salts and organic molecules", "Detects localized cryovolcanic thermal hotspots"],
      demands: ["Sensitive cryocooler required to keep detectors at -190°C", "Moderate power consumption (42 W continuous)"],
    },
    officialSource: "NASA Europa Clipper Instruments — MISE",
    sourceUrl: "https://science.nasa.gov/mission/europa-clipper/spacecraft-instruments/mise/",
    verified: true,
  },
  {
    id: "vims",
    acronym: "VIMS",
    name: "Visual and Infrared Mapping Spectrometer",
    category: "spectrometry",
    hostMission: "Cassini-Huygens",
    hostSpacecraft: "Cassini",
    agency: "NASA / JPL / University of Arizona",
    targetBody: "Saturn & Titan",
    measurementType: "Visual (0.35–1.05 µm) and Infrared (0.85–5.1 µm) spectral mapping",
    scientificPurpose: "Map chemical composition of Saturn's atmosphere, rings, icy moons, and see through the dense nitrogen smog to Titan's surface.",
    realSpecs: {
      massKg: 37.1,
      powerWatts: 27.2,
      resolutionOrBand: "352 contiguous spectral wavelengths across 0.35 to 5.1 µm",
    },
    gameParameters: {
      gameId: "spectrometer",
      scienceYield: 45,
      kwDraw: 0.1,
      massKg: 190,
      simulationNotes: "Provides the spectroscopy foundation for Titan and Saturn missions.",
    },
    whyItMatters: "Pierced Titan's opaque smog haze, discovering liquid methane/ethane seas (Kraken Mare) and hydrothermal activity on Enceladus.",
    tradeoffs: {
      advantages: ["Broad continuous spectral coverage across visible and thermal IR", "Capable of atmospheric sounding through dense aerosols"],
      demands: ["Requires passive radiative cooler pointed into deep space"],
    },
    officialSource: "NASA JPL Cassini VIMS Instrument Guide",
    sourceUrl: "https://science.nasa.gov/mission/cassini/spacecraft/cassini-orbiter/visual-and-infrared-mapping-spectrometer/",
    verified: true,
  },
  {
    id: "crism",
    acronym: "CRISM",
    name: "Compact Reconnaissance Imaging Spectrometer for Mars",
    category: "spectrometry",
    hostMission: "Mars Reconnaissance Orbiter",
    hostSpacecraft: "MRO",
    agency: "NASA / APL",
    targetBody: "Mars",
    measurementType: "Visible and infrared hyperspectral imaging (0.36 to 3.9 µm)",
    scientificPurpose: "Search for mineralogical evidence of past water on Mars, including phyllosilicates (clays), carbonates, and sulfates.",
    realSpecs: {
      massKg: 32.9,
      powerWatts: 47.0,
      resolutionOrBand: "544 wavelengths at 18–36 meters per pixel spatial resolution",
    },
    gameParameters: {
      gameId: "spectrometer",
      scienceYield: 40,
      kwDraw: 0.1,
      massKg: 160,
      simulationNotes: "Standard orbital spectrometer instrument option in Mission Forge.",
    },
    whyItMatters: "Discovered widespread clay mineral deposits across ancient Martian highlands, proving liquid water persisted long enough to alter crustal rock.",
    tradeoffs: {
      advantages: ["Identifies specific mineral types formed in wet environments", "High spatial resolution for orbital spectroscopy"],
      demands: ["Cryocoolers required for IR detectors depleted their helium coolant after 12 years of mission operations"],
    },
    officialSource: "Johns Hopkins APL / NASA CRISM",
    sourceUrl: "https://crism.jhuapl.edu/",
    verified: true,
  },

  // --- RADIATION ---
  {
    id: "rad",
    acronym: "RAD",
    name: "Radiation Assessment Detector",
    category: "radiation",
    hostMission: "Mars Science Laboratory",
    hostSpacecraft: "Curiosity Rover",
    agency: "NASA / SwRI / DLR (Germany)",
    targetBody: "Mars (Cruise & Gale Crater Surface)",
    measurementType: "Energetic particle detector (Galactic Cosmic Rays & Solar Energetic Particles)",
    scientificPurpose: "Measure biological radiation hazard during deep-space transit and on the Martian surface to protect future human astronauts.",
    realSpecs: {
      massKg: 1.56,
      powerWatts: 4.2,
      resolutionOrBand: "Detects protons, heavy ions (Z=1 to 26), and neutrons (10 to 1000 MeV)",
    },
    gameParameters: {
      gameId: "radiation",
      scienceYield: 25,
      kwDraw: 0.02,
      massKg: 90,
      simulationNotes: "Essential sensor for navigating solar flare hazards and evaluating crew safety in Mission Forge.",
    },
    whyItMatters: "Provided humanity's first direct ground measurements of radiation dosage on Mars (~0.67 mSv/day), showing unshielded transit requires dedicated radiation habitats.",
    tradeoffs: {
      advantages: ["Extremely light (1.56 kg) and low power draw (4.2 W)", "Continuously monitors solar storm surges in real time"],
      demands: ["Measures particles locally; does not deflect or mitigate radiation by itself"],
    },
    officialSource: "Southwest Research Institute / NASA RAD",
    sourceUrl: "https://www.nasa.gov/mission_pages/msl/building_curiosity/rad.html",
    verified: true,
  },

  // --- RADAR & ALTIMETRY ---
  {
    id: "reason",
    acronym: "REASON",
    name: "Radar for Europa Assessment and Sounding: Ocean to Near-surface",
    category: "radar",
    hostMission: "Europa Clipper",
    hostSpacecraft: "Europa Clipper",
    agency: "NASA / University of Texas / JPL",
    targetBody: "Europa (Jupiter Moon)",
    measurementType: "Dual-frequency ice-penetrating radar sounding (9 MHz & 60 MHz)",
    scientificPurpose: "Sound through Europa's cryogenic ice shell up to 30 km deep to detect the ice-ocean interface and potential pockets of perched brine.",
    realSpecs: {
      massKg: 43.6,
      powerWatts: 75.0,
      resolutionOrBand: "Dual VHF (60 MHz) and HF (9 MHz) frequencies; sounding depth up to 30 km",
    },
    gameParameters: {
      gameId: "radar",
      scienceYield: 50,
      kwDraw: 0.15,
      massKg: 200,
      simulationNotes: "Unlocks the highest science bonus on Europa by sounding beneath the outer crust.",
    },
    whyItMatters: "First instrument engineered to directly measure the thickness of Europa's ice sheet and seek pathways connecting the ocean to the surface.",
    tradeoffs: {
      advantages: ["Can penetrate opaque ice shells impenetrable to optical cameras", "Dual-frequency design overcomes Jupiter's intense plasma noise"],
      demands: ["Large deployable antenna booms (16 meters long)", "Substantial electrical power consumption (75 W)"],
    },
    officialSource: "NASA Europa Clipper Instruments — REASON",
    sourceUrl: "https://science.nasa.gov/mission/europa-clipper/spacecraft-instruments/reason/",
    verified: true,
  },
  {
    id: "marsis",
    acronym: "MARSIS",
    name: "Sub-Surface Sounding Radar / Altimeter",
    category: "radar",
    hostMission: "Mars Express",
    hostSpacecraft: "Mars Express",
    agency: "ESA / ASI / NASA / JPL",
    targetBody: "Mars",
    measurementType: "Low-frequency radar sounder (1.3 to 5.5 MHz)",
    scientificPurpose: "Map Martian subsurface structure, ice deposits, and potential liquid water reservoirs down to several kilometers depth.",
    realSpecs: {
      massKg: 12.0,
      powerWatts: 60.0,
      resolutionOrBand: "Sounding depth up to 5 km into crust; 40-meter deployable dipole antenna",
    },
    gameParameters: {
      gameId: "radar",
      scienceYield: 45,
      kwDraw: 0.12,
      massKg: 175,
      simulationNotes: "Exemplifies orbital radar sounding in Mission Forge's instrument selection.",
    },
    whyItMatters: "Discovered evidence of a subglacial lake of liquid saltwater beneath the Martian south polar ice cap in 2018.",
    tradeoffs: {
      advantages: ["Deep crustal penetration", "Lightweight instrument core (12 kg)"],
      demands: ["Long 40-meter antennas require complex deployment sequence", "Subject to ionospheric distortion on the dayside of Mars"],
    },
    officialSource: "ESA Mars Express Science Instruments",
    sourceUrl: "https://www.esa.int/Science_Exploration/Space_Science/Mars_Express/MARSIS",
    verified: true,
  },
  {
    id: "lola",
    acronym: "LOLA",
    name: "Lunar Orbiter Laser Altimeter",
    category: "altimetry",
    hostMission: "Lunar Reconnaissance Orbiter",
    hostSpacecraft: "LRO",
    agency: "NASA / GSFC",
    targetBody: "Moon",
    measurementType: "Multi-beam pulsed Nd:YAG laser altimetry (1064 nm at 28 Hz)",
    scientificPurpose: "Build a high-precision global 3D geodetic elevation grid of the Moon, map slopes, and measure surface roughness and polar crater depths.",
    realSpecs: {
      massKg: 11.4,
      powerWatts: 33.7,
      resolutionOrBand: "5 simultaneous laser spots; 10 cm vertical ranging precision",
    },
    gameParameters: {
      gameId: "radar",
      scienceYield: 30,
      kwDraw: 0.08,
      massKg: 130,
      simulationNotes: "Models terrain hazard detection and precision altitude tracking during the EDL landing sequence.",
    },
    whyItMatters: "Gathered over 4 billion elevation measurements, producing the most accurate topographic elevation model of any planetary body in existence.",
    tradeoffs: {
      advantages: ["Sub-decimeter vertical elevation precision", "Independent of solar illumination; functions equally well in pitch-black polar craters"],
      demands: ["Requires high-precision pointing and timing synchronization"],
    },
    officialSource: "NASA Goddard Space Flight Center / LOLA",
    sourceUrl: "https://lola.gsfc.nasa.gov/",
    verified: true,
  },

  // --- MAGNETOMETRY ---
  {
    id: "ecm",
    acronym: "ECM",
    name: "Europa Clipper Magnetometer",
    category: "magnetometry",
    hostMission: "Europa Clipper",
    hostSpacecraft: "Europa Clipper",
    agency: "NASA / JPL",
    targetBody: "Europa (Jupiter Moon)",
    measurementType: "Fluxgate vector magnetic field detection (3 sensors)",
    scientificPurpose: "Detect the induced magnetic field created by Europa's subsurface ocean interacting with Jupiter's rotating magnetosphere.",
    realSpecs: {
      massKg: 4.8,
      powerWatts: 8.5,
      resolutionOrBand: "Dynamic range ±65,000 nT with sub-nanotesla sensitivity",
    },
    gameParameters: {
      gameId: "spectrometer",
      scienceYield: 35,
      kwDraw: 0.04,
      massKg: 95,
      simulationNotes: "Indirect method to measure subsurface ocean salinity and depth.",
    },
    whyItMatters: "Allows scientists to independently confirm the depth, thickness, and electrical conductivity (salinity) of Europa's hidden ocean.",
    tradeoffs: {
      advantages: ["Ultra-low mass (4.8 kg) and power consumption (8.5 W)", "Direct physical proof of subsurface conducting fluid (saltwater)"],
      demands: ["Must be mounted on an 8.5-meter boom to isolate sensors from the spacecraft's own electrical noise"],
    },
    officialSource: "NASA Europa Clipper Science — ECM",
    sourceUrl: "https://science.nasa.gov/mission/europa-clipper/spacecraft-instruments/ecm/",
    verified: true,
  },

  // --- SEISMOLOGY ---
  {
    id: "seis",
    acronym: "SEIS",
    name: "Seismic Experiment for Interior Structure",
    category: "seismology",
    hostMission: "InSight",
    hostSpacecraft: "InSight Mars Lander",
    agency: "CNES (France) / NASA / IPGP",
    targetBody: "Mars",
    measurementType: "Ultra-sensitive broad-band and short-period 3-axis seismometry",
    scientificPurpose: "Detect marsquakes, meteorite impacts, and tidal signals to determine the thickness and composition of Mars' crust, mantle, and liquid core.",
    realSpecs: {
      massKg: 8.5,
      powerWatts: 5.0,
      resolutionOrBand: "Measures ground motion smaller than the radius of a single hydrogen atom",
    },
    gameParameters: {
      gameId: "drill",
      scienceYield: 45,
      kwDraw: 0.03,
      massKg: 140,
      simulationNotes: "Requires successful surface landing to deploy on extraterrestrial terrain.",
    },
    whyItMatters: "Recorded more than 1,300 marsquakes on Mars, revealing that the Martian crust has 2 to 3 distinct layers and confirming a molten iron-rich core.",
    tradeoffs: {
      advantages: ["Only instrument capable of directly imaging the internal interior of a terrestrial planet", "Low operational power demand (5 W)"],
      demands: ["Must be physically placed on the planetary surface by a robotic arm with a wind/thermal shield"],
    },
    officialSource: "CNES / NASA JPL InSight SEIS",
    sourceUrl: "https://mars.nasa.gov/insight/spacecraft/instruments/seis/",
    verified: true,
  },

  // --- MASS SPECTROMETRY & ATMOSPHERIC ---
  {
    id: "sam",
    acronym: "SAM",
    name: "Sample Analysis at Mars",
    category: "mass-spec",
    hostMission: "Mars Science Laboratory",
    hostSpacecraft: "Curiosity Rover",
    agency: "NASA / GSFC",
    targetBody: "Mars",
    measurementType: "Quadrupole mass spectrometer (QMS), gas chromatograph (GC) & tunable laser spectrometer (TLS)",
    scientificPurpose: "Search for carbon compounds, methane, and bio-essential organic molecules by vaporizing powdered rock and atmospheric samples in ovens up to 1,000°C.",
    realSpecs: {
      massKg: 38.0,
      powerWatts: 150.0,
      resolutionOrBand: "Mass range 1 to 535 Daltons; sensitivity down to parts-per-billion",
    },
    gameParameters: {
      gameId: "drill",
      scienceYield: 50,
      kwDraw: 0.25,
      massKg: 210,
      simulationNotes: "The ultimate science instrument in Mission Forge, requiring heavy payload allowance and RTG power support.",
    },
    whyItMatters: "Made the historic first detection of indigenous organic molecules (chlorobenzene, sulfur-bearing thiophenes) on the surface of Mars.",
    tradeoffs: {
      advantages: ["Unmatched laboratory-grade analytical chemical capability", "Detects volatile isotopes revealing how Mars lost its atmosphere"],
      demands: ["Heavy payload module (38 kg flight mass, >200 kg installed with drill and sample ovens)", "Very high peak power draw (150 W)"],
    },
    officialSource: "NASA Goddard / Curiosity SAM Project",
    sourceUrl: "https://science.nasa.gov/mission/curiosity/instruments/sam/",
    verified: true,
  },
  {
    id: "inms",
    acronym: "INMS",
    name: "Ion and Neutral Mass Spectrometer",
    category: "mass-spec",
    hostMission: "Cassini-Huygens",
    hostSpacecraft: "Cassini",
    agency: "NASA / GSFC",
    targetBody: "Saturn, Titan & Enceladus",
    measurementType: "Quadrupole mass analyzer for positive ions and neutral gas species",
    scientificPurpose: "Measure composition of upper atmospheres, exospheres, ring environments, and sample the icy plume vapors erupting from Enceladus.",
    realSpecs: {
      massKg: 9.25,
      powerWatts: 27.7,
      resolutionOrBand: "Mass-to-charge ratio 1 to 100 Da with 1 Da unit resolution",
    },
    gameParameters: {
      gameId: "spectrometer",
      scienceYield: 45,
      kwDraw: 0.08,
      massKg: 120,
      simulationNotes: "Atmospheric and plume sniffer for gas giants and ocean worlds.",
    },
    whyItMatters: "Flew directly through the plumes of Enceladus at 8.5 km/s, detecting molecular hydrogen (H2), methane, and complex organic compounds produced by deep-sea hydrothermal vents.",
    tradeoffs: {
      advantages: ["Samples gas and ice particles directly in-flight without landing", "Confirmed active hydrothermal chemistry in an extraterrestrial ocean"],
      demands: ["Requires close flybys into dangerous low altitudes through particle sprays"],
    },
    officialSource: "NASA JPL Cassini INMS",
    sourceUrl: "https://science.nasa.gov/mission/cassini/spacecraft/cassini-orbiter/ion-and-neutral-mass-spectrometer/",
    verified: true,
  },
  {
    id: "drams",
    acronym: "DraMS",
    name: "Dragonfly Mass Spectrometer",
    category: "mass-spec",
    hostMission: "Dragonfly",
    hostSpacecraft: "Dragonfly Rotorcraft",
    agency: "NASA / GSFC",
    targetBody: "Titan (Saturn Moon)",
    measurementType: "Laser desorption & gas chromatography mass spectrometry",
    scientificPurpose: "Analyze surface samples on Titan to investigate prebiotic chemical evolution and search for chemical biosignatures in organic-rich sand dunes and impact melt.",
    realSpecs: {
      massKg: 16.0,
      powerWatts: 45.0,
      resolutionOrBand: "Laser desorption ionization across broad mass range",
    },
    gameParameters: {
      gameId: "drone",
      scienceYield: 50,
      kwDraw: 0.18,
      massKg: 280,
      simulationNotes: "Models the specialized analytical payload aboard the Titan atmospheric rotorcraft drone.",
    },
    whyItMatters: "Will conduct the first direct chemical search for prebiotic building blocks across multiple landing sites on Titan's frozen surface.",
    tradeoffs: {
      advantages: ["Can test samples at dozens of different surface locations thanks to rotorcraft mobility", "Laser ionization vaporizes complex cryogenic organics without degrading them"],
      demands: ["Requires sample acquisition drill integrated with pneumatic transport inside cryogenic nitrogen atmosphere (-180°C)"],
    },
    officialSource: "Johns Hopkins APL / NASA Dragonfly",
    sourceUrl: "https://dragonfly.jhuapl.edu/Spacecraft/#instruments",
    verified: true,
  },
];

export const DESTINATION_RECOMMENDATIONS: Record<string, { recommended: string[]; rationale: string }> = {
  Moon: {
    recommended: ["lroc-nac", "lola", "rad"],
    rationale: "High-resolution optical mapping (LROC) and laser altimetry (LOLA) scout safe landing sites and locate polar ice in craters, while RAD monitors the intense solar particle environment.",
  },
  Mars: {
    recommended: ["hirise", "mastcam-z", "crism", "rad", "marsis", "sam"],
    rationale: "Mars requires an integrated package: orbital imaging (HiRISE) and radar (MARSIS) for scouting subsurface ice, plus surface spectrometry (SAM) and radiation monitoring (RAD) for habitability analysis.",
  },
  Europa: {
    recommended: ["reason", "mise", "ecm", "rad"],
    rationale: "The prime science target is Europa's ocean. Ice-penetrating radar (REASON) sounds the ice shell, infrared spectrometry (MISE) identifies surface salts, and magnetometry (ECM) confirms ocean salinity.",
  },
  Titan: {
    recommended: ["vims", "drams", "inms", "marsis"],
    rationale: "Titan's dense nitrogen smog requires infrared spectrometry (VIMS) and radar to pierce the haze, plus mass spectrometry (INMS / DraMS) to analyze organic compounds in methane seas and dunes.",
  },
  Ceres: {
    recommended: ["hirise", "crism", "rad"],
    rationale: "Imaging and multispectral mapping identify bright carbonate brine deposits and hydrated clays, while radiation monitoring checks the asteroid belt cosmic ray baseline.",
  },
  Jupiter: {
    recommended: ["ecm", "rad", "vims"],
    rationale: "Jupiter's colossal radiation belts demand intense radiation monitoring (RAD) and magnetometry (ECM) to study magnetospheric dynamics and internal core dynamo properties.",
  },
  Saturn: {
    recommended: ["vims", "inms", "ecm"],
    rationale: "Deep space at 9.5 AU requires visual/IR spectroscopy (VIMS) to study ring composition and mass spectrometry (INMS) to sniff cryovolcanic plumes erupted by ocean moons.",
  },
  Mercury: {
    recommended: ["hirise", "lola", "rad"],
    rationale: "Facing extreme solar flux (0.39 AU), laser altimetry and radiation sensors analyze thermal extremes and polar cold traps holding volatile ice.",
  },
  Venus: {
    recommended: ["marsis", "vims", "rad"],
    rationale: "Dense runaway greenhouse clouds require radar to map volcanic geology, paired with infrared atmospheric sounders.",
  },
};
