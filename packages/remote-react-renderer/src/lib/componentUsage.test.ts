import { describe, expect, test } from "vitest";
import { toComponentUsageEvent } from "@/lib/componentUsage";

const noStatus = () => undefined;

describe("toComponentUsageEvent", () => {
  test("carries the component through", () => {
    expect(
      toComponentUsageEvent(
        { event: "ComponentRendered", data: { component: "Button" } },
        noStatus,
      ),
    ).toEqual({ component: "Button", status: undefined });
  });

  test("attaches the resolved lifecycle status", () => {
    expect(
      toComponentUsageEvent(
        { event: "ComponentRendered", data: { component: "Accordion" } },
        (component) =>
          component === "Accordion"
            ? { level: "beta", isNew: false }
            : undefined,
      ).status,
    ).toEqual({ level: "beta", isNew: false });
  });

  test("leaves the status undefined for components outside the registry", () => {
    // Table is a real reported component — it is just not tracked in the
    // status registry, which only covers the curated public surface.
    expect(
      toComponentUsageEvent(
        { event: "ComponentRendered", data: { component: "Table" } },
        noStatus,
      ).status,
    ).toBeUndefined();
  });
});
