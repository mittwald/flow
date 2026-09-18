import {
  defineComponent,
  inject,
  provide,
  ref,
  watch,
  type InjectionKey,
  type PropType,
  type Ref,
} from "vue";

export interface SettingsBackend {
  get: (key: string) => string | null;
  set: (key: string, value: string) => void;
}

/**
 * Survives a reload, is per browser, and throws in none of the places browsers
 * refuse it (private mode, blocked site data).
 */
const localStorageBackend: SettingsBackend = {
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

interface SettingsStore {
  backend: SettingsBackend;
  prefix: string;
}

const settingsKey: InjectionKey<SettingsStore> = Symbol("flowSettings");

/**
 * Remembers a component's settings across reloads.
 *
 * Flow's `SettingsProvider` is a hierarchy of MobX stores with async resources
 * and Suspense-aware writes, built for `List`'s view settings. This rebuild
 * keeps what an extension uses — a named value that persists — and stores it
 * synchronously.
 */
export const SettingsProvider = defineComponent({
  name: "SettingsProvider",

  props: {
    /** Namespaces the stored keys, so two apps do not collide. */
    prefix: { type: String, default: "flow" },
    /** Where settings are stored. Defaults to `localStorage`. */
    backend: {
      type: Object as PropType<SettingsBackend>,
      default: () => localStorageBackend,
    },
  },

  setup(props, { slots }) {
    provide(settingsKey, { backend: props.backend, prefix: props.prefix });
    return () => slots.default?.();
  },
});

/**
 * The backend the surrounding `SettingsProvider` set, and the prefix it
 * namespaces keys with.
 *
 * For code that persists more than one value under a key of its own — the
 * `List`'s view settings — where a `Ref` per setting would be the wrong shape.
 */
export const injectSettingsBackend = (): {
  backend: SettingsBackend;
  prefix: string;
} => {
  const store = inject(settingsKey, undefined);

  return {
    backend: store?.backend ?? localStorageBackend,
    prefix: store?.prefix ?? "flow",
  };
};

/**
 * The storage half of `useSetting`, without the injection — so it can be tested
 * and reused outside a component.
 */
export const createSetting = <T>(
  backend: SettingsBackend,
  key: string,
  defaultValue: T,
): Ref<T> => {
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

  const value = ref(initial) as Ref<T>;
  watch(value, (next) => backend.set(key, JSON.stringify(next)), {
    deep: true,
  });

  return value;
};

/** A persisted value. Writing the ref writes through to the backend. */
export const useSetting = <T>(name: string, defaultValue: T): Ref<T> => {
  const store = inject(settingsKey, undefined);

  return createSetting(
    store?.backend ?? localStorageBackend,
    `${store?.prefix ?? "flow"}.${name}`,
    defaultValue,
  );
};

export default SettingsProvider;
