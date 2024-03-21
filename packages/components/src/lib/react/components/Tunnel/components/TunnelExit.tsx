import { FC, PropsWithChildren, useContext } from "react";
import tunnelContext from "@/lib/react/components/Tunnel/context";
import { useSignals } from "@preact/signals-react/runtime";

interface Props extends PropsWithChildren {
  id?: string;
}

export const TunnelExit: FC<Props> = (props) => {
  const { children, id = "default" } = props;
  useSignals();
  const { nodes } = useContext(tunnelContext);

  if (id === undefined) {
    return children;
  }

  return nodes.value[id] ?? children;
};

export default TunnelExit;
