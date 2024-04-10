import type { ReactNode } from "react";
import { useState } from "react";
import type { ObservableMap } from "mobx";
import { action, makeObservable, observable } from "mobx";

const defaultId = "default";

export class TunnelState {
  public readonly children = observable.map<
    string,
    ObservableMap<string, ReactNode>
  >(
    {},
    {
      deep: false,
    },
  );

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
    children: ReactNode,
  ): void {
    const tunnelEntries =
      this.children.get(tunnelId) ??
      observable.map<string, ReactNode>({}, { deep: false });

    tunnelEntries.set(entryId, children);

    this.children.set(tunnelId, tunnelEntries);
  }

  public deleteChildren(tunnelId: string = defaultId, entryId: string): void {
    this.children.get(tunnelId)?.delete(entryId);
  }

  public getChildren(tunnelId: string = defaultId): ReactNode {
    const tunnelEntries = this.children.get(tunnelId)?.values();
    if (tunnelEntries) {
      return Array.from(tunnelEntries);
    }
  }
}
