import { FC, PropsWithChildren, useContext, useLayoutEffect } from "react";
import tunnelContext from "@/lib/react/components/Tunnel/context";

interface Props extends PropsWithChildren {
  id?: string;
}

export const TunnelEntry: FC<Props> = (props) => {
  const { children, id = "default" } = props;
  const { nodes } = useContext(tunnelContext);

  useLayoutEffect(() => {
    if (id === undefined) {
      return;
    }

    if (children !== nodes.value[id]) {
      nodes.value = { ...nodes.value, [id]: children };
      return () => {
        nodes.value = { ...nodes.value, [id]: undefined };
      };
    }
  }, [children, id, nodes]);

  return null;
};

export default TunnelEntry;
