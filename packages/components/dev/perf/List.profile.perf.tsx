import { test } from "vitest";
import { measure, mount, nextFrame, unmount, waitFor } from "./harness";
import {
  clickRerender,
  Fixture,
  generateDomains,
  list,
  rows,
  search,
  sorting,
  type FixtureProps,
} from "./listFixture";

/*
 * CPU profiles (one unrecorded run each) of the scenarios that stood out,
 * written to results/profiles/*.cpuprofile. Open them in Chrome DevTools or
 * summarize them with analyzeProfile.mjs. Chromium only.
 */

const setup = async (props: FixtureProps, expectedRows: number) => {
  await unmount();
  globalThis.__list = undefined;
  mount(<Fixture {...props} />);
  await waitFor(() => rows() >= expectedRows);
  await nextFrame();
  await nextFrame();
};

const n = 200;
const data = generateDomains(n);

test("profiles", async () => {
  await unmount();
  await measure(() => mount(<Fixture data={data} batchSize={n} />), {
    profile: "mount-200-rich",
  });
  await waitFor(() => rows() >= n);

  await measure(() => search().setValue("a"), {
    profile: "search-broad-200",
  });
  await measure(() => search().setValue(undefined));
  await measure(() => sorting(1).enable(), { profile: "sort-200" });
  await measure(() => sorting(0).enable());
  await measure(() => clickRerender(), { profile: "rerender-inline-200" });
  await measure(() => list().viewMode.set("tiles"), {
    profile: "tiles-200",
  });
  await measure(() => list().viewMode.set("list"));

  await setup({ data, batchSize: n, renderFn: "hoisted" }, n);
  await measure(() => clickRerender(), { profile: "rerender-stable-200" });

  const data500 = generateDomains(500);
  await setup({ data: data500 }, 20);
  while (rows() < 480) {
    await measure(() => list().batches.nextBatch());
  }
  await measure(() => list().batches.nextBatch(), {
    profile: "loadmore-last-500",
  });

  await setup({ data, batchSize: n, table: true, defaultViewMode: "table" }, n);
  await measure(() => sorting(1).enable(), {
    profile: "table-sort-200",
  });
  await unmount();
});
