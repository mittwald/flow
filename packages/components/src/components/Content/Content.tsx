import { Wrap } from "@/components/Wrap";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithElementType } from "@/lib/types/props";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import type { PropsWithChildren } from "react";

export interface ContentProps
  extends PropsWithChildren,
    PropsWithElementType<"div" | "section" | "span">,
    FlowComponentProps {
  /** @internal */
  clearPropsContext?: boolean;
  /** @internal */
  slot?: string;
}

/** @flr-generate all */
export const Content = flowComponent("Content", (props) => {
  const {
    children,
    elementType = "div",
    ref,
    clearPropsContext = true,
    ...rest
  } = props;

  const Element = elementType;

  return (
    <Wrap if={clearPropsContext}>
      <ClearPropsContextView>
        <Element ref={ref} {...rest}>
          {children}
        </Element>
      </ClearPropsContextView>
    </Wrap>
  );
});

export default Content;
