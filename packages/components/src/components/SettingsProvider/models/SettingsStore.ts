import { makeAutoObservable, ObservableMap } from "mobx";
import { ComponentSettings } from "@/components/SettingsProvider/models/ComponentSettings";
import type { FlowComponentName } from "@/components/propTypes";
import { mapValues } from "remeda";
import type { ZodSchema } from "zod";
import type z from "zod";
import { mobxMapToObject } from "@/lib/mobx/mobxMapToObject";
import type {
  GetSettingsMiddleware,
  SetSettingsMiddleware,
} from "../middleware/types";
import {
  defaultGetMiddleware,
  defaultSetMiddleware,
} from "../middleware/defaultImplementations";

export interface SettingsStoreOptions {
  middleware?: {
    get?: GetSettingsMiddleware;
    set?: SetSettingsMiddleware;
  };
  parentStore?: SettingsStore;
}

function subscribeMobxObject(ignored: unknown) {
  // Accessing an object subscribes to it in MobX, so this function is used to subscribe to the parent store's JSON representation without actually using it here.
}

export class SettingsStore {
  public readonly settings: ObservableMap<FlowComponentName, ComponentSettings>;

  public readonly options: Readonly<SettingsStoreOptions>;

  public constructor(
    settings = new ObservableMap<FlowComponentName, ComponentSettings>(),
    options: SettingsStoreOptions = {},
  ) {
    this.settings = settings;
    this.options = Object.freeze(options);
    makeAutoObservable(this, {
      options: false,
    });
  }

  public set<T extends ZodSchema>(
    componentName: FlowComponentName,
    settingKey: string,
    schema: T,
    value: z.infer<T>,
  ) {
    const settings =
      this.settings.get(componentName) ?? new ComponentSettings();

    const middleware = this.options.middleware?.set ?? defaultSetMiddleware;

    const processedValue = middleware(
      componentName,
      settingKey,
      value,
      (thisSettings) => {
        if (this.options.parentStore) {
          this.options.parentStore.set(
            componentName,
            settingKey,
            schema,
            thisSettings as z.infer<T>,
          );
        }
        return thisSettings;
      },
    ) as z.infer<T>;

    if (processedValue !== undefined) {
      settings.set(settingKey, schema, processedValue);
      this.settings.set(componentName, settings);
    }
  }

  public get<T extends ZodSchema>(
    componentName: FlowComponentName,
    settingKey: string,
    schema: T,
  ): z.infer<T> {
    const settings =
      this.settings.get(componentName) ?? new ComponentSettings();

    const thisSettings = settings.get(settingKey, schema);
    const parentSettings = this.options.parentStore?.get(
      componentName,
      settingKey,
      schema,
    );

    const middleware = this.options.middleware?.get ?? defaultGetMiddleware;

    return middleware(
      componentName,
      settingKey,
      thisSettings,
      () => parentSettings,
    ) as z.infer<T>;
  }

  public clear(componentName: FlowComponentName, settingKey: string) {
    this.settings.get(componentName)?.clear(settingKey);
    this.options.parentStore?.clear(componentName, settingKey);
  }

  public get asJson() {
    const settingsObject = mobxMapToObject(this.settings);
    const asJson = mapValues(settingsObject, (v) => v.asJson);
    subscribeMobxObject(this.options.parentStore?.asJson);
    return asJson;
  }

  public static fromJson(json: SettingsJson, options?: SettingsStoreOptions) {
    const settings = mapValues(json, (v) => ComponentSettings.fromJson(v));
    return new SettingsStore(new ObservableMap(settings), options);
  }
}

export type SettingsJson = SettingsStore["asJson"];
