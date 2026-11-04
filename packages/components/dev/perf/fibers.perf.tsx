import { test } from "vitest";
import { commands } from "vitest/browser";
import { mount, nextFrame, unmount, waitFor } from "./harness";
import { fiberName, walkFibers } from "./fiberTree";
import { Fixture, generateDomains, rows } from "./listFixture";

/* How many React fibers and DOM nodes one list item costs, and of what kind. */
const histogram = () => {
  const h = new Map<string, number>();
  let total = 0;
  walkFibers((f) => {
    total++;
    const n = fiberName(f);
    h.set(n, (h.get(n) ?? 0) + 1);
  });
  return { total, h };
};

const measureContent = async (content: "rich" | "simple" | "plain") => {
  const results: { total: number; h: Map<string, number>; dom: number }[] = [];
  for (const n of [1, 11]) {
    await unmount();
    mount(
      <Fixture data={generateDomains(n)} batchSize={n} content={content} />,
    );
    await waitFor(() => rows() >= n);
    await nextFrame();
    results.push({
      ...histogram(),
      dom: document.getElementsByTagName("*").length,
    });
  }
  const [a, b] = results as [(typeof results)[0], (typeof results)[0]];
  const perItem = new Map<string, number>();
  for (const [k, v] of b.h) {
    const d = (v - (a.h.get(k) ?? 0)) / 10;
    if (d > 0) perItem.set(k, d);
  }
  await commands.recordPerfResult({
    scenario: "fibersPerItem",
    content,
    fibersPerItem: (b.total - a.total) / 10,
    domNodesPerItem: (b.dom - a.dom) / 10,
    fibersListShell: a.total - (b.total - a.total) / 10,
    topComponents: Object.fromEntries(
      [...perItem.entries()].sort((x, y) => y[1] - x[1]).slice(0, 45),
    ),
  });
  await unmount();
};

test("fibers per item", async () => {
  for (const c of ["rich", "simple", "plain"] as const) {
    await measureContent(c);
  }
});
