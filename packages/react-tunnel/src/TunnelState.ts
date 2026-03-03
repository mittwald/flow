import { type ReactNode, useRef, useState } from "react";
import type { ObservableMap } from "mobx";
import { action, makeObservable, observable } from "mobx";

const defaultId = "default";

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
  public readonly children = observable.map<
    string,
    ObservableMap<string, TunnelEntryState>
  >(
    {},
    {
      deep: false,
    },
  );

  private readonly preparedChildren = new Map<
    string,
    Map<string, TunnelEntryState>
  >();

  private nextIndex = 0;

  public constructor() {
    makeObservable(this, {
      deleteChildren: action.bound,
      setChildren: action.bound,
    });
  }

  public static useNew(): TunnelState {
    const tunnelState = useState(() => new TunnelState())[0];
    tunnelState.resetIndex();
    return tunnelState;
  }

  public resetIndex() {
    this.nextIndex = 0;
  }

  public useEntryIndex() {
    const thisRef = useRef(this);
    const thisIndex = useRef<number | null>(null);
    if (thisIndex.current === null || thisRef.current !== this) {
      thisRef.current = this;
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

    this.preparedChildren.get(tunnelId)?.delete(entryId);
    this.children.set(tunnelId, tunnelEntries);
  }

  public prepareChildren(
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
      this.preparedChildren.get(tunnelId) ??
      new Map<string, TunnelEntryState>();

    tunnelEntries.set(entryId, entryState);

    this.preparedChildren.set(tunnelId, tunnelEntries);
  }

  private deleteChildrenFromMap(
    map: Map<string, Map<string, TunnelEntryState>>,
    tunnelId: string,
    entryId: string,
  ): void {
    const mapEntries = map.get(tunnelId);
    mapEntries?.delete(entryId);
    if (mapEntries?.size === 0) {
      map.delete(tunnelId);
    }
  }

  public deleteChildren(tunnelId: string = defaultId, entryId: string): void {
    this.deleteChildrenFromMap(this.children, tunnelId, entryId);
    this.deleteChildrenFromMap(this.preparedChildren, tunnelId, entryId);
  }

  public getEntries(
    tunnelId: string = defaultId,
  ): TunnelEntryState[] | undefined {
    const tunnelEntries =
      this.children.get(tunnelId)?.values() ??
      this.preparedChildren.get(tunnelId)?.values();
    if (tunnelEntries) {
      return Array.from(tunnelEntries).sort(
        (first, second) => first.index - second.index,
      );
    }
  }
}
