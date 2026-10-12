// @ts-check
/**
 * Publish-turnstile classification — pure functions, no network.
 *
 * Both release lines publish the SAME npm packages from the SAME workflow file,
 * and nothing serializes them against each other: the workflow's concurrency
 * group follows the ref (`mutate-main` / `mutate-next`), so a push to `main`
 * and the forward-merge it triggers produce two publish runs that overlap by
 * seconds. Both then walk the same toposort with `--concurrency 1` at the same
 * pace, which is how they drift into lockstep.
 *
 * Two publishes writing the same package document at the same moment make npm
 * answer the loser `409 Failed to save packument` — and `lerna publish` maps
 * that to "already published": it warns and exits 0 (lerna-lite
 * `is-npm-js-publish-version-conflict.js`). 1.1.31 shipped 10 of 13 packages
 * that way, green, with tag and GitHub Release cut, and
 * `flow-remote-react-components@1.1.31` then pinned a
 * `flow-remote-elements@1.1.31` that did not exist — `workspace:*` packs as an
 * EXACT pin, so installing it failed with `ETARGET` (#2887).
 *
 * The obvious fix — one shared concurrency group across both lines — is ruled
 * out by this repo's own experience. GitHub keeps ONE pending run per group and
 * cancels it when a newer run arrives, and a cancelled run is not a failure;
 * `forward-merge.yml` documents that eviction and carries a `workflow_run`
 * catch-up trigger to survive it. A publish has no such catch-up, so an evicted
 * run would be a release that silently never happened — trading a rare hole for
 * a rarer, larger one.
 *
 * So this turnstile waits rather than queues. A run publishes once no publish
 * run that sorts before it is still active.
 *
 * @typedef {{
 *   id: number;
 *   status?: unknown;
 *   branch?: unknown;
 *   event?: unknown;
 * }} Run
 */

/**
 * Time between polls. The publish phase itself takes ~2min, so this resolves a
 * wait within a poll of the other run finishing without hammering the API.
 */
export const POLL_INTERVAL_MS = 15_000;

/**
 * How long a run waits before publishing anyway.
 *
 * The turnstile must never be the reason a release does not happen: past the
 * cap it warns and proceeds, which is exactly today's behaviour. 15min sits
 * inside the job's `timeout-minutes: 30` with room for the build before it and
 * the publish, push and release after it.
 */
export const MAX_WAIT_MS = 15 * 60_000;

/**
 * A run still holds the turnstile until it reaches `completed` — the only
 * terminal status the Actions API has. Every other value (`queued`,
 * `in_progress`, `waiting`, `requested`, `pending`) means the run can still
 * reach its publish step, so read them all as active rather than enumerating a
 * list that a future API version can extend.
 *
 * A run cancelled by its own line's concurrency group reports `completed`, so
 * an eviction upstream releases the turnstile instead of stalling it.
 *
 * @param {Run} run
 */
export function isActive(run) {
  return run.status !== "completed";
}

/**
 * The runs this one must wait for: active publish runs that sort before it.
 *
 * Ordering is by run id, and the property that matters is not that ids track
 * creation time — it is that they are UNIQUE, which makes the order TOTAL. The
 * run with the smallest id therefore always has an empty blocking list and
 * proceeds, so the chain always drains and no two runs can wait for each other.
 * That is what rules out a deadlock, and it holds even if GitHub ever hands out
 * ids that are not monotonic in time.
 *
 * @param {number} myRunId
 * @param {Run[]} runs
 * @returns {Run[]} Blocking runs, smallest id first.
 */
export function selectBlockingRuns(myRunId, runs) {
  return runs
    .filter((run) => run.id < myRunId && isActive(run))
    .sort((a, b) => a.id - b.id);
}

/**
 * One log line naming what is being waited for, so a slow release reads as a
 * queue rather than as a hang.
 *
 * @param {Run[]} runs
 * @returns {string}
 */
export function describeBlockingRuns(runs) {
  return runs
    .map(
      (run) =>
        `#${run.id} (${[run.branch, run.event, run.status]
          .filter((field) => typeof field === "string" && field.length > 0)
          .join(", ")})`,
    )
    .join(", ");
}
