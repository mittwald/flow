import { describe, expect, test } from "vitest";
import { createSetting, type SettingsBackend } from "./settings.svelte.js";

const backendOf = (initial: Record<string, string> = {}) => {
  const stored = new Map(Object.entries(initial));

  const backend: SettingsBackend = {
    get: (key) => stored.get(key) ?? null,
    set: (key, value) => void stored.set(key, value),
  };

  return { backend, stored };
};

describe("createSetting", () => {
  test("starts at the default when nothing is stored", () => {
    const { backend } = backendOf();
    expect(createSetting(backend, "flow.view", "list").current).toBe("list");
  });

  test("reads what was stored before", () => {
    const { backend } = backendOf({ "flow.view": '"grid"' });
    expect(createSetting(backend, "flow.view", "list").current).toBe("grid");
  });

  /*
   * A value written by an older version, or by something else entirely. Falling
   * back beats throwing in a component's initialization.
   */
  test("falls back to the default when the stored value is not JSON", () => {
    const { backend } = backendOf({ "flow.view": "grid" });
    expect(createSetting(backend, "flow.view", "list").current).toBe("list");
  });

  test("writes through on assignment", () => {
    const { backend, stored } = backendOf();
    const setting = createSetting(backend, "flow.view", "list");

    setting.current = "grid";

    expect(setting.current).toBe("grid");
    expect(stored.get("flow.view")).toBe('"grid"');
  });
});
