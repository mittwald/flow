import { SettingsStore } from "@/components/SettingsProvider";
import { createListSettings } from "@/list/settings";
import { describe, expect, test, vi } from "vitest";

/*
 * Copied from packages/components' `List.browser.test.tsx`, which feeds React's
 * `SettingsProvider` this shape: per component, per key, the value as a JSON
 * string.
 */
const writtenByReact = {
  List: {
    "crew.sorting.autosave": '{"property":"name","direction":"asc"}',
    "crew.activeFilters": '{"rank":["Corporal"]}',
  },
};

describe("SettingsStore", () => {
  test("reads the shape React's SettingsProvider writes", () => {
    const settings = createListSettings(
      new SettingsStore(writtenByReact),
      "crew",
    );

    expect(settings.get("sorting", { autosave: true })).toEqual({
      property: "name",
      direction: "asc",
    });
    expect(settings.get("activeFilters", { manualSave: true })).toEqual({
      rank: ["Corporal"],
    });
  });

  test("writes that shape back", () => {
    const store = new SettingsStore({});
    const settings = createListSettings(store, "crew");

    settings.store(
      "sorting",
      { property: "name", direction: "asc" },
      { autosave: true },
    );
    settings.store(
      "activeFilters",
      { rank: ["Corporal"] },
      { manualSave: true },
    );

    expect(store.asJson).toEqual(writtenByReact);
  });

  test("tells the provider about every change", () => {
    const onChange = vi.fn();
    const store = new SettingsStore({}, { onChange });

    store.set("List", "crew.viewMode.autosave", "table");

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  /*
   * Stored settings outlive the code that wrote them. A value that does not
   * parse counts as not stored instead of failing the render.
   */
  test("drops a stored value that is not JSON", () => {
    const store = new SettingsStore({ List: { "crew.viewMode": "table" } });

    expect(store.get("List", "crew.viewMode")).toBeUndefined();
  });

  /* React's defaults: read here, then from the parent; write here only. */
  test("falls back to the parent store and writes to its own", () => {
    const parentStore = new SettingsStore({
      List: { "crew.viewMode.autosave": '"tiles"' },
    });
    const store = new SettingsStore({}, { parentStore });

    expect(store.get("List", "crew.viewMode.autosave")).toBe("tiles");

    store.set("List", "crew.viewMode.autosave", "table");

    expect(store.get("List", "crew.viewMode.autosave")).toBe("table");
    expect(parentStore.get("List", "crew.viewMode.autosave")).toBe("tiles");
  });

  test("lets the middleware write to the parent instead", () => {
    const parentStore = new SettingsStore({});
    const store = new SettingsStore(
      {},
      {
        parentStore,
        middleware: {
          set: (_, __, settings, setParent) => {
            setParent(settings);
          },
        },
      },
    );

    store.set("List", "crew.viewMode.autosave", "table");

    expect(store.asJson).toEqual({});
    expect(parentStore.asJson).toEqual({
      List: { "crew.viewMode.autosave": '"table"' },
    });
  });
});
