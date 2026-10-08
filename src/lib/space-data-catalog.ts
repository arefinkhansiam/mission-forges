/**
 * MISSION FORGE — SPACE DATA SOURCE REGISTRY
 * NASA Space Apps Challenge 2026 | Team Ghost Hunter
 * 
 * Official NASA Space Apps 2026 Partner Reference:
 * https://www.spaceappschallenge.org/2026/space-agency-partners/
 * 
 * Audited Organizations:
 * - NASA (United States)
 * - 17 Official Space Agency Partners:
 *   01. GGPEN (Angola)
 *   02. CONAE (Argentina)
 *   03. BSA (Bahrain)
 *   04. AEB / INPE (Brazil)
 *   05. CSA (Canada)
 *   06. ESA (Europe)
 *   07. ISRO (India)
 *   08. ASI (Italy)
 *   09. JAXA (Japan)
 *   10. KASA / KARI (South Korea)
 *   11. NASRDA (Nigeria)
 *   12. AEP (Paraguay)
 *   13. ASES (Senegal)
 *   14. AEE / INTA (Spain)
 *   15. TUA (Turkey)
 *   16. MBRSC (United Arab Emirates)
 *   17. UK Space Agency (United Kingdom)
 * 
 * STRICT INTEGRITY RULES:
 * - No fabricated APIs, endpoints, datasets, or numerical values.
 * - If no verified public API exists, marked as "UNAVAILABLE" / "DISCOVERED — NO VERIFIED PUBLIC API FOUND".
 * - Statuses strictly enforced: LIVE, CACHED, AVAILABLE, DEMO, UNAVAILABLE.
 */

export type AgencyId =
  | "NASA"
  | "GGPEN"
  | "CONAE"
  | "BSA"
  | "AEB"
  | "CSA"
  | "ESA"
  | "ISRO"
  | "ASI"
  | "JAXA"
  | "KASA"
  | "NASRDA"
  | "AEP"
  | "ASES"
  | "AEE"
  | "TUA"
  | "MBRSC"
  | "UKSA";

export type AgencyPartnerTier = "NASA" | "SPACE AGENCY PARTNER";

export type DataCategory =
  | "PLANETARY"
  | "TRAJECTORY"
  | "EARTH OBSERVATION"
  | "SPACE WEATHER"
  | "SPACECRAFT"
  | "PLANETARY MISSIONS"
  | "ASTRONOMY"
  | "IMAGERY"
  | "3D";

export type IntegrationStatus = "LIVE" | "CACHED" | "AVAILABLE" | "DEMO" | "UNAVAILABLE";

export interface SpaceAgencyInfo {
  id: AgencyId;
  name: string;
  fullName: string;
  country: string;
  countryFlag: string;
  officialUrl: string;
  tier: AgencyPartnerTier;
  established?: number;
  headquarters: string;
  description: string;
}

export interface SpaceDataSource {
  id: string;
  agency: AgencyId;
  agencyName: string;
  country: string;
  countryFlag: string;
  tier: AgencyPartnerTier;
  dataset: string;
  mission: string;
  dataType: DataCategory;
  officialUrl: string;
  apiUrl: string;
  documentationUrl: string;
  accessMethod:
    | "REST API"
    | "IVOA TAP / ADQL"
    | "STAC API"
    | "PDS4 / PDS3 Archive"
    | "HTTPS File Navigation"
    | "CKAN Open Data API"
    | "OGC Web Services (WMS/WFS)"
    | "Interactive Web Portal"
    | "Static Institutional Catalog";
  authRequired: string;
  openPublic: boolean;
  realTime: boolean;
  updateFrequency: string;
  format: string;
  licenseUsage: string;
  missionForgeUseCase: string;
  integrationStatus: IntegrationStatus;
  verifiedNotes: string;
}

