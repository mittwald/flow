import * as Aria from "react-aria-components";
import React from "react";
import type { OverlayTriggerProps } from "~/components/OverlayTrigger";
import { OverlayTrigger } from "~/components/OverlayTrigger";
import { flowComponent } from "~/lib/componentFactory/flowComponent";

export type PopoverTriggerProps = OverlayTriggerProps;

/** @flr-generate all */
export const PopoverTrigger = flowComponent("PopoverTrigger", (props) => {
  const { children, ...triggerProps } = props;
  return (
    <OverlayTrigger
      overlayType="Popover"
      {...triggerProps}
      component={Aria.DialogTrigger}
    >
      {children}
    </OverlayTrigger>
  );
});
