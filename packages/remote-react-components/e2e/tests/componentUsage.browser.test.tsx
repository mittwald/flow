import type { ComponentUsageEvent } from "@mittwald/flow-remote-react-renderer";
import { expect, test } from "vitest";
import { renderRemoteTest } from "./renderRemoteTest";

/**
 * Renders the scenario and returns the reported usage once it has settled.
 *
 * Settling matters for the assertions that check something is _absent_: events
 * travel the thread connection asynchronously, so a plain `not.toContain` would
 * also pass while the event is still in flight.
 */
const collect = async (scenario: string) => {
  const events: ComponentUsageEvent[] = [];
  await renderRemoteTest(scenario, {
    rendererProps: { onComponentUsage: (event) => events.push(event) },
  });
  await expect.poll(() => events.length, { timeout: 8000 }).toBeGreaterThan(0);

  let settled = -1;
  while (settled !== events.length) {
    settled = events.length;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  return events;
};

const used = (events: ComponentUsageEvent[]) =>
  events.map((event) => event.component);

test("reports components that never reach the host as an element", async () => {
  const events = await collect("modal");

  expect(used(events)).toContain("Modal");
});

test("reports what the extension rendered", async () => {
  const events = await collect("modal");

  expect(used(events)).toEqual(
    expect.arrayContaining([
      "Button",
      "Content",
      "Heading",
      "Modal",
      "Section",
      "Text",
    ]),
  );
});

test("reports components that are not built by the flowComponent factory", async () => {
  const events = await collect("table");

  expect(used(events)).toEqual(
    expect.arrayContaining([
      "Table",
      "TableBody",
      "TableCell",
      "TableColumn",
      "TableHeader",
      "TableRow",
    ]),
  );
});

test("does not report what Flow composes through a view", async () => {
  const events = await collect("viewComposition");

  // The extension wrote Select and CountryOptions; every Option comes from
  // CountryOptions composing OptionView, so no Option may be reported.
  expect(used(events)).toContain("Select");
  expect(used(events)).not.toContain("Option");
});

test("does not report what Flow composes for an empty list", async () => {
  const events = await collect("list");

  // An empty List still renders a full internal UI — header, search field and
  // the illustrated empty view — all through views. None of it is the
  // extension's usage, and the extension itself rendered nothing but the List.
  expect(used(events)).toEqual(["List"]);
});

test("does not report Flow's own loading fallback", async () => {
  const events = await collect("suspending");

  // Section and Text are the extension's own; the Div only exists because the
  // tree suspended and Flow rendered its fallback.
  expect(used(events).toSorted()).toEqual(["Section", "Text"]);
});

test("reports each component once per remote session", async () => {
  const events = await collect("table");

  expect(
    used(events).filter((component) => component === "TableCell"),
  ).toHaveLength(1);
});

test("resolves the lifecycle status of reported components", async () => {
  const events = await collect("modal");

  expect(events.find((event) => event.component === "Button")?.status).toEqual({
    level: "stable",
    isNew: false,
  });
});
