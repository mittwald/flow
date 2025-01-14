import * as Aria from "react-aria-components";
import type { FC } from "react";
import React from "react";
import type { OverlayTriggerProps } from "~/components/OverlayTrigger";
export type { OverlayTriggerProps } from "~/components/OverlayTrigger";
import { OverlayTrigger } from "~/components/OverlayTrigger";
import type { Simplify } from "type-fest";

export type ModalTriggerProps = Simplify<OverlayTriggerProps>;

/** @flr-generate all */
export const ModalTrigger: FC<ModalTriggerProps> = (props) => {
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
