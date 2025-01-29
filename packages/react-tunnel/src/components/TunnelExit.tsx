import type { FC, PropsWithChildren } from "react";
import { useContext } from "react";
import tunnelContext from "@/context";
import { observer } from "mobx-react-lite";
import React from "react";
import type { TunnelChildren } from "@/types";

interface Props extends PropsWithChildren {
  id?: string;
}

const ChildrenRenderer: FC<{ children: TunnelChildren }> = (props) => {
  const { children } = props;
  return typeof children === "function" ? children() : children;
};

export const TunnelExit: FC<Props> = observer((props) => {
  const { children, id } = props;
  const tunnelChildren = useContext(tunnelContext).getChildren(id);
  if (tunnelChildren) {
    return tunnelChildren.map(([entryId, children]) => (
      <ChildrenRenderer key={entryId}>{children}</ChildrenRenderer>
    ));
  }

  return children;
});

export default TunnelExit;
