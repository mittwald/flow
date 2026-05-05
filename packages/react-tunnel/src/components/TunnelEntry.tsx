import type { FC, ReactNode } from "react";
import { useId, useLayoutEffect } from "react";
import { useTunnelState } from "@/context";

export type TunnelEntryChildren =
  | ReactNode
  | undefined
  | (() => ReactNode | undefined);

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
  const usedId = useId();
  const entryId = staticEntryId ?? usedId;
  const index = tunnel.useEntryIndex();

  useLayoutEffect(() => {
    tunnel.setChildren(id, entryId, index, children);
  }, [children, id, entryId, index, providerId]);

  useLayoutEffect(() => {
    /**
     * Delete children only on ID changes. NOT if children itself changes,
     * because this would delete the map entry with a subsequent re-insert. This
     * changes the order of the map entries and thus the order of the children
     * in the TunnelExit may be disrupted as well.
     */
    return () => {
      tunnel.deleteChildren(id, entryId);
    };
  }, [id, entryId, providerId]);

  return null;
};

export default TunnelEntry;
