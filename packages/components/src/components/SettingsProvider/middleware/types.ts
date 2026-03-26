import type { FlowComponentName } from "@/components/propTypes";

type UnknownSettings = unknown;

export type SetSettingsMiddleware = (
  component: FlowComponentName,
  key: string,
  settings: UnknownSettings,
  setParent: (settings: UnknownSettings) => void,
) => UnknownSettings;

export type GetSettingsMiddleware = (
  component: FlowComponentName,
  key: string,
  settings: UnknownSettings,
  getParent: () => UnknownSettings,
) => UnknownSettings;
