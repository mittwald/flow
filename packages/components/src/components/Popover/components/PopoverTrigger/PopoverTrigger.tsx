import * as Aria from "react-aria-components";
import type { FC } from "react";
import React from "react";
import type { OverlayTriggerProps } from "@/components/OverlayTrigger";
import { OverlayTrigger } from "@/components/OverlayTrigger";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

type Props = Omit<OverlayTriggerProps, "overlayType">;

export const PopoverTrigger: FC<Props> = flowComponent(
  "PopoverTrigger",
  (props) => {
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
  },
);
