import { type ReactNode, useId, useRef, useState } from "react";
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

interface TunnelEntries {
  committed: boolean;
  entries: TunnelEntryState[];
}

export class TunnelState {
  public readonly id: string;
  private instanceId: string;

  public readonly committedChildren = observable.map<
    string,
    ObservableMap<string, TunnelEntryState>
  >(
    {},
    {
      deep: false,
    },
  );

  private readonly renderPhaseChildren = new Map<
    string,
    Map<string, TunnelEntryState>
  >();

  private nextIndex = 0;

  public constructor(
    id = defaultTunnelProviderId,
    instanceId = defaultTunnelProviderId,
  ) {
    this.id = id;
    this.instanceId = instanceId;
    makeObservable(this, {
      id: false,
      deleteChildren: action.bound,
      setChildren: action.bound,
    });
  }

  public static useNew(id?: string): TunnelState {
    const instanceId = useId();
    const tunnelState = useState(() => new TunnelState(id, instanceId))[0];
    tunnelState.resetIndex();
    return tunnelState;
  }

  public resetIndex() {
    this.nextIndex = 0;
  }

  public useEntryIndex() {
    const thisIdRef = useRef(this.instanceId);
    const thisIndex = useRef<number | null>(null);
    if (thisIndex.current === null || thisIdRef.current !== this.instanceId) {
      thisIdRef.current = this.instanceId;
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
      this.committedChildren.get(tunnelId) ??
      observable.map<string, TunnelEntryState>({}, { deep: false });

    tunnelEntries.set(entryId, entryState);

    this.renderPhaseChildren.get(tunnelId)?.delete(entryId);
    this.committedChildren.set(tunnelId, tunnelEntries);
  }

  public setRenderPhaseChildren(
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
      this.renderPhaseChildren.get(tunnelId) ??
      new Map<string, TunnelEntryState>();

    tunnelEntries.set(entryId, entryState);

    this.renderPhaseChildren.set(tunnelId, tunnelEntries);
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
    this.deleteChildrenFromMap(this.committedChildren, tunnelId, entryId);
    this.deleteChildrenFromMap(this.renderPhaseChildren, tunnelId, entryId);
  }

  // Pure read — never mutate during render. `getEntries` runs inside the
  // (observer) `TunnelExit` render, and React 19 may invoke a render more than
  // once before committing (StrictMode double-invoke, concurrent re-render), so
  // a consume-on-read here broke SSR hydration. Render-phase children are only a
  // bridge for the server render and the first (pre-commit) client render; the
  // exit opts into them via `useRenderPhaseFallback` for exactly those. From the
  // first commit on the committed children are authoritative — even when empty —
  // so an entry that never committed (suspended, then removed) leaves no stale
  // content behind.
  public getEntries(
    tunnelId = defaultId,
    useRenderPhaseFallback = false,
  ): TunnelEntries | undefined {
    const committedChildren = this.committedChildren.get(tunnelId)?.values();
    const renderPhaseChildren = useRenderPhaseFallback
      ? this.renderPhaseChildren.get(tunnelId)?.values()
      : undefined;
    const tunnelEntries = committedChildren ?? renderPhaseChildren;

    if (tunnelEntries) {
      const committed = !!committedChildren;
      const entries = Array.from(tunnelEntries).sort(
        (first, second) => first.index - second.index,
      );

      return {
        committed,
        entries,
      };
    }
  }
}
