import { autorun } from "mobx";
import { expect, test, vi } from "vitest";
import { ListViewMode } from "./ListViewMode";
import type { ListSettingsPort } from "../settings/types";

const fakeSettings = (stored?: "table" | "list" | "tiles") => {
  const written: { value: unknown; autosave?: boolean }[] = [];

  const settings = {
    get: (() => stored) as ListSettingsPort["get"],
    store: ((_key: string, value: unknown, options: { autosave?: boolean }) => {
      written.push({ value, autosave: options.autosave });
    }) as ListSettingsPort["store"],
  } as ListSettingsPort;

  return { settings, written };
};

test("falls back to the list view", () => {
  expect(new ListViewMode().value).toBe("list");
  expect(new ListViewMode().isList).toBe(true);
});

test("starts in the default mode", () => {
  const viewMode = new ListViewMode({ defaultValue: "tiles" });

  expect(viewMode.isTiles).toBe(true);
  expect(viewMode.isList).toBe(false);
});

test("a stored mode wins over the default", () => {
  const { settings } = fakeSettings("table");
  const viewMode = new ListViewMode({ defaultValue: "tiles", settings });

  expect(viewMode.isTable).toBe(true);
});

test("writes the mode back", () => {
  const { settings, written } = fakeSettings();
  const viewMode = new ListViewMode({ settings });

  viewMode.set("tiles");

  expect(written).toEqual([{ value: "tiles", autosave: true }]);
});

test("autosave off still stores, so a manual save has something to save", () => {
  const { settings, written } = fakeSettings();
  const viewMode = new ListViewMode({ autosave: false, settings });

  viewMode.set("table");

  expect(written).toEqual([{ value: "table", autosave: false }]);
});

test("is observable, which is how a binding learns about the change", () => {
  const viewMode = new ListViewMode();
  const seen = vi.fn();

  const stop = autorun(() => seen(viewMode.value));
  viewMode.set("tiles");
  stop();

  expect(seen.mock.calls).toEqual([["list"], ["tiles"]]);
});

/*
 * React rebuilds its list every render and keeps the view mode: a list whose
 * settings key changed writes under the new one.
 */
test("writes a change to the storage it was last given", () => {
  const first = fakeSettings();
  const second = fakeSettings();
  const viewMode = new ListViewMode({ settings: first.settings });

  viewMode.updateStorage({ settings: second.settings, autosave: false });
  viewMode.set("tiles");

  expect(first.written).toEqual([]);
  expect(second.written).toEqual([{ value: "tiles", autosave: false }]);
});
