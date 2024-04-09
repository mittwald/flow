import type { PropsWithChildren } from "react";
import React from "react";
import { ClearPropsContext } from "@/lib/propsContext";
import type { PropsWithElementType } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface ContentProps
  extends PropsWithChildren,
    PropsWithElementType,
    FlowComponentProps {}

export const Content = flowComponent("Content", (props) => {
  const { children, elementType = "div", ...rest } = props;

  const Element = elementType;

  return (
    <ClearPropsContext>
      <Element {...rest}>{children}</Element>
    </ClearPropsContext>
  );
});

export default Content;
