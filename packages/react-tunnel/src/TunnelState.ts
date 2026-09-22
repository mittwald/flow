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
  /**
   * The `TunnelEntry` instances currently registered under this entry id.
   * Usually exactly one, but a `staticEntryId` is shared on purpose: react-aria
   * renders collection children twice (once into its hidden collection
   * document, once for real), and both renders register the same entry. The
   * entry is only removed once the last of them unmounts — deleting it when the
   * first one goes would drop content that is still being rendered.
   */
  owners: Set<string>;
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

  private buildEntryState(
    previous: TunnelEntryState | undefined,
    entryId: string,
    ownerId: string,
    index: number,
    children: TunnelChildren,
  ): TunnelEntryState {
    const owners = new Set(previous?.owners);
    owners.add(ownerId);

    return {
      id: entryId,
      index,
      children,
      owners,
    };
  }

  public setChildren(
    tunnelId: string = defaultId,
    entryId: string,
    ownerId: string,
    index: number,
    children: TunnelChildren,
  ): void {
    const tunnelEntries =
      this.committedChildren.get(tunnelId) ??
      observable.map<string, TunnelEntryState>({}, { deep: false });

    tunnelEntries.set(
      entryId,
      this.buildEntryState(
        tunnelEntries.get(entryId),
        entryId,
        ownerId,
        index,
        children,
      ),
    );

    this.deleteOwnerFromMap(
      this.renderPhaseChildren,
      tunnelId,
      entryId,
      ownerId,
    );
    this.committedChildren.set(tunnelId, tunnelEntries);
  }

  public setRenderPhaseChildren(
    tunnelId: string = defaultId,
    entryId: string,
    ownerId: string,
    index: number,
    children: TunnelChildren,
  ): void {
    const tunnelEntries =
      this.renderPhaseChildren.get(tunnelId) ??
      new Map<string, TunnelEntryState>();

    tunnelEntries.set(
      entryId,
      this.buildEntryState(
        tunnelEntries.get(entryId),
        entryId,
        ownerId,
        index,
        children,
      ),
    );

    this.renderPhaseChildren.set(tunnelId, tunnelEntries);
  }

  private deleteOwnerFromMap(
    map: Map<string, Map<string, TunnelEntryState>>,
    tunnelId: string,
    entryId: string,
    ownerId: string,
  ): void {
    const mapEntries = map.get(tunnelId);
    const entry = mapEntries?.get(entryId);

    if (!mapEntries || !entry) {
      return;
    }

    const owners = new Set(entry.owners);
    owners.delete(ownerId);

    if (owners.size > 0) {
      mapEntries.set(entryId, { ...entry, owners });
      return;
    }

    mapEntries.delete(entryId);

    if (mapEntries.size === 0) {
      map.delete(tunnelId);
    }
  }

  public deleteChildren(
    tunnelId: string = defaultId,
    entryId: string,
    ownerId: string,
  ): void {
    this.deleteOwnerFromMap(this.committedChildren, tunnelId, entryId, ownerId);
    this.deleteOwnerFromMap(
      this.renderPhaseChildren,
      tunnelId,
      entryId,
      ownerId,
    );
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
