import { getContext, setContext } from "svelte";

export interface SettingsBackend {
  get: (key: string) => string | null;
  set: (key: string, value: string) => void;
}

/**
 * Survives a reload, is per browser, and throws in none of the places browsers
 * refuse it (private mode, blocked site data).
 */
export const localStorageBackend: SettingsBackend = {
  get: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore: storage unavailable
    }
  },
};

export interface SettingsStore {
  backend: SettingsBackend;
  prefix: string;
}

const settingsKey = Symbol.for("flow.remote.svelte.settings");

export const setSettingsStore = (store: SettingsStore): void => {
  setContext(settingsKey, store);
};

/** A persisted value. Assigning `current` writes through to the backend. */
export interface Setting<T> {
  current: T;
}

/**
 * The storage half of `useSetting`, without the context — so it can be tested
 * and reused outside a component.
 *
 * Vue's counterpart persists through a deep watcher. Here the write sits in the
 * setter: a rune tracks assignment, not mutation, so persisting on assignment
 * is both the honest contract and the one that cannot miss a change.
 */
export const createSetting = <T>(
  backend: SettingsBackend,
  key: string,
  defaultValue: T,
): Setting<T> => {
  const stored = backend.get(key);

  let initial = defaultValue;
  if (stored !== null) {
    try {
      initial = JSON.parse(stored) as T;
    } catch {
      // A value written by an older version, or by something else entirely.
      initial = defaultValue;
    }
  }

  let value = $state(initial);

  return {
    get current() {
      return value;
    },
    set current(next: T) {
      value = next;
      backend.set(key, JSON.stringify(next));
    },
  };
};

export const useSetting = <T>(name: string, defaultValue: T): Setting<T> => {
  const store = getContext<SettingsStore | undefined>(settingsKey);

  return createSetting(
    store?.backend ?? localStorageBackend,
    `${store?.prefix ?? "flow"}.${name}`,
    defaultValue,
  );
};
