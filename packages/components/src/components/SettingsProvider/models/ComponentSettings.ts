import { makeAutoObservable, ObservableMap } from "mobx";
import type { ZodSchema } from "zod";
import type z from "zod";
import { mobxMapToObject } from "@/lib/mobx/mobxMapToObject";

export class ComponentSettings {
  public readonly settings: ObservableMap<string, unknown>;

  public constructor(settings = new ObservableMap<string, unknown>()) {
    this.settings = settings;
    makeAutoObservable(this);
  }

  public set<T extends ZodSchema>(
    settingKey: string,
    schema: T,
    value: z.infer<T>,
  ) {
    this.settings.set(settingKey, schema.parse(value));
  }

  public get<T extends ZodSchema>(settingKey: string, schema: T): z.infer<T> {
    return schema.parse(this.settings.get(settingKey));
  }

  public clear(settingKey: string) {
    this.settings.delete(settingKey);
  }

  public get asJson() {
    return mobxMapToObject(this.settings);
  }

  public static fromJson(json: ComponentSettingsJson) {
    return new ComponentSettings(new ObservableMap<string, unknown>(json));
  }
}

export type ComponentSettingsJson = ComponentSettings["asJson"];