export const SPACE_AGENCIES: Record<AgencyId, SpaceAgencyInfo> = {
  NASA: {
    id: "NASA",
    name: "NASA",
    fullName: "National Aeronautics and Space Administration",
    country: "United States",
    countryFlag: "🇺🇸",
    officialUrl: "https://www.nasa.gov/",
    tier: "NASA",
    established: 1958,
    headquarters: "Washington, D.C., USA",
    description: "United States civil space program lead, operating planetary missions, space telescopes, Earth science, and the Space Apps Challenge.",
  },
  GGPEN: {
    id: "GGPEN",
    name: "GGPEN",
    fullName: "Gabinete de Gestão do Programa Espacial Nacional (National Space Programme Management Office)",
    country: "Angola",
    countryFlag: "🇦🇴",
    officialUrl: "https://www.ggpen.gov.ao/",
    tier: "SPACE AGENCY PARTNER",
    headquarters: "Luanda, Angola",
    description: "Management office for Angola's national space program, overseeing ANGOSAT-2 telecommunications satellite and environmental monitoring applications.",
  },
  CONAE: {
    id: "CONAE",
    name: "CONAE",
    fullName: "Comisión Nacional de Actividades Espaciales",
    country: "Argentina",
    countryFlag: "🇦🇷",
    officialUrl: "https://www.argentina.gob.ar/ciencia/conae",
    tier: "SPACE AGENCY PARTNER",
    headquarters: "Buenos Aires, Argentina",
    description: "Argentina's civil space agency operating the SAOCOM 1A/1B L-band Synthetic Aperture Radar constellation for planetary Earth observation and soil moisture monitoring.",
  },
  BSA: {
    id: "BSA",
    name: "BSA / NSSA",
    fullName: "Bahrain Space Agency (National Space Science Agency)",
    country: "Bahrain",
    countryFlag: "🇧🇭",
    officialUrl: "https://bsa.gov.bh/",
    tier: "SPACE AGENCY PARTNER",
    headquarters: "Manama, Kingdom of Bahrain",
    description: "Bahrain's national space agency, developing CubeSat missions including Light-1 (terrestrial gamma-ray flashes with UAE) and upcoming hyperspectral Al-Munther.",
  },
  AEB: {
    id: "AEB",
    name: "AEB / INPE",
    fullName: "Agência Espacial Brasileira & Instituto Nacional de Pesquisas Espaciais",
    country: "Brazil",
    countryFlag: "🇧🇷",
    officialUrl: "https://www.gov.br/aeb",
    tier: "SPACE AGENCY PARTNER",
    headquarters: "Brasília, Brazil",
    description: "Brazilian space authority overseeing national space policy, operating CBERS Earth resource satellites (with China), Amazonia-1, and INPE wildfire monitoring systems.",
  },
  CSA: {
    id: "CSA",
    name: "CSA / ASC",
    fullName: "Canadian Space Agency / Agence spatiale canadienne",
    country: "Canada",
    countryFlag: "🇨🇦",
    officialUrl: "https://www.asc-csa.gc.ca/eng/",
    tier: "SPACE AGENCY PARTNER",
    headquarters: "Longueuil, Quebec, Canada",
    description: "Canadian space agency specializing in space robotics (Canadarm2, Canadarm3 for Lunar Gateway), RADARSAT Constellation Mission, and space atmospheric science.",
  },
  ESA: {
    id: "ESA",
    name: "ESA",
    fullName: "European Space Agency",
    country: "Europe (22 Member States)",
    countryFlag: "🇪🇺",
    officialUrl: "https://www.esa.int/",
    tier: "SPACE AGENCY PARTNER",
    headquarters: "Paris, France",
    description: "Intergovernmental organization dedicated to space exploration, operating JUICE, BepiColombo, Mars Express, Euclid, Gaia, and the Copernicus Earth observation fleet.",
  },
  ISRO: {
    id: "ISRO",
    name: "ISRO",
    fullName: "Indian Space Research Organisation",
    country: "India",
    countryFlag: "🇮🇳",
    officialUrl: "https://www.isro.gov.in/",
    tier: "SPACE AGENCY PARTNER",
    headquarters: "Bengaluru, Karnataka, India",
    description: "National space agency of India, renowned for historic lunar south pole landing with Chandrayaan-3, Aditya-L1 solar observatory, and Mars Orbiter Mission.",
  },
  ASI: {
    id: "ASI",
    name: "ASI",
    fullName: "Agenzia Spaziale Italiana",
    country: "Italy",
    countryFlag: "🇮🇹",
    officialUrl: "https://www.asi.it/",
    tier: "SPACE AGENCY PARTNER",
    headquarters: "Rome, Italy",
    description: "Italian space agency operating COSMO-SkyMed X-band SAR constellation, PRISMA hyperspectral mission, and LICIACube asteroid impact probe.",
  },
  JAXA: {
    id: "JAXA",
    name: "JAXA",
    fullName: "Japan Aerospace Exploration Agency",
    country: "Japan",
    countryFlag: "🇯🇵",
    officialUrl: "https://global.jaxa.jp/",
    tier: "SPACE AGENCY PARTNER",
    headquarters: "Chofu, Tokyo, Japan",
    description: "Japan's national aerospace agency, pioneers in asteroid sample return (Hayabusa & Hayabusa2), pinpoint lunar landing (SLIM), and Venus exploration (Akatsuki).",
  },
  KASA: {
    id: "KASA",
    name: "KASA / KARI",
    fullName: "Korea AeroSpace Administration & Korea Aerospace Research Institute",
    country: "South Korea",
    countryFlag: "🇰🇷",
    officialUrl: "https://www.kasa.go.kr/eng/index.do",
    tier: "SPACE AGENCY PARTNER",
    headquarters: "Sacheon, South Korea",
    description: "South Korea's aerospace agency, operating Danuri (KPLO) lunar orbiter carrying ShadowCam and LUTI, KOMPSAT Earth observation satellites, and Nuri rocket.",
  },
  NASRDA: {
    id: "NASRDA",
    name: "NASRDA",
    fullName: "National Space Research and Development Agency",
    country: "Nigeria",
    countryFlag: "🇳🇬",
    officialUrl: "https://central.nasrda.gov.ng/",
    tier: "SPACE AGENCY PARTNER",
    headquarters: "Abuja, Nigeria",
    description: "Nigeria's primary space agency, operating NigeriaSat-1, NigeriaSat-2, NigeriaSat-X, and NigComSat-1R for disaster mitigation, resource mapping, and communications.",
  },
  AEP: {
    id: "AEP",
    name: "AEP",
    fullName: "Agencia Espacial del Paraguay",
    country: "Paraguay",
    countryFlag: "🇵🇾",
    officialUrl: "https://aep.gov.py/",
    tier: "SPACE AGENCY PARTNER",
    headquarters: "Asunción, Paraguay",
    description: "Paraguay's space agency, launched GuaraniSat-1 (BIRDS-4 CubeSat) to monitor Chagas disease vectors in the Chaco region, advancing national aerospace capacity.",
  },
  ASES: {
    id: "ASES",
    name: "ASES",
    fullName: "Agence Sénégalaise d'Études Spatiales",
    country: "Senegal",
    countryFlag: "🇸🇳",
    officialUrl: "https://sites.google.com/view/redirectionases/ases",
    tier: "SPACE AGENCY PARTNER",
    headquarters: "Dakar, Senegal",
    description: "Senegal's space studies agency, successfully deployed GAINDESAT-1A (1U CubeSat) in August 2024 for water management, agricultural telemetry, and environmental monitoring.",
  },
  AEE: {
    id: "AEE",
    name: "AEE / INTA",
    fullName: "Agencia Espacial Española & Instituto Nacional de Técnica Aeroespacial",
    country: "Spain",
    countryFlag: "🇪🇸",
    officialUrl: "https://www.aee.gob.es/",
    tier: "SPACE AGENCY PARTNER",
    headquarters: "Seville, Spain",
    description: "Spain's space agency, managing PAZ radar satellite, Cheops participation, and Mars 2020 MEDA environmental station via Centro de Astrobiología (CAB).",
  },
  TUA: {
    id: "TUA",
    name: "TUA",
    fullName: "Türkiye Uzay Ajansı (Turkish Space Agency)",
    country: "Turkey",
    countryFlag: "🇹🇷",
    officialUrl: "https://tua.gov.tr/en",
    tier: "SPACE AGENCY PARTNER",
    headquarters: "Ankara, Turkey",
    description: "Turkey's national space agency, developing the AYAP-1 National Lunar Mission (lunar orbiter & impactor), IMECE sub-meter Earth observation, and TÜRKSAT-6A.",
  },
  MBRSC: {
    id: "MBRSC",
    name: "MBRSC",
    fullName: "Mohammed Bin Rashid Space Centre",
    country: "United Arab Emirates",
    countryFlag: "🇦🇪",
    officialUrl: "https://www.mbrsc.ae/",
    tier: "SPACE AGENCY PARTNER",
    headquarters: "Dubai, United Arab Emirates",
    description: "UAE space centre directing Emirates Mars Mission (Hope Probe) studying the Martian atmosphere, Rashid Rover lunar exploration, KhalifaSat, and MBZ-SAT.",
  },
  UKSA: {
    id: "UKSA",
    name: "UKSA",
    fullName: "UK Space Agency",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    officialUrl: "https://www.gov.uk/government/organisations/uk-space-agency",
    tier: "SPACE AGENCY PARTNER",
    headquarters: "Swindon, United Kingdom",
    description: "Executive agency of the UK government, funding science payloads on BepiColombo, Solar Orbiter, James Webb Space Telescope (MIRI), and national space weather.",
  },
};

/**
 * MASTER CATALOG OF AUDITED SPACE DATA SOURCES
 * All entries verified against official agency domains and interfaces.
 */
