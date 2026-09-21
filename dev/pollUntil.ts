/**
 * Waits for an eventually consistent API to catch up with a write.
 *
 * The mittwald API accepts a write and can answer the very next read without
 * it: on PR #3204 the service list came back 0 ms after the stack update
 * returned, still missing the service that update had created, and the deploy
 * failed on a resource that in fact existed. So re-read on a backoff until the
 * write shows up, and give up only after a bounded wait.
 *
 * Complements `apiFetch`, which retries a request that _failed_. Here every
 * request succeeds — its answer is just not current yet. A probe that throws is
 * therefore not retried: `apiFetch` has already exhausted its own retries, so
 * the failure is real, and polling would bury it behind a timeout message that
 * names the wrong cause.
 */

const DEFAULT_TIMEOUT_MS = 30_000;
const BASE_INTERVAL_MS = 500;
const MAX_INTERVAL_MS = 4_000;

export interface PollUntilOptions {
  /** Names the awaited thing in the log and in the timeout error. */
  label: string;
  /** Wall clock bound across all attempts, not per attempt. */
  timeoutMs?: number;
  /** Seams for the tests; production uses the globals. */
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
}

const defaultSleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Runs `probe` until it returns something other than `undefined`, then returns
 * that value. Probes once immediately, then on an exponential backoff, and
 * probes a last time at the deadline before throwing.
 */
export const pollUntil = async <T>(
  probe: () => Promise<T | undefined>,
  options: PollUntilOptions,
): Promise<T> => {
  const {
    label,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    sleep = defaultSleep,
    now = () => Date.now(),
  } = options;

  const deadline = now() + timeoutMs;
  let interval = BASE_INTERVAL_MS;

  for (;;) {
    const result = await probe();
    if (result !== undefined) {
      return result;
    }

    const remaining = deadline - now();
    if (remaining <= 0) {
      break;
    }

    const delay = Math.min(interval, remaining);
    console.log(`⏳ ${label} is not visible yet — re-reading in ${delay} ms`);
    await sleep(delay);
    interval = Math.min(interval * 2, MAX_INTERVAL_MS);
  }

  throw new Error(`${label} did not appear within ${timeoutMs} ms`);
};
