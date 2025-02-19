import type {
  SettingsBackend,
  SupportedSettingsBackend,
} from "@/components/SettingsProvider/backends/types";
import { LocalStorageSettingsBackend } from "@/components/SettingsProvider/backends/LocalStorageSettingsBackend";

export const settingsBackendFactory = (
  backend: SupportedSettingsBackend,
): SettingsBackend => {
  switch (backend.type) {
    case "custom":
      return backend.store;
    case "localStorage":
      return new LocalStorageSettingsBackend(backend.storageKey);
  }

  throw new Error(`Unsupported setting backend: ${backend}`);
};
