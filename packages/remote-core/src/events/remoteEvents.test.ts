import { describe, expect, test } from "vitest";
import { parseReportedEvent } from "@/events/remoteEvents";

describe("parseReportedEvent", () => {
  test("parses a ComponentRendered event", () => {
    expect(
      parseReportedEvent({
        event: "ComponentRendered",
        data: { component: "Button", isInternalComposition: false },
      }),
    ).toEqual({
      event: "ComponentRendered",
      data: { component: "Button", isInternalComposition: false },
    });
  });

  test("ignores an event type this host does not know", () => {
    expect(
      parseReportedEvent({
        event: "SomethingFromANewerFlow",
        data: { whatever: true },
      }),
    ).toBeUndefined();
  });

  test("ignores a known event with an invalid payload", () => {
    expect(
      parseReportedEvent({
        event: "ComponentRendered",
        data: { component: "Button" },
      }),
    ).toBeUndefined();
  });

  test("ignores garbage", () => {
    expect(parseReportedEvent(undefined)).toBeUndefined();
    expect(parseReportedEvent("ComponentRendered")).toBeUndefined();
    expect(parseReportedEvent({})).toBeUndefined();
  });

  test("keeps unknown extra fields out of the parsed payload", () => {
    expect(
      parseReportedEvent({
        event: "ComponentRendered",
        data: {
          component: "Button",
          isInternalComposition: false,
          fieldFromANewerFlow: "ignored",
        },
      }),
    ).toEqual({
      event: "ComponentRendered",
      data: { component: "Button", isInternalComposition: false },
    });
  });
});
