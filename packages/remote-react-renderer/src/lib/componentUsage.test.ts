import { describe, expect, test } from "vitest";
import { toComponentUsageEvent } from "@/lib/componentUsage";

const noStatus = () => undefined;

describe("toComponentUsageEvent", () => {
  test("carries component and origin through", () => {
    expect(
      toComponentUsageEvent(
        {
          event: "ComponentRendered",
          data: { component: "Button", isInternalComposition: false },
        },
        noStatus,
      ),
    ).toEqual({
      component: "Button",
      isInternalComposition: false,
      status: undefined,
    });
  });

  test("keeps the internal-composition flag", () => {
    expect(
      toComponentUsageEvent(
        {
          event: "ComponentRendered",
          data: { component: "OverlayContent", isInternalComposition: true },
        },
        noStatus,
      ).isInternalComposition,
    ).toBe(true);
  });

  test("attaches the resolved lifecycle status", () => {
    expect(
      toComponentUsageEvent(
        {
          event: "ComponentRendered",
          data: { component: "Accordion", isInternalComposition: false },
        },
        (component) =>
          component === "Accordion"
            ? { level: "beta", isNew: false }
            : undefined,
      ).status,
    ).toEqual({ level: "beta", isNew: false });
  });

  test("leaves the status undefined for untracked components", () => {
    expect(
      toComponentUsageEvent(
        {
          event: "ComponentRendered",
          data: { component: "TableCell", isInternalComposition: false },
        },
        noStatus,
      ).status,
    ).toBeUndefined();
  });
});
