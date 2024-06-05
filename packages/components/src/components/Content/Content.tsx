import type { PropsWithChildren } from "react";
import React from "react";
import { ClearPropsContext } from "@/lib/propsContext";
import type { PropsWithElementType } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { Wrap } from "@/components/Wrap";
import { Activity } from "@/components/Activity";

export interface ContentProps
  extends PropsWithChildren,
    PropsWithElementType<"div" | "section" | "span">,
    FlowComponentProps {
  /** @internal */
  clearPropsContext?: boolean;
  /** @internal */
  isActive?: boolean;
  slot?: string;
}

export const Content = flowComponent("Content", (props) => {
  const {
    children,
    elementType = "div",
    refProp: ref,
    clearPropsContext = true,
    isActive = true,
    ...rest
  } = props;

  const Element = elementType;

  return (
    <Wrap if={clearPropsContext}>
      <ClearPropsContext>
        <Activity isActive={isActive}>
          <Element ref={ref} {...rest}>
            {children}
          </Element>
        </Activity>
      </ClearPropsContext>
    </Wrap>
  );
});

export default Content;
