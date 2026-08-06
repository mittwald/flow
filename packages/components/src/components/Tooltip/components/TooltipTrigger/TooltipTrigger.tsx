import * as Aria from "react-aria-components";
import type { FC, PropsWithChildren } from "react";

export interface TooltipTriggerProps extends PropsWithChildren<
  Omit<Aria.TooltipTriggerComponentProps, "children">
> {
  /**
   * The delay in milliseconds before the tooltip is shown on hover.
   *
   * @default 400
   */
  delay?: number;
}

/** @flr-generate all */
export const TooltipTrigger: FC<TooltipTriggerProps> = (props) => {
  const { children, delay = 400, ...rest } = props;

  return (
    <Aria.TooltipTrigger {...rest} delay={delay}>
      {children}
    </Aria.TooltipTrigger>
  );
};

export default TooltipTrigger;
