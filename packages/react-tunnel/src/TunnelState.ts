import { type ReactNode, useRef, useState } from "react";
import type { ObservableMap } from "mobx";
import { action, makeObservable, observable } from "mobx";

const defaultId = "default";
export const defaultTunnelProviderId = "default";

export type TunnelChildren =
  | ReactNode
  | undefined
  | ((tunnelChildren?: ReactNode | undefined) => ReactNode | undefined);

interface TunnelEntryState {
  index: number;
  id: string;
  children: TunnelChildren;
}

export class TunnelState {
  public readonly id: string;

  public readonly children = observable.map<
    string,
    ObservableMap<string, TunnelEntryState>
  >(
    {},
    {
      deep: false,
    },
  );

  private nextIndex = 0;

  public constructor(id = defaultTunnelProviderId) {
    this.id = id;
    makeObservable(this, {
      id: false,
      deleteChildren: action.bound,
      setChildren: action.bound,
    });
  }

  public static useNew(id?: string): TunnelState {
    const tunnelState = useState(() => new TunnelState(id))[0];
    tunnelState.resetIndex();
    return tunnelState;
  }

  public resetIndex() {
    this.nextIndex = 0;
  }

  public useEntryIndex() {
    const thisIndex = useRef<number | null>(null);
    if (thisIndex.current === null) {
      thisIndex.current = this.nextIndex++;
    }
    return thisIndex.current;
  }

  public setChildren(
    tunnelId: string = defaultId,
    entryId: string,
    index: number,
    children: TunnelChildren,
  ): void {
    const entryState: TunnelEntryState = {
      id: entryId,
      index,
      children,
    };

    const tunnelEntries =
      this.children.get(tunnelId) ??
      observable.map<string, TunnelEntryState>({}, { deep: false });

    tunnelEntries.set(entryId, entryState);

    this.children.set(tunnelId, tunnelEntries);
  }

  public deleteChildren(tunnelId: string = defaultId, entryId: string): void {
    const mapEntries = this.children.get(tunnelId);
    mapEntries?.delete(entryId);
    if (mapEntries?.size === 0) {
      this.children.delete(tunnelId);
    }
  }

  public getEntries(
    tunnelId: string = defaultId,
  ): TunnelEntryState[] | undefined {
    const tunnelEntries = this.children.get(tunnelId)?.values();
    if (tunnelEntries) {
      return Array.from(tunnelEntries).sort(
        (first, second) => first.index - second.index,
      );
    }
  }
}
