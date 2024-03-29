import * as Aria from "react-aria-components";
import React, { FC, PropsWithChildren } from "react";

export interface TooltipTriggerProps
  extends PropsWithChildren<
    Omit<Aria.TooltipTriggerComponentProps, "children">
  > {}

export const TooltipTrigger: FC<TooltipTriggerProps> = (props) => {
  const { children, ...rest } = props;

  return <Aria.TooltipTrigger {...rest}>{children}</Aria.TooltipTrigger>;
};

export default TooltipTrigger;
