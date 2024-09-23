import type { SettingsBackend } from "@/components/SettingsProvider/backends/types";
import type { SettingsJson } from "@/components/SettingsProvider/models/SettingsStore";

export class LocalStorageSettingsBackend implements SettingsBackend {
  private readonly storageKey: string;

  public constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  public async load(): Promise<SettingsJson> {
    const jsonString = localStorage.getItem(this.storageKey);
    if (jsonString === null) {
      return {};
    }
    return JSON.parse(jsonString);
  }

  public async store(settings: SettingsJson): Promise<void> {
    localStorage.setItem(this.storageKey, JSON.stringify(settings));
  }
}
