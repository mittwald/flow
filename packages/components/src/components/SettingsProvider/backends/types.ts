import type { SettingsJson } from "~/components/SettingsProvider/models/SettingsStore";

export interface SettingsBackend {
  store(settings: SettingsJson): Promise<void>;
  load(): Promise<SettingsJson>;
}

interface LocalStorageSettingsBackend {
  type: "localStorage";
  storageKey: string;
}

interface CustomSettingsBackend {
  type: "custom";
  store: SettingsBackend;
}

export type SupportedSettingsBackend =
  | LocalStorageSettingsBackend
  | CustomSettingsBackend;
