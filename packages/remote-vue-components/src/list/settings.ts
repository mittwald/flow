import {
  injectSettings,
  type SettingsStore,
} from "@/components/SettingsProvider";
import type {
  ListSettingsOperationOptions,
  ListSettingsPort,
} from "@mittwald/flow-components-base";

/**
 * Which keys survive how.
 *
 * The same matrix Flow's React `ListSettingsStore` holds: only the filters have
 * a "store these" button, so only they are written to a second, manual slot.
 */
const supports = {
  activeFilters: { autosave: true, manualSave: true },
  viewMode: { autosave: true, manualSave: false },
  sorting: { autosave: true, manualSave: false },
  search: { autosave: true, manualSave: false },
} as const;

type SettingKey = keyof typeof supports;

/**
 * The list's view settings, persisted — `ListSettingsStore` in
 * packages/components, key for key: the `SettingsProvider`'s store, component
 * `"List"`, key `<storageKey>.<setting>` plus a `.autosave` sibling.
 *
 * Unvalidated, unlike React's, which parses every value with a zod schema. A
 * value that is not what it should be is dropped by the model anyway — an
 * unknown filter value is deleted, an unknown sorting simply never matches.
 */
export const createListSettings = (
  store: SettingsStore,
  storageKey: string,
): ListSettingsPort => {
  const keyOf = (key: string, autosave = false): string =>
    `${storageKey}.${key}${autosave ? ".autosave" : ""}`;

  const get = (key: SettingKey, options: ListSettingsOperationOptions) => {
    const { autosave, manualSave = !autosave } = options;

    return (
      (supports[key].autosave && autosave
        ? store.get("List", keyOf(key, options.autosave))
        : undefined) ??
      (supports[key].manualSave && manualSave
        ? store.get("List", keyOf(key, false))
        : undefined)
    );
  };

  const set = (
    key: SettingKey,
    value: unknown,
    options: ListSettingsOperationOptions,
  ) => {
    if (supports[key].manualSave && options.manualSave) {
      store.set("List", keyOf(key, false), value);
    }
    if (supports[key].autosave && options.autosave) {
      store.set("List", keyOf(key, true), value);
    }
  };

  return { get, store: set } as ListSettingsPort;
};

/**
 * The persistence for a list: the surrounding `SettingsProvider`'s, or none —
 * like React, a list without a provider keeps nothing.
 */
export const useListSettings = (
  storageKey: string | undefined,
): ListSettingsPort | undefined => {
  const store = injectSettings();

  return storageKey && store
    ? createListSettings(store, storageKey)
    : undefined;
};
