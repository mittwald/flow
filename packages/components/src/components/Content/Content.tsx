import type { PropsWithChildren } from "react";
import type { PropsWithElementType } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { SkeletonRawText } from "@/components/SkeletonMode/components/SkeletonRawText";

export interface ContentProps
  extends
    PropsWithChildren,
    PropsWithElementType<"div" | "section" | "span">,
    FlowComponentProps {
  /** @internal */
  slot?: string;
}

/** @flr-generate all */
export const Content = flowComponent("Content", (props) => {
  const { children, elementType = "div", ref, ...rest } = props;

  const Element = elementType;

  return (
    <Element ref={ref} {...rest}>
      <SkeletonRawText>{children}</SkeletonRawText>
    </Element>
  );
});

export default Content;
