import { describe, expect, test, vi } from "vitest";
import {
  createComponentUsageCollector,
  type ComponentUsageEvent,
} from "@/lib/componentUsage";

const noStatus = () => undefined;

describe("createComponentUsageCollector", () => {
  test("reports a component on first use", () => {
    const handler = vi.fn();
    const collector = createComponentUsageCollector(handler, noStatus);

    collector.report("Button");

    expect(handler).toHaveBeenCalledExactlyOnceWith({
      component: "Button",
      status: undefined,
    });
  });

  test("reports a component only once, no matter how often it is used", () => {
    const handler = vi.fn();
    const collector = createComponentUsageCollector(handler, noStatus);

    collector.report("Button");
    collector.report("Button");
    collector.report("Button");

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test("reports every distinct component", () => {
    const events: ComponentUsageEvent[] = [];
    const collector = createComponentUsageCollector(
      (event) => events.push(event),
      noStatus,
    );

    collector.report("Button");
    collector.report("Table");
    collector.report("Button");

    expect(events.map((event) => event.component)).toEqual(["Button", "Table"]);
  });

  test("attaches the resolved lifecycle status", () => {
    const handler = vi.fn();
    const collector = createComponentUsageCollector(handler, (component) =>
      component === "Accordion" ? { level: "beta", isNew: false } : undefined,
    );

    collector.report("Accordion");
    collector.report("TableCell");

    expect(handler).toHaveBeenNthCalledWith(1, {
      component: "Accordion",
      status: { level: "beta", isNew: false },
    });
    expect(handler).toHaveBeenNthCalledWith(2, {
      component: "TableCell",
      status: undefined,
    });
  });

  test("keeps collectors independent of each other", () => {
    const handler = vi.fn();
    const resolve = noStatus;

    createComponentUsageCollector(handler, resolve).report("Button");
    createComponentUsageCollector(handler, resolve).report("Button");

    expect(handler).toHaveBeenCalledTimes(2);
  });
});
