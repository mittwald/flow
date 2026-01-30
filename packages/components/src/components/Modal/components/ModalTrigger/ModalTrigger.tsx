import type { FC } from "react";
import type { OverlayTriggerProps } from "@/components/OverlayTrigger";
import { OverlayTrigger } from "@/components/OverlayTrigger";
import type { Simplify } from "type-fest";
import DialogTriggerView from "@/views/DialogTriggerView";

export type { OverlayTriggerProps } from "@/components/OverlayTrigger";

export type ModalTriggerProps = Simplify<OverlayTriggerProps>;

export const ModalTrigger: FC<ModalTriggerProps> = (props) => {
  const { children, ...triggerProps } = props;
  return (
    <OverlayTrigger
      overlayType="Modal"
      {...triggerProps}
      component={DialogTriggerView}
    >
      {children}
    </OverlayTrigger>
  );
};

export default ModalTrigger;
