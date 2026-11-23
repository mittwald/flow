import * as Aria from "react-aria-components";
import type { PropsWithChildren } from "react";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export type TooltipDelay = "default" | "long";

const delays: Record<TooltipDelay, number> = {
  default: 400,
  long: 1500,
};

export interface TooltipTriggerProps
  extends
    PropsWithChildren<
      Omit<Aria.TooltipTriggerComponentProps, "children" | "delay">
    >,
    Omit<FlowComponentProps, "ref"> {
  /**
   * How long the tooltip waits before it is shown on hover. Use `"default"`
   * (400ms) for elements that cannot be understood without the tooltip – icon
   * only buttons, for example. Use `"long"` (1500ms) for supplementary
   * information on elements that are already labeled.
   *
   * @default "default"
   */
  delay?: TooltipDelay;
}

/**
 * @flr-generate all
 * @flr-provider
 */
export const TooltipTrigger = flowComponent(
  "TooltipTrigger",
  (props) => {
    const { children, delay = "default", ...rest } = props;

    return (
      <Aria.TooltipTrigger {...rest} delay={delays[delay]}>
        {children}
      </Aria.TooltipTrigger>
    );
  },
  { type: "provider" },
);

export default TooltipTrigger;
