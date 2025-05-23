import * as Aria from "react-aria-components";
import type { FC, PropsWithChildren } from "react";
import React from "react";

export type TooltipTriggerProps = PropsWithChildren<
  Omit<Aria.TooltipTriggerComponentProps, "children">
>;

/** @flr-generate all */
export const TooltipTrigger: FC<TooltipTriggerProps> = (props) => {
  const { children, ...rest } = props;

  return <Aria.TooltipTrigger {...rest}>{children}</Aria.TooltipTrigger>;
};

export default TooltipTrigger;
