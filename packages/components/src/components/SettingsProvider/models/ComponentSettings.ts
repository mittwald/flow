import { makeAutoObservable, ObservableMap, toJS } from "mobx";
import type { ZodSchema } from "zod";
import type z from "zod";
import { mobxMapToObject } from "@/lib/mobx/mobxMapToObject";
import { mapValues } from "remeda";

export type ComponentSettingsJson = Record<string, string>;

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
    this.settings.set(settingKey, schema.parse(toJS(value)));
  }

  public get<T extends ZodSchema>(settingKey: string, schema: T): z.infer<T> {
    return schema.parse(toJS(this.settings.get(settingKey)));
  }

  public clear(settingKey: string) {
    this.settings.delete(settingKey);
  }

  public get asJson(): ComponentSettingsJson {
    return mapValues(mobxMapToObject(this.settings), (v) => JSON.stringify(v));
  }

  public static fromJson(json: ComponentSettingsJson) {
    return new ComponentSettings(
      new ObservableMap<string, unknown>(
        mapValues(json, (v) => (typeof v === "string" ? JSON.parse(v) : v)),
      ),
    );
  }
}
