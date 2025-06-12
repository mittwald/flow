import type { FC } from "react";
import { useContext } from "react";
import tunnelContext from "@/context";
import { observer } from "mobx-react-lite";
import type { TunnelChildren } from "@/TunnelState";
export type TunnelExitChildren = TunnelChildren;

export interface TunnelExitProps {
  id?: string;
  children?: TunnelExitChildren;
}

const ChildrenRenderer: FC<{ children: TunnelExitChildren }> = (props) => {
  const { children } = props;
  return typeof children === "function" ? children() : children;
};

export const TunnelExit: FC<TunnelExitProps> = observer((props) => {
  const { children, id } = props;
  const tunnelChildren = useContext(tunnelContext).getChildren(id);

  const renderedTunnelChildren = tunnelChildren
    ? tunnelChildren.map(([entryId, children]) => (
        <ChildrenRenderer key={entryId}>{children}</ChildrenRenderer>
      ))
    : null;

  if (typeof children === "function") {
    return children(renderedTunnelChildren);
  }

  return renderedTunnelChildren ?? children;
});

export default TunnelExit;
