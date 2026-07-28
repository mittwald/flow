import { expect, test } from "vitest";
import { buildStatusRegistry } from "./buildStatusRegistry";

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
