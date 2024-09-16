import type { FC } from "react";
import { useContext, useId, useLayoutEffect, useRef } from "react";
import tunnelContext from "@/context";
import type { TunnelChildren } from "@/types";

interface Props {
  id?: string;
  children?: TunnelChildren;
  /** Static entry ID instead of generated ID by `useId` */
  staticEntryId?: string;
}

export const TunnelEntry: FC<Props> = (props) => {
  const { children, id, staticEntryId } = props;
  const tunnel = useContext(tunnelContext);
  const usedId = useId();
  const entryId = staticEntryId ?? usedId;

  const mounted = useRef(false);

  if (!mounted.current) {
    tunnel.prepareChildren(id, entryId, children);
  }

  useLayoutEffect(() => {
    mounted.current = true;
    tunnel.setChildren(id, entryId, children);
    return () => {
      tunnel.deleteChildren(id, entryId);
    };
  }, [children, id, entryId]);

  return null;
};

export default TunnelEntry;
