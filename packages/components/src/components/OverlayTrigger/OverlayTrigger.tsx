import type { FC, PropsWithChildren } from "react";
import React from "react";
import { OverlayController } from "@/lib/controller";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentName } from "@/components/propTypes";
import OverlayContextProvider from "@/lib/controller/overlay/OverlayContextProvider";

export interface OverlayTriggerProps extends PropsWithChildren {
  overlayType: FlowComponentName;
  isDefaultOpen?: boolean;
}

export const OverlayTrigger: FC<OverlayTriggerProps> = (props) => {
  const { overlayType, isDefaultOpen = false, children } = props;
  const overlayController = OverlayController.useNew(isDefaultOpen);

  const propsContext: PropsContext = {
    Button: {
      onPress: overlayController.open,
    },
  };

  return (
    <OverlayContextProvider type={overlayType} controller={overlayController}>
      <PropsContextProvider props={propsContext} mergeInParentContext>
        {children}
      </PropsContextProvider>
    </OverlayContextProvider>
  );
};
