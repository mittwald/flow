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

  const mounted = useRef(false);

  if (!mounted.current) {
    tunnel.prepareChildren(id, entryId, children);
  }

  useEffect(() => {
    mounted.current = true;
    tunnel.setChildren(id, entryId, children);
    return () => {
      tunnel.deleteChildren(id, entryId);
    };
  }, [children, id, entryId]);

  return null;
};

export default TunnelEntry;
