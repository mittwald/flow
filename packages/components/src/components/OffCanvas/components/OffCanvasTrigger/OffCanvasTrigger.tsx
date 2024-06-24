import * as Aria from "react-aria-components";
import type { FC } from "react";
import React from "react";
import type { OverlayTriggerProps } from "@/components/OverlayTrigger";
import { OverlayTrigger } from "@/components/OverlayTrigger";

type Props = Omit<OverlayTriggerProps, "overlayType">;

export const OffCanvasTrigger: FC<Props> = (props) => {
  const { children, ...triggerProps } = props;
  return (
    <OverlayTrigger
      overlayType="OffCanvas"
      {...triggerProps}
      component={Aria.DialogTrigger}
    >
      {children}
    </OverlayTrigger>
  );
};
