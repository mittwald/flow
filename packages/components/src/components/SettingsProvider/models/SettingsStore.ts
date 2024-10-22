import { makeAutoObservable, ObservableMap } from "mobx";
import { ComponentSettings } from "@/components/SettingsProvider/models/ComponentSettings";
import type { FlowComponentName } from "@/components/propTypes";
import { mapValues } from "remeda";
import type { ZodSchema } from "zod";
import type z from "zod";
import { mobxMapToObject } from "@/lib/mobx/mobxMapToObject";

export class SettingsStore {
  public readonly componentSettings: ObservableMap<
    FlowComponentName,
    ComponentSettings
  >;

  public constructor(
    settings = new ObservableMap<FlowComponentName, ComponentSettings>(),
  ) {
    this.componentSettings = settings;
    makeAutoObservable(this);
  }

  public set<T extends ZodSchema>(
    componentName: FlowComponentName,
    settingKey: string,
    schema: T,
    value: z.infer<T>,
  ) {
    const settings =
      this.componentSettings.get(componentName) ?? new ComponentSettings();
    settings.set(settingKey, schema, value);
    this.componentSettings.set(componentName, settings);
  }

  public get<T extends ZodSchema>(
    componentName: FlowComponentName,
    settingKey: string,
    schema: T,
  ): z.infer<T> {
    const settings =
      this.componentSettings.get(componentName) ?? new ComponentSettings();
    return settings.get(settingKey, schema);
  }

  public clear(componentName: FlowComponentName, settingKey: string) {
    this.componentSettings.get(componentName)?.clear(settingKey);
  }

  public get asJson() {
    return mapValues(mobxMapToObject(this.componentSettings), (v) => v.asJson);
  }

  public static fromJson(json: SettingsJson) {
    const settings = mapValues(json, (v) => ComponentSettings.fromJson(v));
    return new SettingsStore(new ObservableMap(settings));
  }
}

export type SettingsJson = SettingsStore["asJson"];
