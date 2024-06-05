import type { FC } from "react";
import { useContext, useId, useLayoutEffect, useRef } from "react";
import tunnelContext from "@/context";
import type { TunnelChildren } from "@/types";

interface Props {
  id?: string;
  children?: TunnelChildren;
}

export const TunnelEntry: FC<Props> = (props) => {
  const { children, id } = props;
  const tunnel = useContext(tunnelContext);
  const entryId = useId();

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
