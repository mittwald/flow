import type { FC, ReactNode } from "react";
import { useContext } from "react";
import tunnelContext from "@/context";
import { observer } from "mobx-react-lite";
import type { TunnelChildren } from "@/types";

interface Props {
  id?: string;
  children?:
    | ReactNode
    | undefined
    | ((tunnelChildren?: ReactNode | undefined) => ReactNode | undefined);
}

const ChildrenRenderer: FC<{ children: TunnelChildren }> = (props) => {
  const { children } = props;
  return typeof children === "function" ? children() : children;
};

export const TunnelExit: FC<Props> = observer((props) => {
  const { children, id } = props;
  const tunnelChildren = useContext(tunnelContext).getChildren(id);

  const renderedTunnelChildren = tunnelChildren
    ? tunnelChildren.map(([entryId, children]) => (
        <ChildrenRenderer key={entryId}>{children}</ChildrenRenderer>
      ))
    : null;

  if (typeof children === "function") {
    return <>{children(renderedTunnelChildren)}</>;
  }

  return renderedTunnelChildren ?? children;
});

export default TunnelExit;
