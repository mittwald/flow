import {
  defineComponent,
  Fragment,
  h,
  inject,
  provide,
  shallowRef,
  watch,
  type InjectionKey,
  type PropType,
  type ShallowRef,
} from "vue";
import { composition } from "@/lib/composition";

/**
 * What a backend loads and stores: per component, per key, the value as a JSON
 * string — `{"List":{"crew.sorting.autosave":"{\"property\":\"name\",…}"}}`.
 * Flow's React `SettingsProvider` writes the same shape, so the two bindings
 * read each other's settings.
 */
export type SettingsJson = Record<string, Record<string, string>>;

export interface SettingsBackend {
  load(): Promise<SettingsJson>;
  store(settings: SettingsJson): Promise<void>;
}

export type GetSettingsMiddleware = (
  component: string,
  key: string,
  settings: unknown,
  getParent: () => unknown,
) => unknown;

export type SetSettingsMiddleware = (
  component: string,
  key: string,
  settings: unknown,
  setParent: (settings: unknown) => void,
) => unknown;

export interface SettingsMiddleware {
  get?: GetSettingsMiddleware;
  set?: SetSettingsMiddleware;
}

/** `LocalStorageSettingsBackend` in packages/components. */
class LocalStorageSettingsBackend implements SettingsBackend {
  public constructor(private readonly storageKey: string) {}

  public async load(): Promise<SettingsJson> {
    if (typeof localStorage === "undefined") {
      return {};
    }
    const json = localStorage.getItem(this.storageKey);
    return json === null ? {} : (JSON.parse(json) as SettingsJson);
  }

  public async store(settings: SettingsJson): Promise<void> {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
    }
  }
}

/** Parses a stored value; one that does not parse counts as not stored. */
const parse = (json: string): unknown => {
  try {
    return JSON.parse(json);
  } catch {
    return undefined;
  }
};

/**
 * The settings of one provider, with its parent's behind it — the Vue
 * counterpart of `SettingsStore` in packages/components, with the same
 * middleware and the same defaults: a value is read here, then from the parent;
 * it is written here only.
 */
export class SettingsStore {
  private readonly settings = new Map<string, Map<string, unknown>>();

  public constructor(
    json: SettingsJson,
    private readonly options: {
      middleware?: SettingsMiddleware;
      parentStore?: SettingsStore;
      onChange?: () => void;
    } = {},
  ) {
    for (const [component, values] of Object.entries(json)) {
      const componentSettings = new Map<string, unknown>();
      for (const [key, value] of Object.entries(values)) {
        const parsed = typeof value === "string" ? parse(value) : value;
        if (parsed !== undefined) {
          componentSettings.set(key, parsed);
        }
      }
      this.settings.set(component, componentSettings);
    }
  }

  public get(component: string, key: string): unknown {
    const current = this.settings.get(component)?.get(key);
    const middleware =
      this.options.middleware?.get ??
      ((_, __, settings, getParent) => settings ?? getParent());

    return middleware(component, key, current, () =>
      this.options.parentStore?.get(component, key),
    );
  }

  public set(component: string, key: string, value: unknown): void {
    const middleware =
      this.options.middleware?.set ?? ((_, __, settings) => settings);

    const processed = middleware(component, key, value, (parentValue) =>
      this.options.parentStore?.set(component, key, parentValue),
    );

    if (processed !== undefined) {
      const componentSettings =
        this.settings.get(component) ?? new Map<string, unknown>();
      componentSettings.set(key, processed);
      this.settings.set(component, componentSettings);
      this.options.onChange?.();
    }
  }

  public clear(component: string, key: string): void {
    if (this.settings.get(component)?.delete(key)) {
      this.options.onChange?.();
    }
    this.options.parentStore?.clear(component, key);
  }

  public get asJson(): SettingsJson {
    return Object.fromEntries(
      [...this.settings].map(([component, values]) => [
        component,
        Object.fromEntries(
          [...values].map(([key, value]) => [key, JSON.stringify(value)]),
        ),
      ]),
    );
  }
}

const settingsKey: InjectionKey<ShallowRef<SettingsStore | undefined>> =
  Symbol("flowSettings");

/**
 * The store of the surrounding `SettingsProvider`, if there is one. Read in
 * `setup()`: a provider renders its children only once a store is loaded, and
 * again from scratch when its `id` changes.
 */
export const injectSettings = (): SettingsStore | undefined =>
  inject(settingsKey, undefined)?.value;

/**
 * Remembers component settings — the `List`'s view settings — in the shape
 * Flow's React `SettingsProvider` does, with the same props:
 * `type="localStorage"` plus a `storageKey`, or `type="custom"` plus a `store`
 * that loads and stores asynchronously.
 *
 * Its children render once the settings are loaded, the way React's suspend.
 * The backend is read per `id`, as in React: change the `id` to switch it.
 */
export const SettingsProvider = defineComponent({
  name: "SettingsProvider",

  props: {
    type: {
      type: String as PropType<"localStorage" | "custom">,
      required: true,
    },
    /** The `localStorage` key, for `type="localStorage"`. */
    storageKey: { type: String, default: undefined },
    /** The backend, for `type="custom"`. */
    store: { type: Object as PropType<SettingsBackend>, default: undefined },
    /** Identifies the settings; a new one loads them again. */
    id: { type: String, default: "static" },
    middleware: {
      type: Object as PropType<SettingsMiddleware>,
      default: undefined,
    },
  },

  setup(props, { slots }) {
    const parentStore = injectSettings();
    const store = shallowRef<SettingsStore>();
    provide(settingsKey, store);

    const backendFor = (): SettingsBackend => {
      if (props.type === "custom" && props.store) {
        return props.store;
      }
      if (props.type === "localStorage" && props.storageKey !== undefined) {
        return new LocalStorageSettingsBackend(props.storageKey);
      }
      throw new Error(
        `Unsupported setting backend: ${props.type} needs ${props.type === "custom" ? "a store" : "a storageKey"}`,
      );
    };

    let generation = 0;

    watch(
      () => props.id,
      async () => {
        const loading = ++generation;
        store.value = undefined;

        const backend = backendFor();
        const json = await backend.load();
        if (loading !== generation) {
          return;
        }

        /* Written in order, one at a time, like React's `storingPromise`. */
        let storing = Promise.resolve();
        const loaded: SettingsStore = new SettingsStore(json, {
          middleware: props.middleware,
          parentStore,
          onChange: () => {
            storing = storing.then(() => backend.store(loaded.asJson));
          },
        });
        store.value = loaded;
      },
      { immediate: true },
    );

    return () =>
      store.value
        ? h(Fragment, { key: props.id }, slots.default?.())
        : undefined;
  },
});

composition(SettingsProvider);

export default SettingsProvider;
