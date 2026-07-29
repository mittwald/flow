import type { TestProject } from "vitest/node";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Vitest browser mode runs the cross-version `globalSetup` once PER PROJECT, and
// even a single-instance browser config yields two projects (root + the `webkit`
// instance), so `setup` fires twice in the same process. Without memoization
// that starts FOUR Vite dev servers where two suffice, and the two redundant
// servers force-optimizing heavy dep graphs on the 2-core CI runner starve the
// iframe @quilted/threads handshake past its timeout. These tests lock in the
// shared-server-pair + ref-counted-teardown behavior that prevents that.

const { createCrossVersionServer } = vi.hoisted(() => ({
  createCrossVersionServer: vi.fn(),
}));

vi.mock("./createServer", () => ({ createCrossVersionServer }));

// `current` short-circuits resolveCrossVersionServerPackage before it reads the
// (absent in unit runs) cross-version manifest.
process.env.FLOW_CROSS_VERSION = "current";

interface FakeServer {
  port: number;
  stop: ReturnType<typeof vi.fn>;
}

const callSetup = async (setup: (project: TestProject) => Promise<unknown>) => {
  const provide = vi.fn();
  const teardown = (await setup({
    provide,
  } as unknown as TestProject)) as () => Promise<void>;
  return { provide, teardown };
};

describe("cross-version globalSetup", () => {
  let stops: ReturnType<typeof vi.fn>[];

  beforeEach(async () => {
    vi.resetModules();
    stops = [];
    let nextPort = 5173;
    createCrossVersionServer.mockReset();
    createCrossVersionServer.mockImplementation(
      async (): Promise<FakeServer> => {
        const stop = vi.fn(() => Promise.resolve());
        stops.push(stop);
        return { port: nextPort++, stop };
      },
    );
  });

  it("starts only one server pair when setup runs once per project", async () => {
    const { setup } = await import("./setupGlobal");

    const first = await callSetup(setup);
    const second = await callSetup(setup);

    // One pair (reference + candidate) shared across both project setups — NOT
    // one pair per setup call.
    expect(createCrossVersionServer).toHaveBeenCalledTimes(2);
    // Both projects are handed the very same ports.
    expect(second.provide.mock.calls).toEqual(first.provide.mock.calls);
  });

  it("stops the servers only after the last project tears down", async () => {
    const { setup } = await import("./setupGlobal");

    const first = await callSetup(setup);
    const second = await callSetup(setup);

    await first.teardown();
    // Other project still using the servers — must stay up.
    expect(stops.every((stop) => stop.mock.calls.length === 0)).toBe(true);

    await second.teardown();
    // Last teardown stops each server exactly once.
    expect(stops.map((stop) => stop.mock.calls.length)).toEqual([1, 1]);
  });

  it("re-creates servers for a fresh run after teardown", async () => {
    const { setup } = await import("./setupGlobal");

    const first = await callSetup(setup);
    const second = await callSetup(setup);
    await first.teardown();
    await second.teardown();

    // A later run (e.g. a per-version retry) must not reuse the stopped pair.
    await callSetup(setup);
    expect(createCrossVersionServer).toHaveBeenCalledTimes(4);
  });
});
