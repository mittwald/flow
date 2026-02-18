import type { FC, ReactNode } from "react";
import { useContext, useEffect, useId, useRef } from "react";
import tunnelContext from "@/context";

export type TunnelEntryChildren =
  | ReactNode
  | undefined
  | (() => ReactNode | undefined);

export interface TunnelEntryProps {
  id?: string;
  children?: TunnelEntryChildren;
  /** Static entry ID instead of generated ID by `useId` */
  staticEntryId?: string;
}

export const TunnelEntry: FC<TunnelEntryProps> = (props) => {
  const { children, id, staticEntryId } = props;
  const tunnel = useContext(tunnelContext);
  const usedId = useId();
  const entryId = staticEntryId ?? usedId;
  const index = tunnel.useEntryIndex();

  const mounted = useRef(false);

  if (!mounted.current) {
    tunnel.prepareChildren(id, entryId, index, children);
  }

  useEffect(() => {
    mounted.current = true;
    tunnel.setChildren(id, entryId, index, children);
  }, [children, id, entryId, index]);

  useEffect(() => {
    /**
     * Delete children only on ID changes. NOT if children itself changes,
     * because this would delete the map entry with a subsequent re-insert. This
     * changes the order of the map entries and thus the order of the children
     * in the TunnelExit may be disrupted as well.
     */
    return () => {
      tunnel.deleteChildren(id, entryId);
    };
  }, [id, entryId]);

  return null;
};

export default TunnelEntry;
