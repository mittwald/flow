import type { Release } from "./types";
import { dummyReleases } from "./dummyData";
import { fetchLiveReleases } from "./githubReleases";

/** True when the build should use the dummy fixture instead of the live fetch. */
const useDummy = (): boolean => {
  const flag = process.env.RELEASES_USE_DUMMY;
  return flag === "1" || flag === "true";
};

/**
 * Single data entry point for the Releases page. Runs at build time (static
 * export). Returns dummy data when RELEASES_USE_DUMMY is set, otherwise the
 * transformed live GitHub Releases. Never throws — a failed live fetch yields
 * an empty list (empty-state placeholder).
 */
export const getReleases = async (): Promise<Release[]> => {
  if (useDummy()) {
    return dummyReleases;
  }
  return fetchLiveReleases();
};
