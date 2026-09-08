import assert from "node:assert/strict";
import test from "node:test";
import {
  apiFetch,
  isConnectPhaseError,
  isRetryableStatus,
} from "./apiFetch.ts";

/** The shape undici produces when the TCP handshake never completes. */
const connectTimeout = (): Error =>
  Object.assign(new TypeError("fetch failed"), {
    cause: Object.assign(new Error("Connect Timeout Error"), {
      code: "UND_ERR_CONNECT_TIMEOUT",
    }),
  });

/** A socket that died after the request went out — the server may have acted. */
const socketReset = (): Error =>
  Object.assign(new TypeError("fetch failed"), {
    cause: Object.assign(new Error("read ECONNRESET"), { code: "ECONNRESET" }),
  });

const response = (status: number): Response =>
  new Response(status === 204 ? null : "{}", { status });

interface Harness {
  fetchImpl: typeof globalThis.fetch;
  sleep: (ms: number) => Promise<void>;
  calls: () => number;
  delays: () => number[];
}

/** Replays `outcomes` one per attempt; an Error is thrown, a Response returned. */
const harness = (outcomes: (Response | Error)[]): Harness => {
  let calls = 0;
  const delays: number[] = [];

  return {
    fetchImpl: (() => {
      const outcome = outcomes[calls++] ?? outcomes.at(-1);
      if (outcome instanceof Error) return Promise.reject(outcome);
      return Promise.resolve(outcome as Response);
    }) as unknown as typeof globalThis.fetch,
    sleep: (ms) => {
      delays.push(ms);
      return Promise.resolve();
    },
    calls: () => calls,
    delays: () => delays,
  };
};

const call = (h: Harness, idempotent: boolean): Promise<Response> =>
  apiFetch(
    "https://api.example.test/v2/things",
    { method: idempotent ? "GET" : "POST" },
    { label: "things", idempotent, fetchImpl: h.fetchImpl, sleep: h.sleep },
  );

test("classifies connect-phase errors", () => {
  assert.equal(isConnectPhaseError(connectTimeout()), true);
  assert.equal(isConnectPhaseError(socketReset()), false);
  assert.equal(isConnectPhaseError(new Error("boom")), false);
});

// The whole policy keys on `cause.code`, so pin the shape undici really
// produces rather than only the hand-built errors above. A closed loopback port
// refuses instantly and needs no network.
test("recognises a real undici connect failure", async () => {
  await assert.rejects(fetch("http://127.0.0.1:45999/"), (error: unknown) => {
    assert.equal(
      (error as { cause?: { code?: string } }).cause?.code,
      "ECONNREFUSED",
    );
    assert.equal(isConnectPhaseError(error), true);
    return true;
  });
});

test("classifies retryable statuses", () => {
  assert.deepEqual([429, 500, 502, 503].map(isRetryableStatus), [
    true,
    true,
    true,
    true,
  ]);
  assert.deepEqual([200, 201, 400, 404, 422].map(isRetryableStatus), [
    false,
    false,
    false,
    false,
    false,
  ]);
});

test("retries a connect timeout even for a non-idempotent request", async () => {
  const h = harness([connectTimeout(), connectTimeout(), response(200)]);

  const result = await call(h, false);

  assert.equal(result.status, 200);
  assert.equal(h.calls(), 3);
});

test("does not retry a mid-flight failure for a non-idempotent request", async () => {
  const h = harness([socketReset(), response(200)]);

  await assert.rejects(call(h, false), (error: unknown) => {
    assert.equal(
      (error as { cause?: { code?: string } }).cause?.code,
      "ECONNRESET",
    );
    return true;
  });
  assert.equal(
    h.calls(),
    1,
    "must not replay a request the server may have seen",
  );
});

test("retries a mid-flight failure for an idempotent request", async () => {
  const h = harness([socketReset(), response(200)]);

  const result = await call(h, true);

  assert.equal(result.status, 200);
  assert.equal(h.calls(), 2);
});

test("retries 5xx and 429 only for an idempotent request", async () => {
  const idempotent = harness([response(503), response(429), response(200)]);
  assert.equal((await call(idempotent, true)).status, 200);
  assert.equal(idempotent.calls(), 3);

  const nonIdempotent = harness([response(503), response(200)]);
  assert.equal(
    (await call(nonIdempotent, false)).status,
    503,
    "hands the 503 back instead of replaying a create",
  );
  assert.equal(nonIdempotent.calls(), 1);
});

test("returns a 4xx immediately", async () => {
  const h = harness([response(404), response(200)]);

  assert.equal((await call(h, true)).status, 404);
  assert.equal(h.calls(), 1);
});

test("gives up after four attempts and rethrows the last error", async () => {
  const h = harness([connectTimeout()]);

  await assert.rejects(call(h, false), /fetch failed/);
  assert.equal(h.calls(), 4);
});

test("returns the last response instead of retrying forever", async () => {
  const h = harness([response(503)]);

  assert.equal((await call(h, true)).status, 503);
  assert.equal(h.calls(), 4);
});

test("backs off exponentially", async () => {
  const h = harness([connectTimeout()]);

  await assert.rejects(call(h, false));
  assert.deepEqual(h.delays(), [500, 1000, 2000]);
});
