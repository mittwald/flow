import type { FC, PropsWithChildren } from "react";
import React from "react";
import { Action } from "@/components/Action";
import { useOverlayController } from "@/lib/controller";
import { OverlayContextProvider } from "@/lib/controller/overlay/context";

interface Props extends PropsWithChildren {}

export const ModalTrigger: FC<Props> = (props) => {
  const overlayController = useOverlayController();
  return (
    <OverlayContextProvider value={overlayController}>
      <Action openModal={overlayController}>{props.children}</Action>
    </OverlayContextProvider>
  );
};
