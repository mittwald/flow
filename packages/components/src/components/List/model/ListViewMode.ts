import { useState } from "react";
import type { ListViewMode as RawListViewMode } from "./types";
import type { List } from "./List";

interface Options {
  defaultViewMode?: RawListViewMode;
  autosave?: boolean;
}

export class ListViewMode<T = unknown> {
  public readonly list: List<T>;
  public readonly autosave: boolean;
  private readonly state: [
    RawListViewMode,
    React.Dispatch<React.SetStateAction<RawListViewMode>>,
  ];

  public constructor(list: List<T>, options: Options = {}) {
    const {
      defaultViewMode,
      autosave = list.settingsStorageDefaults?.viewMode?.autosave ?? true,
    } = options;

    this.list = list;
    this.autosave = autosave;
    this.state = useState(
      this.list.settingsStorage?.get("viewMode", { autosave: this.autosave }) ??
        defaultViewMode ??
        "list",
    );
  }

  public get value() {
    return this.state[0];
  }

  public get isTiles() {
    return this.value === "tiles";
  }

  public get isTable() {
    return this.value === "table";
  }

  public get isList() {
    return this.value === "list";
  }

  public set(viewMode: RawListViewMode): void {
    this.state[1](viewMode);
    this.list.settingsStorage?.store("viewMode", viewMode, {
      autosave: this.autosave,
    });
  }
}
