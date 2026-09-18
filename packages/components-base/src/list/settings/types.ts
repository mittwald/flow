export interface ListSettingsOperationOptions {
  autosave?: boolean;
  manualSave?: boolean;
}

export interface ListSortingSetting {
  property: string | number;
  direction: "asc" | "desc";
}

export interface ListSearchSetting {
  value?: string;
}

/** Which values of each filter are on, keyed by the filter's storage key. */
export type ListActiveFiltersSetting = Partial<Record<string, string[]>>;

export type ListSettingKey = "sorting" | "search" | "activeFilters";

/**
 * The part of the list's persistence the shared model touches.
 *
 * A port, not the store: persisting is `SettingsProvider` in React — async
 * resources, hierarchical MobX stores, Suspense-aware writes — and none of that
 * belongs here. `ListSettingsStore` satisfies this shape as it stands.
 *
 * Spelled out per key rather than as one generic method over a value map: a
 * generic whose return type indexes that map resolves to the _intersection_ of
 * every value when TypeScript checks a real store against it, and nothing can
 * satisfy `ListSortingSetting & ListSearchSetting`.
 */
export interface ListSettingsPort {
  get(
    key: "activeFilters",
    options: ListSettingsOperationOptions,
  ): ListActiveFiltersSetting | undefined;
  get(
    key: "sorting",
    options: ListSettingsOperationOptions,
  ): ListSortingSetting | undefined;
  get(
    key: "search",
    options: ListSettingsOperationOptions,
  ): ListSearchSetting | undefined;

  store(
    key: "activeFilters",
    value: ListActiveFiltersSetting | undefined,
    options: ListSettingsOperationOptions,
  ): void;
  store(
    key: "sorting",
    value: ListSortingSetting | undefined,
    options: ListSettingsOperationOptions,
  ): void;
  store(
    key: "search",
    value: ListSearchSetting | undefined,
    options: ListSettingsOperationOptions,
  ): void;
}

export interface ListSettingsDefaults {
  filters?: {
    autosave?: boolean;
    manualSave?: boolean;
  };
  sorting?: {
    autosave?: boolean;
  };
  viewMode?: {
    autosave?: boolean;
  };
  search?: {
    autosave?: boolean;
  };
}
