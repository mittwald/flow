// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MAX_WAIT_MS,
  POLL_INTERVAL_MS,
  describeBlockingRuns,
  isActive,
  selectBlockingRuns,
} from "./publish-turnstile-lib.mjs";

test("isActive: only `completed` is terminal", () => {
  assert.equal(isActive({ id: 1, status: "completed" }), false);
  for (const status of [
    "queued",
    "in_progress",
    "waiting",
    "requested",
    "pending",
    "a_status_this_api_version_does_not_have_yet",
  ]) {
    assert.equal(isActive({ id: 1, status }), true, status);
  }
});

test("selectBlockingRuns: waits for earlier runs, not for later ones or itself", () => {
  const runs = [
    { id: 300, status: "in_progress" }, // newer — its problem, not ours
    { id: 200, status: "in_progress" }, // this run
    { id: 150, status: "queued" },
    { id: 100, status: "completed" }, // done
    { id: 50, status: "in_progress" },
  ];
  assert.deepEqual(
    selectBlockingRuns(200, runs).map((run) => run.id),
    [50, 150],
  );
});

test("selectBlockingRuns: the earliest active run never waits", () => {
  // This is the whole deadlock argument: ids are unique, so the order is total
  // and exactly one run is at its front. Whichever run that is, it proceeds —
  // and the chain behind it drains.
  const runs = [
    { id: 900, status: "queued" },
    { id: 700, status: "in_progress" },
    { id: 400, status: "queued" },
  ];
  for (const run of runs) {
    const blocking = selectBlockingRuns(run.id, runs);
    assert.equal(
      blocking.length === 0,
      run.id === 400,
      `#${run.id} should ${run.id === 400 ? "not " : ""}wait`,
    );
  }
});

test("selectBlockingRuns: a run evicted by its own concurrency group frees the turnstile", () => {
  // GitHub cancels a superseded pending run; a cancelled run reports
  // `completed`, so waiting on it ends rather than stalling for the full cap.
  const runs = [{ id: 10, status: "completed" }];
  assert.deepEqual(selectBlockingRuns(20, runs), []);
});

test("describeBlockingRuns: names the run and survives missing fields", () => {
  assert.equal(
    describeBlockingRuns([
      { id: 42, status: "in_progress", branch: "next", event: "push" },
    ]),
    "#42 (next, push, in_progress)",
  );
  assert.equal(describeBlockingRuns([{ id: 7 }]), "#7 ()");
  assert.equal(describeBlockingRuns([]), "");
});

test("the wait cap fits inside the job's timeout", () => {
  // `publish` runs with `timeout-minutes: 30` and spends ~5min on the build
  // before the turnstile plus publish, push and release after it. A cap that
  // ate the whole budget would turn a wait into a timed-out release.
  assert.ok(MAX_WAIT_MS <= 20 * 60_000, `cap is ${MAX_WAIT_MS}ms`);
  assert.ok(POLL_INTERVAL_MS <= 30_000, "polling too coarse to be responsive");
  assert.ok(POLL_INTERVAL_MS >= 5_000, "polling would hammer the API");
});
