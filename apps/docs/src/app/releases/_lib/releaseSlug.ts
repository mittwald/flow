/** Deterministic anchor/id slug for a release, e.g. "1.1.0" -> "release-1-1-0". */
export const releaseSlug = (version: string): string =>
  `release-${version.replace(/\./g, "-")}`;