export const SPACE_DATA_SOURCES: SpaceDataSource[] = [
  // ==========================================
  // NASA (UNITED STATES)
  // ==========================================
  {
    id: "nasa-jpl-horizons",
    agency: "NASA",
    agencyName: "NASA Jet Propulsion Laboratory",
    country: "United States",
    countryFlag: "🇺🇸",
    tier: "NASA",
    dataset: "JPL Horizons Ephemeris System API",
    mission: "Universal Solar System Bodies",
    dataType: "TRAJECTORY",
    officialUrl: "https://ssd.jpl.nasa.gov/horizons/",
    apiUrl: "https://ssd.jpl.nasa.gov/api/horizons.api",
    documentationUrl: "https://ssd-api.jpl.nasa.gov/doc/horizons.html",
    accessMethod: "REST API",
    authRequired: "None (Open Public)",
    openPublic: true,
    realTime: true,
    updateFrequency: "Continuous / Daily orbital integration",
    format: "JSON / Plaintext Vector Table",
    licenseUsage: "NASA Open Data / Public Domain",
    missionForgeUseCase: "Planetary ephemerides, position vector extraction, interplanetary transfer departure baselines.",
    integrationStatus: "LIVE",
    verifiedNotes: "Directly queried via server proxy. Returns state vectors (X, Y, Z in AU) for Moon, Mars, Jupiter, Ceres, etc.",
  },
  {
    id: "nasa-donki",
    agency: "NASA",
    agencyName: "NASA Goddard Space Flight Center",
    country: "United States",
    countryFlag: "🇺🇸",
    tier: "NASA",
    dataset: "DONKI (Space Weather Database of Notifications, Knowledge, Information)",
    mission: "Solar Dynamics Observatory (SDO) / SOHO / STEREO",
    dataType: "SPACE WEATHER",
    officialUrl: "https://kauai.ccmc.gsfc.nasa.gov/DONKI/",
    apiUrl: "https://api.nasa.gov/DONKI/FLR",
    documentationUrl: "https://api.nasa.gov/",
    accessMethod: "REST API",
    authRequired: "Free API Key",
    openPublic: true,
    realTime: true,
    updateFrequency: "Every 2–4 hours upon solar flare event detection",
    format: "JSON",
    licenseUsage: "NASA Open Data / Public Domain",
    missionForgeUseCase: "In-flight radiation hazard simulation, solar storm alert banner, comms degradation checks.",
    integrationStatus: "LIVE",
    verifiedNotes: "Integrated into Mission Forge Data Center. Pulls M-class and X-class solar flare logs from CCMC.",
  },
  {
    id: "nasa-neows",
    agency: "NASA",
    agencyName: "NASA JPL / Center for Near Earth Object Studies",
    country: "United States",
    countryFlag: "🇺🇸",
    tier: "NASA",
    dataset: "NeoWs (Near Earth Object Web Service)",
    mission: "Planetary Defense / Asteroid Monitoring",
    dataType: "PLANETARY",
    officialUrl: "https://cneos.jpl.nasa.gov/",
    apiUrl: "https://api.nasa.gov/neo/rest/v1/feed",
    documentationUrl: "https://api.nasa.gov/",
    accessMethod: "REST API",
    authRequired: "Free API Key",
    openPublic: true,
    realTime: true,
    updateFrequency: "Daily close-approach calculations",
    format: "JSON",
    licenseUsage: "NASA Open Data / Public Domain",
    missionForgeUseCase: "En-route micrometeoroid / asteroid encounter hazards, secondary observation targets.",
    integrationStatus: "LIVE",
    verifiedNotes: "Returns daily list of near-Earth asteroids, diameters, relative velocities, and miss distances in km.",
  },
  {
    id: "nasa-sbdb",
    agency: "NASA",
    agencyName: "NASA Jet Propulsion Laboratory",
    country: "United States",
    countryFlag: "🇺🇸",
    tier: "NASA",
    dataset: "Small-Body Database (SBDB) API",
    mission: "Ceres, Vesta, Bennu, Asteroid Belt",
    dataType: "TRAJECTORY",
    officialUrl: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html",
    apiUrl: "https://ssd-api.jpl.nasa.gov/sbdb.api",
    documentationUrl: "https://ssd-api.jpl.nasa.gov/doc/sbdb.html",
    accessMethod: "REST API",
    authRequired: "None (Open Public)",
    openPublic: true,
    realTime: false,
    updateFrequency: "Weekly orbital refinement",
    format: "JSON",
    licenseUsage: "NASA Open Data / Public Domain",
    missionForgeUseCase: "Exact semi-major axis, eccentricity, and inclination parameters for Ceres & Bennu asteroid missions.",
    integrationStatus: "LIVE",
    verifiedNotes: "Queried with sstr parameter for target asteroids. Returns SPK ID, epoch, orbital elements.",
  },
  {
    id: "nasa-sentry",
    agency: "NASA",
    agencyName: "NASA JPL CNEOS",
    country: "United States",
    countryFlag: "🇺🇸",
    tier: "NASA",
    dataset: "Sentry Earth Impact Monitoring API",
    mission: "Planetary Defense Coordination Office",
    dataType: "PLANETARY",
    officialUrl: "https://cneos.jpl.nasa.gov/sentry/",
    apiUrl: "https://ssd-api.jpl.nasa.gov/sentry.api",
    documentationUrl: "https://ssd-api.jpl.nasa.gov/doc/sentry.html",
    accessMethod: "REST API",
    authRequired: "None (Open Public)",
    openPublic: true,
    realTime: true,
    updateFrequency: "Updated as new astrometric observations arrive",
    format: "JSON",
    licenseUsage: "NASA Open Data / Public Domain",
    missionForgeUseCase: "Impact probability calculations for asteroid redirect/rendezvous mission trajectories.",
    integrationStatus: "LIVE",
    verifiedNotes: "Provides impact probability, Palermo Scale, and Torino Scale numbers for active impact risk candidates.",
  },
  {
    id: "nasa-epic",
    agency: "NASA",
    agencyName: "NASA Goddard Space Flight Center",
    country: "United States",
    countryFlag: "🇺🇸",
    tier: "NASA",
    dataset: "DSCOVR EPIC (Earth Polychromatic Imaging Camera)",
    mission: "DSCOVR (Deep Space Climate Observatory at Sun-Earth L1)",
    dataType: "EARTH OBSERVATION",
    officialUrl: "https://epic.gsfc.nasa.gov/",
    apiUrl: "https://api.nasa.gov/EPIC/api/natural",
    documentationUrl: "https://epic.gsfc.nasa.gov/about/api",
    accessMethod: "REST API",
    authRequired: "Free API Key",
    openPublic: true,
    realTime: true,
    updateFrequency: "Daily (multiple full-disc images daily)",
    format: "JSON / JPG / PNG",
    licenseUsage: "NASA Open Data / Public Domain",
    missionForgeUseCase: "Real-time Earth departure view rendering and Sun-Earth L1 Lagrange positioning demonstration.",
    integrationStatus: "LIVE",
    verifiedNotes: "Fetches natural-color full-disc Earth imagery captured 1.5 million kilometers away at L1.",
  },
  {
    id: "nasa-apod",
    agency: "NASA",
    agencyName: "NASA",
    country: "United States",
    countryFlag: "🇺🇸",
    tier: "NASA",
    dataset: "Astronomy Picture of the Day (APOD)",
    mission: "Educational Astronomy Dissemination",
    dataType: "ASTRONOMY",
    officialUrl: "https://apod.nasa.gov/",
    apiUrl: "https://api.nasa.gov/planetary/apod",
    documentationUrl: "https://api.nasa.gov/",
    accessMethod: "REST API",
    authRequired: "Free API Key",
    openPublic: true,
    realTime: true,
    updateFrequency: "Daily at 00:00 UTC",
    format: "JSON / Image",
    licenseUsage: "Public Domain / Various NASA Contributors",
    missionForgeUseCase: "Daily deep-space discovery feed inside Mission Forge Data Center.",
    integrationStatus: "LIVE",
    verifiedNotes: "Active feed in DataCenterModal displaying daily astronomical image, title, and professional editorial explanation.",
  },
  {
    id: "nasa-mars-photos",
    agency: "NASA",
    agencyName: "NASA JPL-Caltech",
    country: "United States",
    countryFlag: "🇺🇸",
    tier: "NASA",
    dataset: "Mars Rover Photos API (Curiosity & Perseverance)",
    mission: "Mars Science Laboratory & Mars 2020",
    dataType: "PLANETARY MISSIONS",
    officialUrl: "https://mars.nasa.gov/msl/home/",
    apiUrl: "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos",
    documentationUrl: "https://api.nasa.gov/",
    accessMethod: "REST API",
    authRequired: "Free API Key",
    openPublic: true,
    realTime: true,
    updateFrequency: "Per Martian Sol as telemetry downlinks",
    format: "JSON / JPG",
    licenseUsage: "NASA Open Data / Public Domain",
    missionForgeUseCase: "Surface camera imagery for Mars landing confirmation and touchdown telemetry verify.",
    integrationStatus: "LIVE",
    verifiedNotes: "Integrated into DataCenterModal feeds. Pulls Mastcam, Navcam, and Hazcam telemetry with Sol indexing.",
  },
  {
    id: "nasa-3d-resources",
    agency: "NASA",
    agencyName: "NASA Centers (JPL, GSFC, JSC, ARC)",
    country: "United States",
    countryFlag: "🇺🇸",
    tier: "NASA",
    dataset: "NASA 3D Resources Repository",
    mission: "Multi-Mission Spacecraft & Planetary Visualization",
    dataType: "3D",
    officialUrl: "https://github.com/nasa/NASA-3D-Resources",
    apiUrl: "https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/",
    documentationUrl: "https://github.com/nasa/NASA-3D-Resources/blob/master/README.md",
    accessMethod: "HTTPS File Navigation",
    authRequired: "None (Open Public)",
    openPublic: true,
    realTime: false,
    updateFrequency: "As repository updates",
    format: "GLB 2.0 / WebP / JPEG",
    licenseUsage: "NASA Open Source Agreement / Public Domain",
    missionForgeUseCase: "Interactive 3D Hangar models (Voyager, Galileo, Cassini, Dawn, Apollo LM) and planet textures.",
    integrationStatus: "CACHED",
    verifiedNotes: "11 GLB models and 8 planetary textures physically cached in public/models and public/textures/nasa-3d.",
  },

  // ==========================================
  // 06 — EUROPEAN SPACE AGENCY (ESA)
  // ==========================================
  {
    id: "esa-psa-tap",
    agency: "ESA",
    agencyName: "European Space Agency (ESAC)",
    country: "Europe (22 Member States)",
    countryFlag: "🇪🇺",
    tier: "SPACE AGENCY PARTNER",
    dataset: "ESA Planetary Science Archive (PSA) TAP Service",
    mission: "Mars Express, ExoMars TGO, BepiColombo, Rosetta, JUICE",
    dataType: "PLANETARY MISSIONS",
    officialUrl: "https://www.cosmos.esa.int/web/psa",
    apiUrl: "https://psa.esa.int/tap-server/tap",
    documentationUrl: "https://psa.esa.int/psa/#/pages/help",
    accessMethod: "IVOA TAP / ADQL",
    authRequired: "None (Open Public)",
    openPublic: true,
    realTime: true,
    updateFrequency: "Quarterly mission delivery releases",
    format: "VOTable / JSON / CSV",
    licenseUsage: "ESA Open Access Policy / CC-BY-SA 3.0 IGO",
    missionForgeUseCase: "European planetary exploration telemetry, Mars atmospheric profiles (TGO NOMAD), and comet encounter planning.",
    integrationStatus: "LIVE",
    verifiedNotes: "Live IVOA Table Access Protocol queried via ADQL: SELECT TOP 10 * FROM epn_core WHERE target_name='Mars'.",
  },
  {
    id: "esa-gaia-tap",
    agency: "ESA",
    agencyName: "European Space Agency",
    country: "Europe (22 Member States)",
    countryFlag: "🇪🇺",
    tier: "SPACE AGENCY PARTNER",
    dataset: "ESA Gaia Astrometric Data Archive (DR3)",
    mission: "Gaia Space Observatory",
    dataType: "ASTRONOMY",
    officialUrl: "https://www.cosmos.esa.int/web/gaia",
    apiUrl: "https://gea.esac.esa.int/tap-server/tap",
    documentationUrl: "https://gea.esac.esa.int/archive/documentation/",
    accessMethod: "IVOA TAP / ADQL",
    authRequired: "None (Open Public)",
    openPublic: true,
    realTime: false,
    updateFrequency: "Major data releases (DR3, upcoming DR4)",
    format: "VOTable / JSON / FITS",
    licenseUsage: "Creative Commons Attribution (CC-BY 4.0)",
    missionForgeUseCase: "Stellar reference frame for optical navigation star trackers and deep space trajectory orientation.",
    integrationStatus: "AVAILABLE",
    verifiedNotes: "Verified open IVOA TAP service containing 1.8 billion astronomical sources with parallax and proper motion.",
  },
  {
    id: "esa-copernicus-stac",
    agency: "ESA",
    agencyName: "European Space Agency / European Commission",
    country: "Europe (22 Member States)",
    countryFlag: "🇪🇺",
    tier: "SPACE AGENCY PARTNER",
    dataset: "Copernicus Data Space Ecosystem STAC API",
    mission: "Sentinel-1, Sentinel-2, Sentinel-3, Sentinel-5P",
    dataType: "EARTH OBSERVATION",
    officialUrl: "https://dataspace.copernicus.eu/",
    apiUrl: "https://catalogue.dataspace.copernicus.eu/stac",
    documentationUrl: "https://documentation.dataspace.copernicus.eu/APIs/STAC.html",
    accessMethod: "STAC API",
    authRequired: "Free Account Required (for downloads)",
    openPublic: true,
    realTime: true,
    updateFrequency: "Sub-daily as Sentinel satellites orbit Earth",
    format: "GeoJSON / Cloud-Optimized GeoTIFF",
    licenseUsage: "Copernicus Open Access / EU Regulation",
    missionForgeUseCase: "Earth launch site meteorological conditions, orbital tracking, and spaceport ground truth validation.",
    integrationStatus: "AVAILABLE",
    verifiedNotes: "Public STAC Catalog queryable without authentication; download of full Sentinel SAFE granules requires free login.",
  },
  {
    id: "esa-swe-portal",
    agency: "ESA",
    agencyName: "ESA Space Safety Programme",
    country: "Europe (22 Member States)",
    countryFlag: "🇪🇺",
    tier: "SPACE AGENCY PARTNER",
    dataset: "ESA Space Weather Service Network (SWE)",
    mission: "Space Safety & Radiation Belt Monitoring",
    dataType: "SPACE WEATHER",
    officialUrl: "https://swe.ssa.esa.int/",
    apiUrl: "https://swe.ssa.esa.int/web/guest/data-center",
    documentationUrl: "https://swe.ssa.esa.int/help",
    accessMethod: "Interactive Web Portal",
    authRequired: "Free Account Required",
    openPublic: true,
    realTime: true,
    updateFrequency: "Hourly updates",
    format: "JSON / NetCDF / Plots",
    licenseUsage: "ESA Open Access",
    missionForgeUseCase: "Secondary space weather verification complementing NASA DONKI for European mission sectors.",
    integrationStatus: "AVAILABLE",
    verifiedNotes: "Provides solar radiation storm indices, Van Allen belt electron fluxes, and geomagnetic Ap/Kp forecasts.",
  },

  // ==========================================
  // 09 — JAPAN AEROSPACE EXPLORATION AGENCY (JAXA)
  // ==========================================
  {
    id: "jaxa-darts",
    agency: "JAXA",
    agencyName: "JAXA Institute of Space and Astronautical Science (ISAS)",
    country: "Japan",
    countryFlag: "🇯🇵",
    tier: "SPACE AGENCY PARTNER",
    dataset: "DARTS (Data ARchives and Transmission System)",
    mission: "Hayabusa2, SLIM, Kaguya, Akatsuki, Hisaki",
    dataType: "PLANETARY MISSIONS",
    officialUrl: "https://www.darts.isas.jaxa.jp/",
    apiUrl: "https://data.darts.isas.jaxa.jp/pub/",
    documentationUrl: "https://www.darts.isas.jaxa.jp/curator/manual/",
    accessMethod: "HTTPS File Navigation",
    authRequired: "None (Open Public)",
    openPublic: true,
    realTime: false,
    updateFrequency: "Per mission calibration release",
    format: "PDS3 / PDS4 / FITS / CSV",
    licenseUsage: "JAXA Terms of Use / Open Science",
    missionForgeUseCase: "Ryugu asteroid physical characteristics (Hayabusa2 ONC-T), SLIM pinpoint lunar landing telemetry, Venus super-rotation (Akatsuki).",
    integrationStatus: "LIVE",
    verifiedNotes: "Open public repository directory structure accessible via HTTPS. Houses calibrated PDS datasets for Japanese planetary missions.",
  },
  {
    id: "jaxa-earth-stac",
    agency: "JAXA",
    agencyName: "JAXA Earth Observation Research Center (EORC)",
    country: "Japan",
    countryFlag: "🇯🇵",
    tier: "SPACE AGENCY PARTNER",
    dataset: "JAXA Earth STAC API & G-Portal",
    mission: "GCOM-C, GCOM-W, ALOS-2 (PALSAR-2), Himawari",
    dataType: "EARTH OBSERVATION",
    officialUrl: "https://earth.jaxa.jp/en/",
    apiUrl: "https://data.earth.jaxa.jp/stac",
    documentationUrl: "https://data.earth.jaxa.jp/en/guide/",
    accessMethod: "STAC API",
    authRequired: "None (Open Public)",
    openPublic: true,
    realTime: true,
    updateFrequency: "Daily / 10-minute meteorological cycles",
    format: "STAC GeoJSON / Cloud-Optimized GeoTIFF",
    licenseUsage: "JAXA Open Data Policy",
    missionForgeUseCase: "Earth launch window weather assessment and Tanegashima Space Center orbital track monitoring.",
    integrationStatus: "AVAILABLE",
    verifiedNotes: "Verified modern STAC catalog supporting spatio-temporal asset queries for Japanese Earth satellites.",
  },

  // ==========================================
  // 16 — MOHAMMED BIN RASHID SPACE CENTRE (MBRSC, UAE)
  // ==========================================
  {
    id: "mbrsc-emm-sdc",
    agency: "MBRSC",
    agencyName: "Mohammed Bin Rashid Space Centre",
    country: "United Arab Emirates",
    countryFlag: "🇦🇪",
    tier: "SPACE AGENCY PARTNER",
    dataset: "Emirates Mars Mission (Hope Probe) Science Data Center",
    mission: "Emirates Mars Mission (Hope / Al-Amal)",
    dataType: "PLANETARY MISSIONS",
    officialUrl: "https://www.emiratesmarsmission.ae/",
    apiUrl: "https://sdc.emiratesmarsmission.ae/",
    documentationUrl: "https://sdc.emiratesmarsmission.ae/software",
    accessMethod: "REST API",
    authRequired: "None (Open Public / Free Account for batch tools)",
    openPublic: true,
    realTime: true,
    updateFrequency: "Every 3 months (Level 2 & Level 3 calibrated data)",
    format: "FITS / PDS4 / JSON metadata",
    licenseUsage: "Open Science Policy / Non-proprietary global access",
    missionForgeUseCase: "Diurnal Martian atmosphere modeling (EXI multiband camera, EMIRS thermal infrared, EMUS ultraviolet). Critical for Mars aerocapture & aerobraking design.",
    integrationStatus: "LIVE",
    verifiedNotes: "Verified official Science Data Center REST API. All science data products published openly to the scientific community.",
  },
  {
    id: "mbrsc-lunar-rashid",
    agency: "MBRSC",
    agencyName: "Mohammed Bin Rashid Space Centre",
    country: "United Arab Emirates",
    countryFlag: "🇦🇪",
    tier: "SPACE AGENCY PARTNER",
    dataset: "Rashid Rover Emirates Lunar Mission Science Archive",
    mission: "Emirates Lunar Mission (Rashid Rover 1 & 2)",
    dataType: "PLANETARY",
    officialUrl: "https://www.mbrsc.ae/emirates-lunar-mission",
    apiUrl: "https://www.mbrsc.ae/en/news-and-updates",
    documentationUrl: "https://www.mbrsc.ae/",
    accessMethod: "Interactive Web Portal",
    authRequired: "N/A",
    openPublic: true,
    realTime: false,
    updateFrequency: "Mission report publications",
    format: "JSON / PDF Reports",
    licenseUsage: "MBRSC Public Information",
    missionForgeUseCase: "Micro-rover mobility parameters on lunar regolith, electrostatic dust mitigation modeling.",
    integrationStatus: "CACHED",
    verifiedNotes: "Technical parameters of the 10kg Rashid micro-rover (thermal probe, Langmuir probe, microscopic imager) indexed in Mission Forge archive.",
  },

  // ==========================================
  // 17 — UK SPACE AGENCY (UKSA)
  // ==========================================
  {
    id: "uksa-open-data",
    agency: "UKSA",
    agencyName: "UK Space Agency",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    tier: "SPACE AGENCY PARTNER",
    dataset: "data.gov.uk UK Space Agency Open Data CKAN API",
    mission: "National Space Strategy & International Partnerships",
    dataType: "SPACECRAFT",
    officialUrl: "https://www.gov.uk/government/organisations/uk-space-agency",
    apiUrl: "https://www.data.gov.uk/api/3/action/package_search?q=space",
    documentationUrl: "https://www.data.gov.uk/terms",
    accessMethod: "CKAN Open Data API",
    authRequired: "None (Open Public)",
    openPublic: true,
    realTime: true,
    updateFrequency: "Quarterly agency updates",
    format: "JSON / CSV / GeoJSON",
    licenseUsage: "Open Government Licence (OGL v3.0)",
    missionForgeUseCase: "SaxeVord / Cornwall launch corridor safety parameters and UK orbital satellite catalog tracking.",
    integrationStatus: "LIVE",
    verifiedNotes: "Verified CKAN REST API endpoint queryable without authorization headers under UK Open Government Licence.",
  },
  {
    id: "uksa-ceda-archive",
    agency: "UKSA",
    agencyName: "Centre for Environmental Data Analysis & UKSA",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    tier: "SPACE AGENCY PARTNER",
    dataset: "CEDA Earth Observation & Atmospheric Archive",
    mission: "BepiColombo (MIXS), Solar Orbiter (MAG), Earth Observation",
    dataType: "SPACE WEATHER",
    officialUrl: "https://www.ceda.ac.uk/",
    apiUrl: "https://dap.ceda.ac.uk/",
    documentationUrl: "https://help.ceda.ac.uk/",
    accessMethod: "HTTPS File Navigation",
    authRequired: "Free Account Required (for deep archive)",
    openPublic: true,
    realTime: true,
    updateFrequency: "Daily / per flyby",
    format: "NetCDF / HDF5 / CSV",
    licenseUsage: "CEDA Data Licence / Open Access",
    missionForgeUseCase: "Planetary magnetosphere boundary crossing data and solar wind interaction parameters.",
    integrationStatus: "AVAILABLE",
    verifiedNotes: "Houses data from UK-led deep-space scientific instruments including Solar Orbiter Magnetometer.",
  },

  // ==========================================
  // 07 — INDIAN SPACE RESEARCH ORGANISATION (ISRO)
  // ==========================================
  {
    id: "isro-issdc-pradan",
    agency: "ISRO",
    agencyName: "Indian Space Science Data Centre (ISSDC)",
    country: "India",
    countryFlag: "🇮🇳",
    tier: "SPACE AGENCY PARTNER",
    dataset: "PRADAN (Planetary Data System Portal) & ISSDC Science Archive",
    mission: "Chandrayaan-2, Chandrayaan-3, Mars Orbiter Mission, Aditya-L1",
    dataType: "PLANETARY MISSIONS",
    officialUrl: "https://www.issdc.gov.in/",
    apiUrl: "https://pradan.issdc.gov.in/pradan/",
    documentationUrl: "https://www.issdc.gov.in/ch3_dataproducts.html",
    accessMethod: "PDS4 / PDS3 Archive",
    authRequired: "Free Account Required",
    openPublic: true,
    realTime: false,
    updateFrequency: "Per mission calibration release",
    format: "PDS4 (XML + binary tables) / FITS / GeoTIFF",
    licenseUsage: "ISRO Terms of Use / Open Scientific Research",
    missionForgeUseCase: "Lunar south pole landing site telemetry (Vikram lander landing site at Shiv Shakti Point, 69.37°S). ChaSTE thermal probe and APXS chemical spectroscopy data.",
    integrationStatus: "AVAILABLE",
    verifiedNotes: "Verified official Indian PDS4 archive portal. Users can register freely to search and download full Chandrayaan-2/3 instrument volumes.",
  },
  {
    id: "isro-bhuvan-ogc",
    agency: "ISRO",
    agencyName: "National Remote Sensing Centre (NRSC / ISRO)",
    country: "India",
    countryFlag: "🇮🇳",
    tier: "SPACE AGENCY PARTNER",
    dataset: "Bhuvan Geoportal & Moon/Mars Thematic Maps",
    mission: "Chandrayaan TMC & Mars Colour Camera (MCC)",
    dataType: "IMAGERY",
    officialUrl: "https://bhuvan.nrsc.gov.in/",
    apiUrl: "https://bhuvan-app1.nrsc.gov.in/thematic/thematic/wms",
    documentationUrl: "https://bhuvan.nrsc.gov.in/bhuvan_links.php",
    accessMethod: "OGC Web Services (WMS/WFS)",
    authRequired: "None (Open Public for tiles)",
    openPublic: true,
    realTime: false,
    updateFrequency: "Periodic updates",
    format: "OGC WMS Tiles / JPEG / PNG",
    licenseUsage: "Government of India / NRSC Open Geospatial",
    missionForgeUseCase: "High-resolution lunar surface crater basemaps and Mars Colour Camera regional mosaics.",
    integrationStatus: "AVAILABLE",
    verifiedNotes: "Open OGC WMS endpoint serving thematic planetary and terrestrial layers produced by Indian space missions.",
  },

  // ==========================================
  // 05 — CANADIAN SPACE AGENCY (CSA)
  // ==========================================
  {
    id: "csa-open-gov",
    agency: "CSA",
    agencyName: "Canadian Space Agency / Open Government Canada",
    country: "Canada",
    countryFlag: "🇨🇦",
    tier: "SPACE AGENCY PARTNER",
    dataset: "Canada Open Government CKAN Space Catalog",
    mission: "RADARSAT Constellation Mission (RCM), SCISAT, Canadarm2/3",
    dataType: "SPACECRAFT",
    officialUrl: "https://www.asc-csa.gc.ca/eng/",
    apiUrl: "https://open.canada.ca/data/en/api/3/action/package_search?q=canadian+space+agency",
    documentationUrl: "https://open.canada.ca/en/open-data",
    accessMethod: "CKAN Open Data API",
    authRequired: "None (Open Public)",
    openPublic: true,
    realTime: true,
    updateFrequency: "Monthly data updates",
    format: "JSON / CSV / GeoJSON",
    licenseUsage: "Open Government Licence - Canada",
    missionForgeUseCase: "Lunar Gateway external robotics readiness telemetry (Canadarm3 specifications), ground station passes.",
    integrationStatus: "AVAILABLE",
    verifiedNotes: "Verified official CKAN REST API endpoint operated by the Government of Canada with comprehensive CSA dataset indexing.",
  },
  {
    id: "csa-eodms",
    agency: "CSA",
    agencyName: "Natural Resources Canada & CSA",
    country: "Canada",
    countryFlag: "🇨🇦",
    tier: "SPACE AGENCY PARTNER",
    dataset: "Earth Observation Data Management System (EODMS)",
    mission: "RADARSAT-1, RADARSAT-2, RCM",
    dataType: "EARTH OBSERVATION",
    officialUrl: "https://www.eodms-sgdot.nrcan-rncan.gc.ca/",
    apiUrl: "https://www.eodms-sgdot.nrcan-rncan.gc.ca/wes/rapi",
    documentationUrl: "https://www.eodms-sgdot.nrcan-rncan.gc.ca/eodms_api_help.html",
    accessMethod: "REST API",
    authRequired: "Free Account Required",
    openPublic: true,
    realTime: true,
    updateFrequency: "Continuous SAR image acquisition",
    format: "GeoTIFF / NITF / JSON",
    licenseUsage: "Open Government Licence - Canada",
    missionForgeUseCase: "C-band synthetic aperture radar calibration benchmarks and sea-ice navigation for polar launch tracking.",
    integrationStatus: "AVAILABLE",
    verifiedNotes: "Verified REST API (RAPI) for querying Canada's official Earth Observation satellite archive.",
  },

  // ==========================================
  // 08 — ITALIAN SPACE AGENCY (ASI)
  // ==========================================
  {
    id: "asi-ssdc",
    agency: "ASI",
    agencyName: "ASI Space Science Data Center (SSDC)",
    country: "Italy",
    countryFlag: "🇮🇹",
    tier: "SPACE AGENCY PARTNER",
    dataset: "ASI SSDC Multi-Mission Scientific Archives",
    mission: "LICIACube (DART impact), BepiColombo (ISA/SIMBIO-SYS), AGILE, PRISMA",
    dataType: "ASTRONOMY",
    officialUrl: "https://www.ssdc.asi.it/",
    apiUrl: "https://www.ssdc.asi.it/vo.html",
    documentationUrl: "https://www.ssdc.asi.it/documentation.html",
    accessMethod: "IVOA TAP / ADQL",
    authRequired: "None (Open Public for astronomical tables)",
    openPublic: true,
    realTime: false,
    updateFrequency: "Periodic mission updates",
    format: "FITS / VOTable / HTML",
    licenseUsage: "ASI Open Science Policy",
    missionForgeUseCase: "Asteroid kinetic deflection parameters (LICIACube DART impact plume observation) and high-precision deep space accelerometer calibration.",
    integrationStatus: "AVAILABLE",
    verifiedNotes: "Verified Italian Space Science Data Center supporting IVOA standards and scientific web query interfaces.",
  },
  {
    id: "asi-prisma",
    agency: "ASI",
    agencyName: "Agenzia Spaziale Italiana",
    country: "Italy",
    countryFlag: "🇮🇹",
    tier: "SPACE AGENCY PARTNER",
    dataset: "PRISMA Hyperspectral Earth Observation Portal",
    mission: "PRISMA (PRecursore IperSpettrale della Missione Applicativa)",
    dataType: "EARTH OBSERVATION",
    officialUrl: "https://prisma.asi.it/",
    apiUrl: "https://prisma.asi.it/missionportal/",
    documentationUrl: "https://prisma.asi.it/missionportal/documents",
    accessMethod: "Interactive Web Portal",
    authRequired: "Free Account Required",
    openPublic: true,
    realTime: true,
    updateFrequency: "Daily hyperspectral acquisitions",
    format: "HDF5 / GeoTIFF",
    licenseUsage: "ASI PRISMA User Licence",
    missionForgeUseCase: "Hyperspectral sensor modeling for orbital reconnaissance instrumentation.",
    integrationStatus: "AVAILABLE",
    verifiedNotes: "Official ASI mission portal providing 240-band hyperspectral imaging data of planetary surfaces.",
  },

  // ==========================================
  // 10 — KOREA AEROSPACE ADMINISTRATION (KASA / KARI)
  // ==========================================
  {
    id: "kasa-kpds-danuri",
    agency: "KASA",
    agencyName: "Korea AeroSpace Administration / KARI",
    country: "South Korea",
    countryFlag: "🇰🇷",
    tier: "SPACE AGENCY PARTNER",
    dataset: "KPDS (KPLO Planetary Data System) Archive",
    mission: "Danuri (KPLO - Korea Pathfinder Lunar Orbiter)",
    dataType: "PLANETARY MISSIONS",
    officialUrl: "https://kpds.kari.re.kr/",
    apiUrl: "https://kpds.kari.re.kr/pds/",
    documentationUrl: "https://kpds.kari.re.kr/guide.do",
    accessMethod: "PDS4 / PDS3 Archive",
    authRequired: "None (Open Public browsing / Registration for bulk download)",
    openPublic: true,
    realTime: false,
    updateFrequency: "Every 6 months (PDS4 delivery)",
    format: "PDS4 (XML + RAW/IMG) / GeoTIFF",
    licenseUsage: "KARI / KASA Open Data Policy",
    missionForgeUseCase: "Permanently shadowed crater polar water-ice detection (NASA ShadowCam on Danuri) and ballistic lunar transfer (BLT) trajectory modeling.",
    integrationStatus: "AVAILABLE",
    verifiedNotes: "Verified official South Korean planetary data archive complying with international PDS4 standards for Danuri science instruments.",
  },

  // ==========================================
  // 02 — CONAE (ARGENTINA)
  // ==========================================
  {
    id: "conae-saocom-catalog",
    agency: "CONAE",
    agencyName: "Comisión Nacional de Actividades Espaciales",
    country: "Argentina",
    countryFlag: "🇦🇷",
    tier: "SPACE AGENCY PARTNER",
    dataset: "Catálogo 2P CONAE & GeoNode SAOCOM Archive",
    mission: "SAOCOM 1A, SAOCOM 1B, SAC-D/Aquarius",
    dataType: "EARTH OBSERVATION",
    officialUrl: "https://www.argentina.gob.ar/ciencia/conae",
    apiUrl: "https://catalogos.conae.gov.ar/",
    documentationUrl: "https://geoconae.conae.gov.ar/",
    accessMethod: "OGC Web Services (WMS/WFS)",
    authRequired: "Free Account Required (for raw SAR)",
    openPublic: true,
    realTime: true,
    updateFrequency: "Daily satellite passes",
    format: "GeoTIFF / CEOS / OGC WMS",
    licenseUsage: "CONAE Data Policy / Creative Commons for thematic maps",
    missionForgeUseCase: "L-band polarimetric radar penetration modeling for planetary surface subsurface sounding analogue.",
    integrationStatus: "AVAILABLE",
    verifiedNotes: "Verified open spatial catalog and OGC GeoNode services at geoconae.conae.gov.ar.",
  },

  // ==========================================
  // 04 — BRAZILIAN SPACE AGENCY (AEB / INPE)
  // ==========================================
  {
    id: "aeb-inpe-open-data",
    agency: "AEB",
    agencyName: "Agência Espacial Brasileira & INPE",
    country: "Brazil",
    countryFlag: "🇧🇷",
    tier: "SPACE AGENCY PARTNER",
    dataset: "INPE DGI Satellite Image Catalog & BDQueimadas Feeds",
    mission: "Amazonia-1, CBERS-4, CBERS-4A",
    dataType: "EARTH OBSERVATION",
    officialUrl: "https://www.gov.br/aeb",
    apiUrl: "https://queimadas.dcp.inpe.br/queimadas/dados-abertos/",
    documentationUrl: "http://www.dgi.inpe.br/catalogo/",
    accessMethod: "REST API",
    authRequired: "None (Open Public for environmental feeds)",
    openPublic: true,
    realTime: true,
    updateFrequency: "Updated every 3 hours",
    format: "CSV / JSON / GeoTIFF",
    licenseUsage: "Open Government Data (Brazil) / CC-BY",
    missionForgeUseCase: "Equatorial launch corridor atmospheric telemetry and Alcântara Space Center launch window verification.",
    integrationStatus: "AVAILABLE",
    verifiedNotes: "Verified open CSV/JSON environmental telemetry API provided by INPE, accessible without authentication.",
  },

  // ==========================================
  // 14 — SPANISH SPACE AGENCY (AEE / INTA / CAB)
  // ==========================================
  {
    id: "aee-cab-meda",
    agency: "AEE",
    agencyName: "Agencia Espacial Española & Centro de Astrobiología (CAB / INTA-CSIC)",
    country: "Spain",
    countryFlag: "🇪🇸",
    tier: "SPACE AGENCY PARTNER",
    dataset: "CAB Mars Environmental Dynamics Analyzer (MEDA) Science Archive",
    mission: "Mars 2020 Perseverance Rover (MEDA) & Curiosity (REMS)",
    dataType: "PLANETARY MISSIONS",
    officialUrl: "https://www.aee.gob.es/",
    apiUrl: "https://cab.inta-csic.es/meda/",
    documentationUrl: "https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/PERSEVERANCE/meda.html",
    accessMethod: "PDS4 / PDS3 Archive",
    authRequired: "None (Open Public via PDS)",
    openPublic: true,
    realTime: false,
    updateFrequency: "Regular PDS4 data release tranches",
    format: "PDS4 (XML + CSV tables)",
    licenseUsage: "NASA/CAB Open Science / Public Domain",
    missionForgeUseCase: "Martian surface atmospheric temperature, relative humidity, pressure, and dust optical depth modeling. Informs rover battery degradation from dust accumulation.",
    integrationStatus: "AVAILABLE",
    verifiedNotes: "Spain's Centro de Astrobiología is the Principal Investigator institution for MEDA on Perseverance. Datasets available through PDS Atmospheres node.",
  },

  // ==========================================
  // 01 — ANGOLA (GGPEN)
  // ==========================================
  {
    id: "ggpen-angosat",
    agency: "GGPEN",
    agencyName: "Gabinete de Gestão do Programa Espacial Nacional",
    country: "Angola",
    countryFlag: "🇦🇴",
    tier: "SPACE AGENCY PARTNER",
    dataset: "ANGOSAT-2 Orbital Telemetry & Tech-Gest Space Applications",
    mission: "ANGOSAT-2 (C/Ku-Band GEO Satellite at 53°E)",
    dataType: "SPACECRAFT",
    officialUrl: "https://www.ggpen.gov.ao/",
    apiUrl: "None / Web Interface",
    documentationUrl: "https://www.ggpen.gov.ao/pt/projectos/",
    accessMethod: "Static Institutional Catalog",
    authRequired: "Institutional / Restricted",
    openPublic: false,
    realTime: false,
    updateFrequency: "Institutional press bulletins",
    format: "PDF / HTML",
    licenseUsage: "Government of Angola / Institutional",
    missionForgeUseCase: "African geostationary telecommunications coverage mapping and deep-space ground relay network simulation.",
    integrationStatus: "UNAVAILABLE",
    verifiedNotes: "DISCOVERED — NO VERIFIED PUBLIC API FOUND. Institutional portal audited; public telemetry API is not provided.",
  },

  // ==========================================
  // 03 — BAHRAIN (BSA / NSSA)
  // ==========================================
  {
    id: "bsa-light1-munther",
    agency: "BSA",
    agencyName: "Bahrain Space Agency (NSSA)",
    country: "Bahrain",
    countryFlag: "🇧🇭",
    tier: "SPACE AGENCY PARTNER",
    dataset: "Light-1 Terrestrial Gamma-Ray Flashes Science Archive & Al-Munther CubeSat",
    mission: "Light-1 (Joint UAE-Bahrain 3U CubeSat) & Al-Munther",
    dataType: "SPACECRAFT",
    officialUrl: "https://bsa.gov.bh/",
    apiUrl: "None / Web Interface",
    documentationUrl: "https://bsa.gov.bh/projects/",
    accessMethod: "Static Institutional Catalog",
    authRequired: "N/A",
    openPublic: false,
    realTime: false,
    updateFrequency: "Mission publications",
    format: "PDF Reports / Institutional Bulletin",
    licenseUsage: "Government of Bahrain / NSSA",
    missionForgeUseCase: "Atmospheric high-energy gamma-ray hazard modeling and CubeSat secondary payload sizing.",
    integrationStatus: "UNAVAILABLE",
    verifiedNotes: "DISCOVERED — NO VERIFIED PUBLIC API FOUND. Light-1 detected terrestrial gamma-ray flashes; scientific data distributed via university consortium.",
  },

  // ==========================================
  // 11 — NIGERIA (NASRDA)
  // ==========================================
  {
    id: "nasrda-nigeriasat",
    agency: "NASRDA",
    agencyName: "National Space Research and Development Agency",
    country: "Nigeria",
    countryFlag: "🇳🇬",
    tier: "SPACE AGENCY PARTNER",
    dataset: "NigeriaSat Earth Observation Archive & DMC Consortium Data",
    mission: "NigeriaSat-1, NigeriaSat-2, NigeriaSat-X",
    dataType: "EARTH OBSERVATION",
    officialUrl: "https://central.nasrda.gov.ng/",
    apiUrl: "None / Web Interface",
    documentationUrl: "https://central.nasrda.gov.ng/centres/",
    accessMethod: "Static Institutional Catalog",
    authRequired: "Institutional / Restricted",
    openPublic: false,
    realTime: false,
    updateFrequency: "Institutional releases",
    format: "TIFF / JPEG (upon request)",
    licenseUsage: "Federal Government of Nigeria / NASRDA",
    missionForgeUseCase: "Equatorial launch corridor safety and disaster monitoring satellite network modeling.",
    integrationStatus: "UNAVAILABLE",
    verifiedNotes: "DISCOVERED — NO VERIFIED PUBLIC API FOUND. Institutional portal audited; programmatic public API is not currently exposed.",
  },

  // ==========================================
  // 12 — PARAGUAY (AEP)
  // ==========================================
  {
    id: "aep-guaranisat",
    agency: "AEP",
    agencyName: "Agencia Espacial del Paraguay",
    country: "Paraguay",
    countryFlag: "🇵🇾",
    tier: "SPACE AGENCY PARTNER",
    dataset: "GuaraniSat-1 Mission Telemetry & Academic Reports",
    mission: "GuaraniSat-1 (BIRDS-4 1U CubeSat)",
    dataType: "SPACECRAFT",
    officialUrl: "https://aep.gov.py/",
    apiUrl: "None / Web Interface",
    documentationUrl: "https://aep.gov.py/proyectos/",
    accessMethod: "Static Institutional Catalog",
    authRequired: "N/A",
    openPublic: false,
    realTime: false,
    updateFrequency: "Academic publications",
    format: "PDF / HTML",
    licenseUsage: "Agencia Espacial del Paraguay",
    missionForgeUseCase: "1U CubeSat amateur beacon reception, low-cost sensor platform power profiling.",
    integrationStatus: "UNAVAILABLE",
    verifiedNotes: "DISCOVERED — NO VERIFIED PUBLIC API FOUND. GuaraniSat-1 was built with Kyushu Institute of Technology; telemetry archived through amateur radio network.",
  },

  // ==========================================
  // 13 — SENEGAL (ASES)
  // ==========================================
  {
    id: "ases-gaindesat",
    agency: "ASES",
    agencyName: "Agence Sénégalaise d'Études Spatiales",
    country: "Senegal",
    countryFlag: "🇸🇳",
    tier: "SPACE AGENCY PARTNER",
    dataset: "GAINDESAT-1A Satellite Environmental Telemetry",
    mission: "GAINDESAT-1A (Launched August 2024 via Falcon 9 Transporter-11)",
    dataType: "SPACECRAFT",
    officialUrl: "https://sites.google.com/view/redirectionases/ases",
    apiUrl: "None / Web Interface",
    documentationUrl: "https://sites.google.com/view/redirectionases/ases/projets",
    accessMethod: "Static Institutional Catalog",
    authRequired: "N/A",
    openPublic: false,
    realTime: false,
    updateFrequency: "Institutional announcements",
    format: "HTML / Technical Bulletins",
    licenseUsage: "Government of Senegal / ASES",
    missionForgeUseCase: "CubeSat rideshare launch parameter validation and environmental telemetry collection.",
    integrationStatus: "UNAVAILABLE",
    verifiedNotes: "DISCOVERED — NO VERIFIED PUBLIC API FOUND. Recently founded agency with first satellite launched in Aug 2024. Open public API under development.",
  },

  // ==========================================
  // 15 — TURKEY (TUA)
  // ==========================================
  {
    id: "tua-ayap1-lunar",
    agency: "TUA",
    agencyName: "Türkiye Uzay Ajansı (Turkish Space Agency)",
    country: "Turkey",
    countryFlag: "🇹🇷",
    tier: "SPACE AGENCY PARTNER",
    dataset: "AYAP-1 (National Lunar Research Program) & IMECE Earth Observation Specifications",
    mission: "AYAP-1 (Anadolu Lunar Orbiter/Impactor) & IMECE",
    dataType: "PLANETARY MISSIONS",
    officialUrl: "https://tua.gov.tr/en",
    apiUrl: "None / Web Interface",
    documentationUrl: "https://tua.gov.tr/en/national-space-program",
    accessMethod: "Static Institutional Catalog",
    authRequired: "N/A",
    openPublic: false,
    realTime: false,
    updateFrequency: "Milestone press releases",
    format: "PDF / Technical Whitepapers",
    licenseUsage: "Republic of Türkiye / TUA",
    missionForgeUseCase: "Lunar hard impact trajectory design and hybrid propulsion engine test parameters.",
    integrationStatus: "UNAVAILABLE",
    verifiedNotes: "DISCOVERED — NO VERIFIED PUBLIC API FOUND. AYAP-1 mission architecture and propulsion parameters verified through official technical publications.",
  },
];

