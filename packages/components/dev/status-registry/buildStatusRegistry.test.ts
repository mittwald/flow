import { expect, test } from "vitest";
import {
  buildStatusRegistry,
  isComponentDisplayName,
} from "./buildStatusRegistry";

test("lists every component keyed by displayName, sorted", () => {
  const registry = buildStatusRegistry([
    { displayName: "Button", tags: {} },
    { displayName: "Chat", tags: { flowStatus: "beta, new" } },
    { displayName: "Alert", tags: { deprecated: "gone" } },
  ]);

  expect(Object.keys(registry)).toEqual(["Alert", "Button", "Chat"]);
  expect(registry.Button).toEqual({ level: "stable", isNew: false });
  expect(registry.Chat).toEqual({ level: "beta", isNew: true });
  expect(registry.Alert).toEqual({ level: "deprecated", isNew: false });
});

test("skips entries without a displayName", () => {
  const registry = buildStatusRegistry([
    { displayName: "", tags: {} },
    { displayName: "Button", tags: {} },
  ]);

  expect(Object.keys(registry)).toEqual(["Button"]);
});

test("last entry wins on duplicate displayName (deterministic)", () => {
  const registry = buildStatusRegistry([
    { displayName: "Dup", tags: {} },
    { displayName: "Dup", tags: { flowStatus: "beta" } },
  ]);

  expect(registry.Dup).toEqual({ level: "beta", isNew: false });
});

test("drops non-component exports (hooks, helpers, fixtures, qualified names)", () => {
  const registry = buildStatusRegistry([
    { displayName: "Button", tags: {} },
    { displayName: "useGridItemProps", tags: {} },
    { displayName: "getActionGroupSlot", tags: {} },
    { displayName: "asyncFunction", tags: {} },
    { displayName: "validator", tags: {} },
    { displayName: "ActionModel.getCloseOverlayOptions", tags: {} },
    { displayName: "YAxis", tags: {} }, // real PascalCase component, kept
  ]);

  expect(Object.keys(registry)).toEqual(["Button", "YAxis"]);
});

test.each([
  ["Button", true],
  ["YAxis", true],
  ["LinkProvider", true],
  ["H1", true],
  ["useContextIcon", false],
  ["getActionGroupSlot", false],
  ["asyncFunction", false],
  ["validator", false],
  ["ActionModel.getCloseOverlayOptions", false],
  ["", false],
] as const)("isComponentDisplayName(%s) === %s", (name, expected) => {
  expect(isComponentDisplayName(name)).toBe(expected);
});
