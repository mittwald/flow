import { FC, PropsWithChildren, useContext } from "react";
import tunnelContext from "@/context";
import { observer } from "mobx-react-lite";

interface Props extends PropsWithChildren {
  id?: string;
}

export const TunnelExit: FC<Props> = observer((props) => {
  const { children, id } = props;
  const tunnel = useContext(tunnelContext);
  return tunnel.getChildren(id) ?? children;
});

export default TunnelExit;
