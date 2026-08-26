import { DateTime } from "luxon";

// ──────────────────────────────────────────────────────────────────────────
// Two knobs, set by hand in the release PR. No version magic — the release is a
// deliberate manual cut, so arming the reveal is deliberate too.
// ──────────────────────────────────────────────────────────────────────────

/** The version string the reveal announces. */
export const RELEASE_VERSION = "1.0.0";

/**
 * Flow 1.0.0 release date (ISO, Europe/Berlin). SET THIS to the actual cut date
 * in the release PR — it is the only switch that arms the reveal. Until this
 * date passes, nothing shows.
 */
export const RELEASE_DATE = "2026-08-26";

/** How many days after the release the reveal keeps firing for new browsers. */
export const CELEBRATION_WINDOW_DAYS = 60;

/** LocalStorage key marking that this browser already saw the reveal. */
export const STORAGE_KEY = "flow:v1-celebrated";

/** Dev/preview escape hatch: `?celebrate` in the URL forces the reveal. */
export const FORCE_QUERY_PARAM = "celebrate";

const releaseStart = DateTime.fromISO(RELEASE_DATE, { zone: "Europe/Berlin" });

/** True once the release date has passed — drives the special console greeting. */
export const hasReleased = (now: DateTime = DateTime.now()): boolean =>
  releaseStart.isValid && now >= releaseStart;

/**
 * Is the reveal active right now? True within the celebration window after the
 * release date.
 */
export const isCelebrationActive = (
  now: DateTime = DateTime.now(),
): boolean => {
  if (!releaseStart.isValid) {
    return false;
  }
  const windowEnd = releaseStart.plus({ days: CELEBRATION_WINDOW_DAYS });
  return now >= releaseStart && now < windowEnd;
};
