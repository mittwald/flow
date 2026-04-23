import type { FC } from "react";
import { useTunnelState } from "@/context";
import { observer } from "mobx-react-lite";
import type { TunnelChildren } from "@/TunnelState";
export type TunnelExitChildren = TunnelChildren;

export interface TunnelExitProps {
  id?: string;
  /** Select a dedicated tunnel provider by ID. */
  providerId?: string;
  children?: TunnelExitChildren;
}

const ChildrenRenderer: FC<{ children: TunnelExitChildren }> = (props) => {
  const { children } = props;
  return typeof children === "function" ? children() : children;
};

export const TunnelExit: FC<TunnelExitProps> = observer((props) => {
  const { children, id, providerId } = props;
  const tunnelChildren = useTunnelState(providerId).getEntries(id);

  const renderedTunnelChildren = tunnelChildren
    ? tunnelChildren.map((entry) => (
        <ChildrenRenderer key={entry.id}>{entry.children}</ChildrenRenderer>
      ))
    : null;

  if (typeof children === "function") {
    return children(renderedTunnelChildren);
  }

  return renderedTunnelChildren ?? children;
});

export default TunnelExit;
