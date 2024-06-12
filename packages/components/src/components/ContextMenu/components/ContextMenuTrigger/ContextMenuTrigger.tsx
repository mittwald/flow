import * as Aria from "react-aria-components";
import type { FC } from "react";
import React from "react";
import type { OverlayTriggerProps } from "@/components/OverlayTrigger";
import { OverlayTrigger } from "@/components/OverlayTrigger";

type Props = Omit<OverlayTriggerProps, "overlayType">;

export const ContextMenuTrigger: FC<Props> = (props) => {
  const { children, ...triggerProps } = props;
  return (
    <OverlayTrigger overlayType="Popover" {...triggerProps}>
      <Aria.MenuTrigger>{children}</Aria.MenuTrigger>
    </OverlayTrigger>
  );
};
