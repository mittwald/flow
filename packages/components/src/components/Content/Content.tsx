import React, { PropsWithChildren } from "react";
import { ClearPropsContext } from "@/lib/propsContext";
import { PropsWithElementType } from "@/lib/types/props";
import {
  flowComponent,
  FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

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
