import { beforeAll, describe, test } from "vitest";
import {
  applyThrottle,
  measure,
  mount,
  nextFrame,
  record,
  unmount,
  waitFor,
  type Measurement,
} from "./harness";
import {
  clickRerender,
  filterValue,
  Fixture,
  generateDomains,
  list,
  rows,
  search,
  sorting,
  type FixtureProps,
} from "./listFixture";

const sizes = (
  (import.meta.env.VITE_PERF_SIZES as string | undefined) ??
  "20,100,200,500,1000"
)
  .split(",")
  .map(Number);
const runs = Number(import.meta.env.VITE_PERF_RUNS ?? 5);

beforeAll(applyThrottle);

const heap = () => {
  (globalThis as unknown as { gc?: () => void }).gc?.();
  return (
    (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory
      ?.usedJSHeapSize ?? 0
  );
};

const setup = async (props: FixtureProps, expectedRows: number) => {
  await unmount();
  globalThis.__list = undefined;
  const heapBefore = heap();
  const m = await measure(() => mount(<Fixture {...props} />));
  await waitFor(() => rows() >= expectedRows);
  await nextFrame();
  const heapMb = Math.round(((heap() - heapBefore) / 1024 / 1024) * 10) / 10;
  return { m, heapMb };
};

const repeat = async (
  n: number,
  fn: (i: number) => Promise<Measurement>,
): Promise<Measurement[]> => {
  const ms: Measurement[] = [];
  for (let i = 0; i < n; i++) {
    ms.push(await fn(i));
  }
  return ms;
};

describe.each(["rich", "simple"] as const)("List (%s items)", (content) => {
  test.each(sizes)("mount, all %i items visible", async (n) => {
    const data = generateDomains(n);
    const ms: Measurement[] = [];
    let heapMb = 0;
    for (let i = 0; i < 3; i++) {
      const r = await setup({ data, batchSize: n, content }, n);
      ms.push(r.m);
      heapMb = r.heapMb;
    }
    await record("mount:all", { content, n, rows: rows(), heapMb }, ms);
    await unmount();
  });

  test.each(sizes.filter((s) => s > 20))(
    "mount with default batch (20) of %i items",
    async (n) => {
      const data = generateDomains(n);
      const ms: Measurement[] = [];
      for (let i = 0; i < 3; i++) {
        ms.push((await setup({ data, content }, 20)).m);
      }
      await record("mount:batch20", { content, n, rows: rows() }, ms);
      await unmount();
    },
  );

  test.each(sizes.filter((s) => s > 20))(
    "load more (batches of 20) up to %i items",
    async (n) => {
      const data = generateDomains(n);
      await setup({ data, content }, 20);
      const steps: { shown: number; m: Measurement }[] = [];
      while (rows() < n) {
        const m = await measure(() => list().batches.nextBatch());
        steps.push({ shown: rows(), m });
      }
      await record(
        "loadMore:firstStep",
        { content, n },
        steps.slice(0, 1).map((s) => s.m),
      );
      await record(
        "loadMore:lastStep",
        { content, n },
        steps.slice(-1).map((s) => s.m),
      );
      await record(
        "loadMore:all",
        { content, n, steps: steps.length },
        steps.map((s) => s.m),
      );
      await unmount();
    },
  );

  describe.each(sizes)("interactions with %i visible items", (n) => {
    const data = generateDomains(n);

    test("search, filter, sort, re-render, view mode", async () => {
      await setup({ data, batchSize: n, content }, n);

      const subdomain = () => filterValue("type", "Subdomain");

      /* Each pair applies and reverts, so every run starts from the same state. */
      const pairs: [string, () => unknown, string, () => unknown][] = [
        [
          "search:narrow",
          () => search().setValue("alpha-"),
          "search:clearNarrow",
          () => search().setValue(undefined),
        ],
        [
          "search:broad",
          () => search().setValue("a"),
          "search:clearBroad",
          () => search().setValue(undefined),
        ],
        [
          "filter:on",
          () => subdomain().toggle(),
          "filter:off",
          () => subdomain().toggle(),
        ],
        [
          "sort:desc",
          () => sorting(1).enable(),
          "sort:asc",
          () => sorting(0).enable(),
        ],
        [
          "viewMode:tiles",
          () => list().viewMode.set("tiles"),
          "viewMode:list",
          () => list().viewMode.set("list"),
        ],
      ];

      for (const [nameA, a, nameB, b] of pairs) {
        const as: Measurement[] = [];
        const bs: Measurement[] = [];
        let rowsA = 0;
        for (let i = 0; i < runs; i++) {
          as.push(await measure(a));
          rowsA = rows();
          bs.push(await measure(b));
        }
        await record(nameA, { content, n, rows: rowsA }, as);
        await record(nameB, { content, n, rows: rows() }, bs);
      }

      const rerenders = await repeat(runs, () => measure(clickRerender));
      await record(
        "rerender:parent(inline fns)",
        { content, n, rows: rows() },
        rerenders,
      );

      await unmount();
    });

    test("re-render with hoisted render function", async () => {
      await setup({ data, batchSize: n, content, renderFn: "hoisted" }, n);
      const ms = await repeat(runs, () => measure(() => clickRerender()));
      await record("rerender:parent(stable fns)", { content, n }, ms);
      await unmount();
    });

    test("scroll through the page", async () => {
      await setup({ data, batchSize: n, content }, n);
      const result = await scrollThrough();
      await record("scroll", { content, n, ...result.extra }, [result.m]);
      await unmount();
    });
  });
});

describe("List table view", () => {
  test.each(sizes)("mount + sort with %i rows", async (n) => {
    const data = generateDomains(n);
    const mounts: Measurement[] = [];
    for (let i = 0; i < 3; i++) {
      mounts.push(
        (
          await setup(
            { data, batchSize: n, table: true, defaultViewMode: "table" },
            n,
          )
        ).m,
      );
    }
    await record("table:mount", { n, rows: rows() }, mounts);
    const sorts = await repeat(runs, (i) =>
      measure(() => sorting(i % 2 === 0 ? 1 : 0).enable()),
    );
    await record("table:sort", { n }, sorts);
    const searches = await repeat(runs, async () => {
      const m = await measure(() => search().setValue("alpha-"));
      await measure(() => search().setValue(undefined));
      return m;
    });
    await record("table:search:narrow", { n }, searches);
    await unmount();
  });
});

describe("List infinite scroll", () => {
  test.each([200, 1000])("scroll down until %i items loaded", async (n) => {
    const data = generateDomains(n);
    await setup({ data, infiniteScroll: true }, 20);
    const result = await scrollThrough({ untilRows: n });
    await record("infiniteScroll", { n, ...result.extra }, [result.m]);
    await unmount();
  });
});

async function scrollThrough(opts: { untilRows?: number } = {}) {
  window.scrollTo(0, 0);
  await nextFrame();
  const frameTimes: number[] = [];
  const longTasks: number[] = [];
  const po = new PerformanceObserver((l) => {
    for (const e of l.getEntries()) longTasks.push(e.duration);
  });
  try {
    po.observe({ type: "longtask" });
  } catch {
    // unsupported
  }
  const t0 = performance.now();
  let last = t0;
  let y = 0;
  const maxTime = 60_000;
  while (performance.now() - t0 < maxTime) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (y >= max) {
      if (!opts.untilRows || rows() >= opts.untilRows) break;
    }
    y = Math.min(y + 120, max);
    window.scrollTo(0, y);
    await new Promise((r) => requestAnimationFrame(r));
    const now = performance.now();
    frameTimes.push(now - last);
    last = now;
  }
  await new Promise((r) => setTimeout(r, 50));
  po.disconnect();
  const sorted = [...frameTimes].sort((a, b) => a - b);
  const p = (q: number) =>
    Math.round((sorted[Math.floor(q * (sorted.length - 1))] ?? 0) * 10) / 10;
  const blocked = longTasks.reduce((a, b) => a + b, 0);
  const m: Measurement = {
    total: performance.now() - t0,
    react: 0,
    commits: 0,
    itemRenders: 0,
    longestTask: Math.max(0, ...longTasks),
    longTasksTotal: blocked,
    domNodes: document.getElementsByTagName("*").length,
  };
  return {
    m,
    extra: {
      frames: frameTimes.length,
      frameP50: p(0.5),
      frameP95: p(0.95),
      frameMax: p(1),
      longTasks: longTasks.length,
      rowsAtEnd: rows(),
    },
  };
}
