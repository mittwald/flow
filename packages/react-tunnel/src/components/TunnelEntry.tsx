import type { FC, ReactNode } from "react";
import { useEffect, useId, useLayoutEffect, useRef } from "react";
import { useTunnelState } from "@/context";

export type TunnelEntryChildren =
  ReactNode | undefined | (() => ReactNode | undefined);

export interface TunnelEntryProps {
  id?: string;
  children?: TunnelEntryChildren;
  /** Static entry ID instead of generated ID by `useId` */
  staticEntryId?: string;
  /** Select a dedicated tunnel provider by ID. */
  providerId?: string;
}

export const TunnelEntry: FC<TunnelEntryProps> = (props) => {
  const { children, id, staticEntryId, providerId } = props;
  const tunnel = useTunnelState(providerId);
  /**
   * Identifies this entry instance, as opposed to `entryId`, which a
   * `staticEntryId` deliberately shares between several instances.
   */
  const ownerId = useId();
  const entryId = staticEntryId ?? ownerId;
  const index = tunnel.useEntryIndex();

  const mounted = useRef(false);

  if (!mounted.current) {
    tunnel.setRenderPhaseChildren(id, entryId, ownerId, index, children);
  }

  useLayoutEffect(() => {
    mounted.current = true;
    tunnel.setChildren(id, entryId, ownerId, index, children);
  }, [children, id, entryId, ownerId, index, providerId]);

  useEffect(() => {
    /**
     * Delete children only on ID changes. NOT if children itself changes,
     * because this would delete the map entry with a subsequent re-insert. This
     * changes the order of the map entries and thus the order of the children
     * in the TunnelExit may be disrupted as well.
     */
    return () => {
      tunnel.deleteChildren(id, entryId, ownerId);
    };
  }, [id, entryId, ownerId, providerId]);

  return null;
};

export default TunnelEntry;
