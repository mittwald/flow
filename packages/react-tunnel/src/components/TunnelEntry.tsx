import { FC, PropsWithChildren, useContext, useLayoutEffect } from "react";
import tunnelContext from "@/context";
import { observer } from "mobx-react-lite";

interface Props extends PropsWithChildren {
  id?: string;
}

export const TunnelEntry: FC<Props> = observer((props) => {
  const { children, id } = props;
  const tunnel = useContext(tunnelContext);

  useLayoutEffect(() => {
    tunnel.setChildren(id, children);
    return () => {
      tunnel.deleteChildren(id);
    };
  }, [children, id]);

  /**
   * Render children if not already in Tunnel, because parent component may
   * assume they are being rendered.
   */
  return tunnel.hasChildren(id) ? null : children;
});

export default TunnelEntry;
