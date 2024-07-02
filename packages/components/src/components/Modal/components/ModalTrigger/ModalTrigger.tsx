import * as Aria from "react-aria-components";
import type { FC } from "react";
import React from "react";
import type { OverlayTriggerProps } from "@/components/OverlayTrigger";
import { OverlayTrigger } from "@/components/OverlayTrigger";

export const ModalTrigger: FC<OverlayTriggerProps> = (props) => {
  const { children, ...triggerProps } = props;
  return (
    <OverlayTrigger
      overlayType="Modal"
      {...triggerProps}
      component={Aria.DialogTrigger}
    >
      {children}
    </OverlayTrigger>
  );
};
