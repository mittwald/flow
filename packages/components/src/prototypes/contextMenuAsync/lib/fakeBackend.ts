import { sleep } from "@/lib/promises/sleep";
import type { AsyncOptionLoader, AsyncOptionPage } from "./useAsyncOptions";

const words = [
  "alpha",
  "beta",
  "gamma",
  "delta",
  "epsilon",
  "zeta",
  "eta",
  "theta",
];

/** A stable, deterministic option universe. */
export const createOptionUniverse = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `option-${index}`,
    label: `${words[index % words.length]}-${index}`,
  }));

export interface FakeBackendOptions {
  /** How many options exist server-side. @default 5000 */
  total?: number;
  /** Page size. @default 25 */
  pageSize?: number;
  /** Simulated latency in ms. @default 400 */
  latencyMs?: number;
}

/**
 * A loader that filters and pages **server-side**, which is the shape the real
 * thing has: the client never holds the full universe, so it also never filters
 * it. Used by the stories and the browser test.
 */
export const createFakeBackend = (
  options: FakeBackendOptions = {},
): AsyncOptionLoader => {
  const { total = 5000, pageSize = 25, latencyMs = 400 } = options;
  const universe = createOptionUniverse(total);

  return async ({ search, cursor, signal }): Promise<AsyncOptionPage> => {
    if (latencyMs > 0) {
      await sleep(latencyMs);
    }
    if (signal.aborted) {
      throw new Error("aborted");
    }

    const matches = search
      ? universe.filter((option) =>
          option.label.toLowerCase().includes(search.toLowerCase()),
        )
      : universe;

    const offset = cursor ? Number(cursor) : 0;
    const page = matches.slice(offset, offset + pageSize);
    const nextOffset = offset + page.length;

    return {
      options: page,
      cursor: nextOffset < matches.length ? String(nextOffset) : undefined,
    };
  };
};
