import { useState } from "react";
import type { ObservableMap } from "mobx";
import { action, makeObservable, observable } from "mobx";
import type { TunnelChildren } from "@/types";

const defaultId = "default";

export class TunnelState {
  public readonly children = observable.map<
    string,
    ObservableMap<string, TunnelChildren>
  >(
    {},
    {
      deep: false,
    },
  );

  private readonly preparedChildren = new Map<
    string,
    Map<string, TunnelChildren>
  >();

  public constructor() {
    makeObservable(this, {
      deleteChildren: action.bound,
      setChildren: action.bound,
    });
  }

  public static useNew(): TunnelState {
    return useState(new TunnelState())[0];
  }

  public setChildren(
    tunnelId: string = defaultId,
    entryId: string,
    children: TunnelChildren,
  ): void {
    const tunnelEntries =
      this.children.get(tunnelId) ??
      observable.map<string, TunnelChildren>({}, { deep: false });

    tunnelEntries.set(entryId, children);

    this.preparedChildren.get(tunnelId)?.delete(entryId);
    this.children.set(tunnelId, tunnelEntries);
  }

  public prepareChildren(
    tunnelId: string = defaultId,
    entryId: string,
    children: TunnelChildren,
  ): void {
    const tunnelEntries =
      this.preparedChildren.get(tunnelId) ?? new Map<string, TunnelChildren>();

    tunnelEntries.set(entryId, children);

    this.preparedChildren.set(tunnelId, tunnelEntries);
  }

  public deleteChildren(tunnelId: string = defaultId, entryId: string): void {
    this.children.get(tunnelId)?.delete(entryId);
    this.preparedChildren.get(tunnelId)?.delete(entryId);
  }

  public getChildren(
    tunnelId: string = defaultId,
  ): [string, TunnelChildren][] | undefined {
    const tunnelEntries =
      this.children.get(tunnelId)?.entries() ??
      this.preparedChildren.get(tunnelId)?.entries();
    if (tunnelEntries) {
      return Array.from(tunnelEntries);
    }
  }
}
