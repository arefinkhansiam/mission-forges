// src/lib/provenance.ts
/**
 * Strict NASA/ESA/NOAA Scientific Provenance Type Contract
 * Every data point displayed in Mission Forge carries an immutable verification tag.
 * Zero fabricated or mock data is permitted.
 */

export type ProvenanceStatus = "live" | "snapshot" | "unavailable";

export type Provenance = {
  source: string;            // e.g. "NASA DONKI", "NOAA SWPC", "NASA Horizons"
  url: string;               // Exact API endpoint or documentation URL (keys omitted)
  fetchedAt: string;         // ISO 8601 UTC timestamp of the real fetch
  status: ProvenanceStatus;  // "live" (freshly fetched), "snapshot" (cached real snapshot), "unavailable"
  license?: string;          // e.g. "Public Domain / NASA Open Data Policy"
  cachedUntil?: string;      // Expiration time of cached snapshot
};

export type Verified<T> = {
  data: T | null;
  provenance: Provenance;
};

/**
 * Creates a verified payload wrapper for live data
 */
export function createLiveVerified<T>(data: T, source: string, url: string, license = "NASA Public Domain"): Verified<T> {
  return {
    data,
    provenance: {
      source,
      url,
      fetchedAt: new Date().toISOString(),
      status: "live",
      license,
    },
  };
}

/**
 * Creates a verified payload wrapper for cached real snapshots
 */
export function createSnapshotVerified<T>(data: T, source: string, url: string, fetchedAt: string, license = "NASA Public Domain"): Verified<T> {
  return {
    data,
    provenance: {
      source,
      url,
      fetchedAt,
      status: "snapshot",
      license,
    },
  };
}

/**
 * Creates an honest unavailable state wrapper (never fabricates data)
 */
export function createUnavailableVerified<T>(source: string, url: string): Verified<T> {
  return {
    data: null,
    provenance: {
      source,
      url,
      fetchedAt: new Date().toISOString(),
      status: "unavailable",
    },
  };
}
