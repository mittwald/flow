import { expect, test } from "vitest";
import {
  buildStatusRegistry,
  isComponentDisplayName,
} from "./buildStatusRegistry";

test("lists every component keyed by displayName, sorted", () => {
  const registry = buildStatusRegistry(
    [
      { displayName: "Button", tags: {} },
      { displayName: "Chat", tags: { flowStatus: "beta, new" } },
      { displayName: "Alert", tags: { deprecated: "gone" } },
    ],
    new Set(["Alert", "Button", "Chat"]),
  );

  expect(Object.keys(registry)).toEqual(["Alert", "Button", "Chat"]);
  expect(registry.Button).toEqual({ level: "stable", isNew: false });
  expect(registry.Chat).toEqual({ level: "beta", isNew: true });
  expect(registry.Alert).toEqual({ level: "deprecated", isNew: false });
});

test("skips entries without a displayName", () => {
  const registry = buildStatusRegistry(
    [
      { displayName: "", tags: {} },
      { displayName: "Button", tags: {} },
    ],
    new Set(["Button"]),
  );

  expect(Object.keys(registry)).toEqual(["Button"]);
});

test("last entry wins on duplicate displayName (deterministic)", () => {
  const registry = buildStatusRegistry(
    [
      { displayName: "Dup", tags: {} },
      { displayName: "Dup", tags: { flowStatus: "beta" } },
    ],
    new Set(["Dup"]),
  );

  expect(registry.Dup).toEqual({ level: "beta", isNew: false });
});

test("drops non-component exports (hooks, helpers, fixtures, qualified names)", () => {
  const registry = buildStatusRegistry(
    [
      { displayName: "Button", tags: {} },
      { displayName: "useGridItemProps", tags: {} },
      { displayName: "getActionGroupSlot", tags: {} },
      { displayName: "asyncFunction", tags: {} },
      { displayName: "validator", tags: {} },
      { displayName: "ActionModel.getCloseOverlayOptions", tags: {} },
      { displayName: "YAxis", tags: {} }, // real PascalCase component, kept
    ],
    new Set(["Button", "YAxis"]),
  );

  expect(Object.keys(registry)).toEqual(["Button", "YAxis"]);
});

test("drops PascalCase components that are not on the public surface", () => {
  const registry = buildStatusRegistry(
    [
      { displayName: "Button", tags: {} }, // public
      { displayName: "AccordionButton", tags: {} }, // internal sub-component
      { displayName: "CartesianGrid", tags: { deprecated: "gone" } }, // internal
    ],
    new Set(["Button"]),
  );

  expect(Object.keys(registry)).toEqual(["Button"]);
});

test("drops integration-sourced entries colliding with a public component name", () => {
  const registry = buildStatusRegistry(
    [
      {
        displayName: "Link",
        tags: { "flr-generate": "all" },
        filePath: "/abs/packages/components/src/components/Link/Link.tsx",
      },
      {
        displayName: "Link",
        tags: { deprecated: "Use RouterProvider instead" },
        filePath:
          "/abs/packages/components/src/integrations/nextjs/components/Link/Link.tsx",
      },
    ],
    new Set(["Link"]),
  );

  // The public component wins; the deprecated Next.js integration Link is dropped.
  expect(registry.Link).toEqual({ level: "stable", isNew: false });
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
