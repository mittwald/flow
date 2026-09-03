import type { SettingsStore } from "@/components/SettingsProvider/models/SettingsStore";
import type { ListSettingsStorageShape } from "./types";
import type List from "./List";
import z from "zod";

export interface ListSettingsStoreOperationOptions {
  autosave?: boolean;
  manualSave?: boolean;
}

const supportedSettings = {
  activeFilters: {
    supports: {
      autosave: true,
      manualSave: true,
    },
    schema: z.record(z.string().or(z.symbol()), z.array(z.string())).optional(),
  },
  viewMode: {
    supports: {
      autosave: true,
      manualSave: false,
    },
    schema: z.enum(["list", "table", "tiles"]).optional(),
  },
  sorting: {
    supports: {
      autosave: true,
      manualSave: false,
    },
    schema: z
      .object({
        direction: z.enum(["asc", "desc"]),
        property: z.string().or(z.number()),
      })
      .optional(),
  },
  search: {
    supports: {
      autosave: true,
      manualSave: false,
    },
    schema: z
      .object({
        value: z.string().optional(),
      })
      .optional(),
  },
} as const;

type SupportedSettings = keyof typeof supportedSettings;

type SchemaOf<T extends SupportedSettings> =
  (typeof supportedSettings)[T]["schema"];

export class ListSettingsStore<T> {
  public readonly list: List<T>;
  public readonly storageKey: string;
  private readonly settingsStore: SettingsStore;

  public constructor(
    list: List<T>,
    store: SettingsStore,
    shape: ListSettingsStorageShape,
  ) {
    this.list = list;
    this.settingsStore = store;
    this.storageKey = shape.storageKey;
  }

  private getStorageKey(key: string, autosave = false) {
    const autosaveSuffix = autosave ? ".autosave" : "";
    return `${this.storageKey}.${key}${autosaveSuffix}`;
  }

  public store<T extends SupportedSettings>(
    key: T,
    value: z.infer<(typeof supportedSettings)[T]["schema"]>,
    options: ListSettingsStoreOperationOptions,
  ) {
    const settings = supportedSettings[key];

    if (settings.supports.manualSave && options.manualSave) {
      this.settingsStore.set(
        "List",
        this.getStorageKey(key, false),
        settings.schema,
        value as never,
      );
    }
    if (settings.supports.autosave && options.autosave) {
      this.settingsStore.set(
        "List",
        this.getStorageKey(key, true),
        settings.schema,
        value as never,
      );
    }
  }

  public get<T extends SupportedSettings>(
    key: T,
    options: ListSettingsStoreOperationOptions,
  ): z.infer<SchemaOf<T>> | undefined {
    const settings = supportedSettings[key];
    const { autosave, manualSave = !autosave } = options; // to ensure settings is used and avoid unused variable error

    const getAutosavedValue = () =>
      this.settingsStore.get(
        "List",
        this.getStorageKey(key, options.autosave),
        settings.schema,
      ) as z.infer<SchemaOf<T>> | undefined;

    const getManuallySavedValue = () =>
      this.settingsStore.get(
        "List",
        this.getStorageKey(key, false),
        settings.schema,
      ) as z.infer<SchemaOf<T>> | undefined;

    return (
      (settings.supports.autosave && autosave
        ? getAutosavedValue()
        : undefined) ??
      (settings.supports.manualSave && manualSave
        ? getManuallySavedValue()
        : undefined)
    );
  }
}
