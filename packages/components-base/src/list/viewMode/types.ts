import type { ListSettingsPort } from "../settings/types";

/** How the list lays its items out. */
export type ListViewModeValue = "table" | "list" | "tiles";

export interface ListViewModeOptions {
  /** The mode to start in. A persisted mode takes precedence. */
  defaultValue?: ListViewModeValue;
  /** @default true */
  autosave?: boolean;
  settings?: ListSettingsPort;
}
