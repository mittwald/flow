import { action, makeObservable, observable } from "mobx";
import type { ListViewModeOptions, ListViewModeValue } from "./types";
import type { ListSettingsPort } from "../settings/types";

/**
 * Which layout the list is in, and its persistence.
 *
 * The value is a MobX observable rather than a binding's own state, so that the
 * rule it obeys — a stored mode wins over the default, and a change is written
 * back — is one implementation. A binding brings the subscription:
 * `useSelector` in React, `watchMobxValue` in Vue.
 */
export class ListViewMode {
  public value: ListViewModeValue;
  public readonly autosave: boolean;
  private readonly settings?: ListSettingsPort;

  public constructor(options: ListViewModeOptions = {}) {
    const { defaultValue, autosave = true, settings } = options;

    this.settings = settings;
    this.autosave = autosave;
    this.value =
      this.settings?.get("viewMode", { autosave: this.autosave }) ??
      defaultValue ??
      "list";

    makeObservable(this, {
      value: observable,
      set: action.bound,
    });
  }

  public get isTiles(): boolean {
    return this.value === "tiles";
  }

  public get isTable(): boolean {
    return this.value === "table";
  }

  public get isList(): boolean {
    return this.value === "list";
  }

  public set(viewMode: ListViewModeValue): void {
    this.value = viewMode;
    this.settings?.store("viewMode", viewMode, { autosave: this.autosave });
  }
}
