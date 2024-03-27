import React, { ComponentProps, ComponentType, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import {
  flowComponent,
  FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export interface ListItemLinkProps
  extends PropsWithChildren<Omit<Aria.LinkProps, "children" | "slot">>,
    FlowComponentProps {
  linkComponent?: ComponentType<Omit<ComponentProps<"a">, "ref">>;
  className?: string;
}

export const ListItemLink = flowComponent("ListItemLink", (props) => {
  const { children, linkComponent: Link = Aria.Link, ...rest } = props;

  return <Link {...rest}>{children}</Link>;
});

export default ListItemLink;
