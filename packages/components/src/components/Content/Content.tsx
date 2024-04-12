import type { PropsWithChildren } from "react";
import React from "react";
import { ClearPropsContext } from "@/lib/propsContext";
import type { PropsWithElementType } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface ContentProps
  extends PropsWithChildren,
    PropsWithElementType<"div" | "section" | "span">,
    FlowComponentProps {}

export const Content = flowComponent("Content", (props) => {
  const { children, elementType = "div", ref, ...rest } = props;

  const Element = elementType;

  return (
    <ClearPropsContext>
      <Element ref={ref} {...rest}>
        {children}
      </Element>
    </ClearPropsContext>
  );
});

export default Content;
