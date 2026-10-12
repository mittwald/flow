import assert from "node:assert/strict";
import test from "node:test";
import { pollUntil } from "./pollUntil.ts";

interface Clock {
  sleep: (ms: number) => Promise<void>;
  now: () => number;
  delays: number[];
}

/** A clock the sleeps drive, so a 30 s poll costs no wall-clock time. */
const clock = (): Clock => {
  let elapsed = 0;
  const delays: number[] = [];

  return {
    sleep: (ms) => {
      delays.push(ms);
      elapsed += ms;
      return Promise.resolve();
    },
    now: () => elapsed,
    delays,
  };
};

/** Answers `undefined` `misses` times, then `value`. */
const probeAfter = <T>(misses: number, value: T) => {
  let calls = 0;

  return {
    probe: (): Promise<T | undefined> =>
      Promise.resolve(calls++ < misses ? undefined : value),
    calls: () => calls,
  };
};

test("returns the first answer without waiting", async () => {
  const c = clock();
  const { probe, calls } = probeAfter(0, "service");

  assert.equal(await pollUntil(probe, { label: "Service", ...c }), "service");
  assert.equal(calls(), 1);
  assert.deepEqual(c.delays, []);
});

test("re-reads until the write shows up", async () => {
  const c = clock();
  const { probe, calls } = probeAfter(2, { id: "abc" });

  assert.deepEqual(await pollUntil(probe, { label: "Service", ...c }), {
    id: "abc",
  });
  assert.equal(calls(), 3);
  assert.deepEqual(c.delays, [500, 1000]);
});

// `undefined` is the sentinel because that is what `Array.find` returns for a
// miss — every other value is an answer.
test("treats null as an answer", async () => {
  const c = clock();

  assert.equal(
    await pollUntil(() => Promise.resolve(null), { label: "Service", ...c }),
    null,
  );
  assert.deepEqual(c.delays, []);
});

test("backs off exponentially up to a capped interval", async () => {
  const c = clock();
  const { probe, calls } = probeAfter(Infinity, "never");

  await assert.rejects(pollUntil(probe, { label: "Service", ...c }));
  assert.deepEqual(
    c.delays,
    [500, 1000, 2000, 4000, 4000, 4000, 4000, 4000, 4000, 2500],
    "doubles to the 4 s cap, and the last wait is clamped to the budget",
  );
  assert.equal(c.now(), 30_000, "spends the full budget, and no more");
  assert.equal(calls(), 11, "probes once more at the deadline");
});

test("names the awaited thing and the budget when it gives up", async () => {
  const c = clock();

  await assert.rejects(
    pollUntil(() => Promise.resolve(undefined), {
      label: "Service docspr-3204",
      timeoutMs: 1000,
      ...c,
    }),
    {
      message: "Service docspr-3204 did not appear within 1000 ms",
    },
  );
});

test("probes once when the budget is zero", async () => {
  const c = clock();
  const { probe, calls } = probeAfter(Infinity, "never");

  await assert.rejects(
    pollUntil(probe, { label: "Service", timeoutMs: 0, ...c }),
  );
  assert.equal(calls(), 1);
  assert.deepEqual(c.delays, []);
});

// apiFetch has already retried what is retryable, so a throw is a real failure.
test("propagates a probe error instead of polling through it", async () => {
  const c = clock();
  let calls = 0;

  await assert.rejects(
    pollUntil(
      () => {
        calls++;
        return Promise.reject(new Error("401 Unauthorized"));
      },
      { label: "Service", ...c },
    ),
    /401 Unauthorized/,
  );
  assert.equal(calls, 1);
});
