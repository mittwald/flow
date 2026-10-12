#!/usr/bin/env node
// @ts-check
/**
 * Publish turnstile — Actions-API shell around publish-turnstile-lib.mjs.
 *
 * Holds the run just before its publish step until no earlier publish run is
 * still active, so the two release lines never write the same npm package
 * document at the same moment. Runs AFTER the build on purpose: both lines then
 * build in parallel and only the ~2min publish serializes.
 *
 * Never fails. A turnstile that blocks a release is worse than the collision it
 * prevents, so every unknown — no run id, an unreadable API, the wait cap —
 * warns and proceeds, which is exactly the behaviour without it.
 */
import { execFileSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import {
  MAX_WAIT_MS,
  POLL_INTERVAL_MS,
  describeBlockingRuns,
  selectBlockingRuns,
} from "./publish-turnstile-lib.mjs";

const repo = process.env.GITHUB_REPOSITORY;
const myRunId = Number(process.env.GITHUB_RUN_ID);

// `GITHUB_WORKFLOW_REF` is `owner/repo/.github/workflows/<file>@refs/heads/x`.
// Reading the file name from it keeps the turnstile pointed at its own workflow
// if the file is ever renamed — which npm's Trusted Publisher makes unlikely,
// but the fallback costs one line.
const workflowFile =
  process.env.GITHUB_WORKFLOW_REF?.split("@")[0]?.split("/").pop() ||
  "publish.yml";

if (!repo || !Number.isFinite(myRunId)) {
  console.log(
    "::warning::No GITHUB_REPOSITORY / GITHUB_RUN_ID — skipping the publish turnstile.",
  );
  process.exit(0);
}

/**
 * The workflow's recent runs, newest first. `null` means the API could not be
 * read — the caller treats that as "stop waiting", not as "nothing is
 * running".
 *
 * No status filter: the lib decides what counts as active, so a status the
 * filter does not know about cannot silently drop a run from the list. 50 is
 * far more than the handful of runs that can be active at once.
 *
 * @returns {import("./publish-turnstile-lib.mjs").Run[] | null}
 */
function fetchRuns() {
  try {
    const stdout = execFileSync(
      "gh",
      [
        "api",
        `repos/${repo}/actions/workflows/${workflowFile}/runs?per_page=50`,
        "--jq",
        "[.workflow_runs[] | {id, status, branch: .head_branch, event}]",
      ],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
    return JSON.parse(stdout);
  } catch (error) {
    console.log(
      `::warning::Could not read the workflow's runs (${
        error instanceof Error ? error.message.split("\n")[0] : "unknown error"
      }) — publishing without waiting.`,
    );
    return null;
  }
}

const startedAt = Date.now();
const deadline = startedAt + MAX_WAIT_MS;
let waited = false;

for (;;) {
  const runs = fetchRuns();
  if (runs === null) break;

  const blocking = selectBlockingRuns(myRunId, runs);
  if (blocking.length === 0) {
    if (waited) {
      console.log(
        `Turnstile clear after ${Math.round((Date.now() - startedAt) / 1000)}s — publishing.`,
      );
    } else {
      console.log("No earlier publish run in flight — publishing.");
    }
    break;
  }

  if (Date.now() >= deadline) {
    console.log(
      `::warning::Still waiting for ${describeBlockingRuns(blocking)} after ${MAX_WAIT_MS / 60_000}min — publishing anyway. Two concurrent publishes can collide on npm; check that every package landed.`,
    );
    break;
  }

  waited = true;
  console.log(
    `Waiting for ${blocking.length} earlier publish run(s): ${describeBlockingRuns(blocking)}`,
  );
  await sleep(POLL_INTERVAL_MS);
}
