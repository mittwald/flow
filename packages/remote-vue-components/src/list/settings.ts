import {
  injectSettingsBackend,
  type SettingsBackend,
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
 * The list's view settings, persisted.
 *
 * `ListSettingsPort` is what the shared model asks through, and this is a Vue
 * app's answer: the `SettingsProvider`'s backend, under the same key layout
 * React uses (`<storageKey>.<setting>` plus a `.autosave` sibling), so the two
 * bindings read each other's values.
 *
 * Unvalidated, unlike React's, which parses every value with a zod schema. A
 * value that is not what it should be is dropped by the model anyway — an
 * unknown filter value is deleted, an unknown sorting simply never matches —
 * and a malformed JSON string is caught here.
 */
export const createListSettings = (
  backend: SettingsBackend,
  storageKey: string,
): ListSettingsPort => {
  const keyOf = (key: string, autosave: boolean): string =>
    `${storageKey}.${key}${autosave ? ".autosave" : ""}`;

  const read = (key: string, autosave: boolean): unknown => {
    const stored = backend.get(keyOf(key, autosave));

    if (stored === null) {
      return undefined;
    }

    try {
      return JSON.parse(stored);
    } catch {
      return undefined;
    }
  };

  const get = (key: SettingKey, options: ListSettingsOperationOptions) => {
    const { autosave, manualSave = !autosave } = options;

    return (
      (supports[key].autosave && autosave ? read(key, true) : undefined) ??
      (supports[key].manualSave && manualSave ? read(key, false) : undefined)
    );
  };

  const store = (
    key: SettingKey,
    value: unknown,
    options: ListSettingsOperationOptions,
  ) => {
    if (supports[key].manualSave && options.manualSave) {
      backend.set(keyOf(key, false), JSON.stringify(value));
    }
    if (supports[key].autosave && options.autosave) {
      backend.set(keyOf(key, true), JSON.stringify(value));
    }
  };

  return { get, store } as ListSettingsPort;
};

/** The persistence for a list, from the surrounding `SettingsProvider`. */
export const useListSettings = (
  storageKey: string | undefined,
): ListSettingsPort | undefined => {
  const { backend, prefix } = injectSettingsBackend();

  return storageKey
    ? createListSettings(backend, `${prefix}.List.${storageKey}`)
    : undefined;
};
