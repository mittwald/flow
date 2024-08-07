import * as Aria from "react-aria-components";
import type { FC } from "react";
import React from "react";
import type { OverlayTriggerProps } from "@/components/OverlayTrigger";
import { OverlayTrigger } from "@/components/OverlayTrigger";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export const ContextMenuTrigger: FC<OverlayTriggerProps> = flowComponent(
  "ContextMenuTrigger",
  (props) => {
    const { children, ...triggerProps } = props;
    return (
      <OverlayTrigger
        overlayType="ContextMenu"
        {...triggerProps}
        component={Aria.MenuTrigger}
      >
        {children}
      </OverlayTrigger>
    );
  },
);
