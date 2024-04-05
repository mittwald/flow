import React, { PropsWithChildren } from "react";
import { PropsWithElementType } from "@/lib/types/props";
import {
  flowComponent,
  FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export interface HeaderProps
  extends PropsWithChildren,
    PropsWithElementType,
    FlowComponentProps {}

export const Header = flowComponent("Header", (props) => {
  const { children, elementType = "header", ...rest } = props;

  const Element = elementType;

  return <Element {...rest}>{children}</Element>;
});

export default Header;
