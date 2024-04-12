import type { FC, PropsWithChildren } from "react";
import { useRef } from "react";
import { useContext, useId, useLayoutEffect } from "react";
import tunnelContext from "@/context";

interface Props extends PropsWithChildren {
  id?: string;
}

export const TunnelEntry: FC<Props> = (props) => {
  const { children, id } = props;
  const tunnel = useContext(tunnelContext);
  const entryId = useId();

  const mounted = useRef(false);

  if (!mounted.current) {
    tunnel.setChildren(id, entryId, children);
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
