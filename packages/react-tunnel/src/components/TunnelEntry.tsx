import { FC, PropsWithChildren, useContext, useLayoutEffect } from "react";
import tunnelContext from "@/context";

interface Props extends PropsWithChildren {
  id?: string;
}

export const TunnelEntry: FC<Props> = (props) => {
  const { children, id = "default" } = props;
  const tunnel = useContext(tunnelContext);

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
  }, [children, id, children]);

  return null;
};

export default TunnelEntry;
