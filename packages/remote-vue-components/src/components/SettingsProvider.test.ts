import {
  createSetting,
  type SettingsBackend,
} from "@/components/SettingsProvider";
import { describe, expect, test } from "vitest";
import { nextTick } from "vue";

const createBackend = (initial: Record<string, string> = {}) => {
  const values = new Map(Object.entries(initial));

  const backend: SettingsBackend = {
    get: (key) => values.get(key) ?? null,
    set: (key, value) => void values.set(key, value),
  };

  return { backend, values };
};

describe("createSetting", () => {
  test("starts from the default when nothing is stored", () => {
    const { backend } = createBackend();

    expect(createSetting(backend, "flow.view", "list").value).toBe("list");
  });

  test("starts from what was stored", () => {
    const { backend } = createBackend({ "flow.view": '"grid"' });

    expect(createSetting(backend, "flow.view", "list").value).toBe("grid");
  });

  test("writes through on change", async () => {
    const { backend, values } = createBackend();
    const setting = createSetting(backend, "flow.view", "list");

    setting.value = "grid";
    await nextTick();

    expect(values.get("flow.view")).toBe('"grid"');
  });

  /*
   * Stored settings outlive the code that wrote them. A value the current
   * version cannot parse must fall back, not throw on the first render.
   */
  test("falls back when the stored value is not JSON", () => {
    const { backend } = createBackend({ "flow.view": "grid" });

    expect(createSetting(backend, "flow.view", "list").value).toBe("list");
  });
});
