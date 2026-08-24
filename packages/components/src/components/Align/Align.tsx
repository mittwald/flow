import type { PropsWithChildren } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { CombineImplementation } from "@/components/Combine/Combine";
import { useWarnDeprecation } from "@/components/DeprecationWarningProvider";

export interface AlignProps
  extends PropsWithChildren, PropsWithClassName, FlowComponentProps {}

/**
 * @deprecated Align has been renamed to Combine and will be removed in a future
 *   major version. Use Combine instead.
 * @flr-generate all
 */
export const Align = flowComponent(
  "Align",
  (props) => {
    const warnDeprecation = useWarnDeprecation();
    warnDeprecation(
      "The 'Align' component is deprecated and will be removed in a future release. Use 'Combine' instead.",
    );

    return <CombineImplementation {...props} />;
  },
  {
    type: "layout",
  },
);

export default Align;
