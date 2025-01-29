import * as Aria from "react-aria-components";
import type { FC } from "react";
import React from "react";
import type { OverlayTriggerProps } from "@/components/OverlayTrigger";
import { OverlayTrigger } from "@/components/OverlayTrigger";

export type LightBoxTriggerProps = OverlayTriggerProps;

/** @flr-generate all */
export const LightBoxTrigger: FC<LightBoxTriggerProps> = (props) => {
  const { children, ...triggerProps } = props;
  return (
    <OverlayTrigger
      overlayType="LightBox"
      {...triggerProps}
      component={Aria.DialogTrigger}
    >
      {children}
    </OverlayTrigger>
  );
};
