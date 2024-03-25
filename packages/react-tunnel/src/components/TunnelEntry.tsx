import { FC, PropsWithChildren, useContext, useLayoutEffect } from "react";
import tunnelContext from "@/context";
import { useSignals } from "@preact/signals-react/runtime";

interface Props extends PropsWithChildren {
  id?: string;
}

export const TunnelEntry: FC<Props> = (props) => {
  const { children, id = "default" } = props;
  const tunnel = useContext(tunnelContext);
  useSignals();

  useLayoutEffect(() => {
    if (children === tunnel.children.value[id]) {
      return;
    }

    tunnel.children.value = { ...tunnel.children.value, [id]: children };

    return () => {
      const updatedContext = { ...tunnel.children.value };
      delete updatedContext[id];
      tunnel.children.value = updatedContext;
    };
  }, [children, id]);

  const inTunnel = id in tunnel.children.value;

  /**
   * Render children if not already in Tunnel, because parent component may
   * assume they are being rendered.
   */
  return inTunnel ? null : children;
};

export default TunnelEntry;
