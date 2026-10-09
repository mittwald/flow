import { resolveEventKey } from "@/lib/handlers";
import { describe, expect, test } from "vitest";

const events = new Map(
  ["press", "click", "clickCapture", "openChange"].map((e) => [e, {}]),
);

describe("resolveEventKey", () => {
  test.each([
    ["onPress", "press", []],
    ["onPressOnce", "press", ["once"]],
    ["onPressCapture", "press", ["capture"]],
    ["onPressPassiveOnce", "press", ["once", "passive"]],
    ["onPressOnceCapturePassive", "press", ["capture", "once", "passive"]],
    ["onOpenChangeOnce", "openChange", ["once"]],
    ["onClickCapture", "clickCapture", []],
    ["onClickCaptureOnce", "clickCapture", ["once"]],
    ["onClickOnceCapture", "clickCapture", ["once"]],
  ])("%s → %s %j", (key, event, modifiers) => {
    const resolved = resolveEventKey(key, events);
    expect(resolved?.event).toBe(event);
    expect([...(resolved?.modifiers ?? [])].sort()).toEqual(modifiers);
  });

  test.each(["onHover", "onHoverOnce", "onOnce", "press", "onpress"])(
    "%s names no event",
    (key) => {
      expect(resolveEventKey(key, events)).toBeUndefined();
    },
  );
});
