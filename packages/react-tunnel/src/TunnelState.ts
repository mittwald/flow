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

export interface TunnelStateOptions {
  parentTunnelState?: TunnelState;
  id?: string;
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

  public parentTunnelState?: TunnelState;

  private readonly preparedChildren = new Map<
    string,
    Map<string, TunnelEntryState>
  >();

  private nextIndex = 0;

  public constructor(options: TunnelStateOptions = {}) {
    const { parentTunnelState, id } = options;
    this.parentTunnelState = parentTunnelState;
    this.id = id ?? defaultId;

    makeObservable(this, {
      id: false,
      parentTunnelState: false,
      deleteChildren: action.bound,
      setChildren: action.bound,
    });
  }

  public static useNew(options?: TunnelStateOptions): TunnelState {
    const tunnelState = useState(() => new TunnelState(options))[0];
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
    providerId?: string,
    recurse = true,
  ): void {
    if (recurse) {
      return this.getTunnelState(providerId)?.setChildren(
        tunnelId,
        entryId,
        index,
        children,
        providerId,
        false,
      );
    }

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

  private getTunnelState(
    providerId: string = defaultId,
  ): TunnelState | undefined {
    if (providerId === this.id) {
      return this;
    }
    if (this.parentTunnelState) {
      return this.parentTunnelState.getTunnelState(providerId);
    }
  }

  public prepareChildren(
    tunnelId: string = defaultId,
    entryId: string,
    index: number,
    children: TunnelChildren,
    providerId?: string,
    recurse = true,
  ): void {
    if (recurse) {
      return this.getTunnelState(providerId)?.prepareChildren(
        tunnelId,
        entryId,
        index,
        children,
        providerId,
        false,
      );
    }

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
    map:
      | Map<string, Map<string, TunnelEntryState>>
      | ObservableMap<string, ObservableMap<string, TunnelEntryState>>,
    tunnelId: string,
    entryId: string,
    providerId?: string,
    recurse = true,
  ): void {
    if (recurse) {
      return this.getTunnelState(providerId)?.deleteChildrenFromMap(
        map,
        tunnelId,
        entryId,
        providerId,
        false,
      );
    }

    const mapEntries = map.get(tunnelId);
    mapEntries?.delete(entryId);
    if (mapEntries?.size === 0) {
      map.delete(tunnelId);
    }
  }

  public deleteChildren(
    tunnelId: string = defaultId,
    entryId: string,
    providerId?: string,
  ): void {
    this.deleteChildrenFromMap(this.children, tunnelId, entryId, providerId);
    this.deleteChildrenFromMap(
      this.preparedChildren,
      tunnelId,
      entryId,
      providerId,
    );
  }

  public getEntries(
    tunnelId: string = defaultId,
    providerId?: string,
    recurse = true,
  ): TunnelEntryState[] | undefined {
    if (recurse) {
      return this.getTunnelState(providerId)?.getEntries(
        tunnelId,
        providerId,
        false,
      );
    }

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
