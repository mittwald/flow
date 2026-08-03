import type { ComponentUsageEvent } from "@mittwald/flow-remote-react-renderer";
import { expect, test } from "vitest";
import { renderRemoteTest } from "./renderRemoteTest";

const collect = async (scenario: string) => {
  const events: ComponentUsageEvent[] = [];
  await renderRemoteTest(scenario, {
    rendererProps: { onComponentUsage: (event) => events.push(event) },
  });
  await expect.poll(() => events.length, { timeout: 8000 }).toBeGreaterThan(0);
  return events;
};

const directUsage = (events: ComponentUsageEvent[]) =>
  events
    .filter((event) => !event.isInternalComposition)
    .map((event) => event.component);

const internalUsage = (events: ComponentUsageEvent[]) =>
  events
    .filter((event) => event.isInternalComposition)
    .map((event) => event.component);

test("reports components that never reach the host as an element", async () => {
  const events = await collect("modal");

  await expect
    .poll(() => directUsage(events), { timeout: 8000 })
    .toContain("Modal");
});

test("reports what the extension rendered", async () => {
  const events = await collect("modal");

  await expect
    .poll(() => directUsage(events).toSorted(), { timeout: 8000 })
    .toEqual(
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

test("attributes nothing the extension rendered to Flow", async () => {
  const events = await collect("modal");

  await expect
    .poll(() => internalUsage(events), { timeout: 8000 })
    .not.toContain("Modal");
  expect(internalUsage(events)).not.toContain("Button");
});

test("marks components Flow composes internally", async () => {
  const events = await collect("internalComposition");

  await expect
    .poll(() => internalUsage(events), { timeout: 8000 })
    .toContain("Option");
  expect(directUsage(events)).toContain("Select");
  expect(directUsage(events)).not.toContain("Option");
});

test("reports each component once per remote session", async () => {
  const events = await collect("internalComposition");

  await expect
    .poll(
      () => internalUsage(events).filter((component) => component === "Option"),
      { timeout: 8000 },
    )
    .toHaveLength(1);
});

test("resolves the lifecycle status of reported components", async () => {
  const events = await collect("modal");

  await expect
    .poll(() => events.find((event) => event.component === "Button")?.status, {
      timeout: 8000,
    })
    .toEqual({ level: "stable", isNew: false });
});
