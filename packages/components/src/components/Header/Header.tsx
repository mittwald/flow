import type { PropsWithChildren } from "react";
import React from "react";
import type { PropsWithElementType } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface HeaderProps
  extends PropsWithChildren,
    PropsWithElementType<"div" | "header" | "span">,
    FlowComponentProps {}

export const Header = flowComponent("Header", (props) => {
  const { children, ref, elementType = "header", ...rest } = props;

  const Element = elementType;

  return (
    <Element {...rest} ref={ref}>
      {children}
    </Element>
  );
});

export default Header;
