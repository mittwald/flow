import { FC, PropsWithChildren, useContext } from "react";
import tunnelContext from "@/context";
import { useSignals } from "@preact/signals-react/runtime";

interface Props extends PropsWithChildren {
  id?: string;
}

export const TunnelExit: FC<Props> = (props) => {
  const { children, id = "default" } = props;
  useSignals();
  const tunnel = useContext(tunnelContext);
  const tunneledChildren = tunnel.children.value[id];
  return tunneledChildren ?? children;
};

export default TunnelExit;
