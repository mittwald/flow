import type { SettingsBackend } from "@/components/SettingsProvider/backends/types";
import type { SettingsJson } from "@/components/SettingsProvider/models/SettingsStore";

const localStorageAvailable = typeof localStorage !== "undefined";

export class LocalStorageSettingsBackend implements SettingsBackend {
  private readonly storageKey: string;

  public constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  public async load(): Promise<SettingsJson> {
    if (!localStorageAvailable) {
      return {};
    }

    const jsonString = localStorage.getItem(this.storageKey);
    if (jsonString === null) {
      return {};
    }
    return JSON.parse(jsonString);
  }

  public async store(settings: SettingsJson): Promise<void> {
    if (localStorageAvailable) {
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
    }
  }
}
