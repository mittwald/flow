import type { PropsWithChildren } from "react";
import React from "react";
import type { PropsWithElementType } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface ContentProps
  extends PropsWithChildren,
    PropsWithElementType<"div" | "section" | "span">,
    FlowComponentProps {
  /** @internal */
  slot?: string;
}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const Content = flowComponent("Content", (props) => {
  const { children, elementType = "div", ref, ...rest } = props;

  const Element = elementType;

  return (
    <Element ref={ref} {...rest}>
      {children}
    </Element>
  );
});

export default Content;
