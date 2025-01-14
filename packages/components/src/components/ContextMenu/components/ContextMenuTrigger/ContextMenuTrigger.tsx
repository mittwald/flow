import * as Aria from "react-aria-components";
import React from "react";
import type { OverlayTriggerProps } from "~/components/OverlayTrigger";
import { OverlayTrigger } from "~/components/OverlayTrigger";
import { flowComponent } from "~/lib/componentFactory/flowComponent";

export type ContextMenuTriggerProps = OverlayTriggerProps;

/** @flr-generate all */
export const ContextMenuTrigger = flowComponent(
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
