import type { FC } from "react";
import type { OverlayTriggerProps } from "@/components/OverlayTrigger";
import { OverlayTrigger } from "@/components/OverlayTrigger";
import DialogTriggerView from "@/views/DialogTriggerView";

export type LightBoxTriggerProps = OverlayTriggerProps;

export const LightBoxTrigger: FC<LightBoxTriggerProps> = (props) => {
  const { children, ...triggerProps } = props;
  return (
    <OverlayTrigger
      overlayType="LightBox"
      {...triggerProps}
      component={DialogTriggerView}
    >
      {children}
    </OverlayTrigger>
  );
};
