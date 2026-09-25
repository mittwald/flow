import { action, makeObservable, observable } from "mobx";
import type { ListViewModeOptions, ListViewModeValue } from "./types";

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
  private storage: Pick<ListViewModeOptions, "autosave" | "settings">;

  public constructor(options: ListViewModeOptions = {}) {
    const { defaultValue, ...storage } = options;

    this.storage = storage;
    this.value =
      this.storage.settings?.get("viewMode", { autosave: this.autosave }) ??
      defaultValue ??
      "list";

    makeObservable(this, {
      value: observable,
      set: action.bound,
    });
  }

  public get autosave(): boolean {
    return this.storage.autosave ?? true;
  }

  /**
   * Where a change is written, for a binding whose list can change it without a
   * new model — React rebuilds the list every render, the view mode lives on.
   * The value itself is read only once, at construction.
   */
  public updateStorage(
    storage: Pick<ListViewModeOptions, "autosave" | "settings">,
  ): void {
    this.storage = storage;
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
    this.storage.settings?.store("viewMode", viewMode, {
      autosave: this.autosave,
    });
  }
}