/**
 * Filter space data sources by arbitrary criteria
 */
export function filterSpaceDataSources(filters: {
  agency?: AgencyId | "ALL";
  tier?: AgencyPartnerTier | "ALL";
  dataType?: DataCategory | "ALL";
  status?: IntegrationStatus | "ALL";
  search?: string;
}): SpaceDataSource[] {
  return SPACE_DATA_SOURCES.filter((source) => {
    if (filters.agency && filters.agency !== "ALL" && source.agency !== filters.agency) {
      return false;
    }
    if (filters.tier && filters.tier !== "ALL" && source.tier !== filters.tier) {
      return false;
    }
    if (filters.dataType && filters.dataType !== "ALL" && source.dataType !== filters.dataType) {
      return false;
    }
    if (filters.status && filters.status !== "ALL" && source.integrationStatus !== filters.status) {
      return false;
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase();
      const match =
        source.dataset.toLowerCase().includes(q) ||
        source.agency.toLowerCase().includes(q) ||
        source.agencyName.toLowerCase().includes(q) ||
        source.mission.toLowerCase().includes(q) ||
        source.country.toLowerCase().includes(q) ||
        source.missionForgeUseCase.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

/**
 * Compute global audit statistics across all 18 organizations
 */
export function getSpaceDataAuditStats() {
  const totalSources = SPACE_DATA_SOURCES.length;
  const totalAgencies = Object.keys(SPACE_AGENCIES).length; // 18 agencies
  const live = SPACE_DATA_SOURCES.filter((s) => s.integrationStatus === "LIVE").length;
  const cached = SPACE_DATA_SOURCES.filter((s) => s.integrationStatus === "CACHED").length;
  const available = SPACE_DATA_SOURCES.filter((s) => s.integrationStatus === "AVAILABLE").length;
  const demo = SPACE_DATA_SOURCES.filter((s) => s.integrationStatus === "DEMO").length;
  const unavailable = SPACE_DATA_SOURCES.filter((s) => s.integrationStatus === "UNAVAILABLE").length;
  const authRequired = SPACE_DATA_SOURCES.filter((s) => s.authRequired.includes("Required") || s.authRequired.includes("Key")).length;
  const integrated = live + cached; // Actually connected in code

  return {
    totalSources,
    totalAgencies,
    live,
    cached,
    available,
    demo,
    unavailable,
    authRequired,
    integrated,
  };
}

/**
 * Get agency summary including datasets discovered and integration count
 */
export function getAgencyAuditSummaries() {
  return Object.values(SPACE_AGENCIES).map((agency) => {
    const sources = SPACE_DATA_SOURCES.filter((s) => s.agency === agency.id);
    const discovered = sources.length;
    const live = sources.filter((s) => s.integrationStatus === "LIVE").length;
    const cached = sources.filter((s) => s.integrationStatus === "CACHED").length;
    const available = sources.filter((s) => s.integrationStatus === "AVAILABLE").length;
    const unavailable = sources.filter((s) => s.integrationStatus === "UNAVAILABLE").length;
    const integrated = live + cached;

    return {
      ...agency,
      discovered,
      integrated,
      live,
      cached,
      available,
      unavailable,
      sources,
    };
  });
}
