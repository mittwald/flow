import type { ComponentType, FC, ReactNode } from "react";
import React from "react";
import { OverlayController } from "@/lib/controller";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentName } from "@/components/propTypes";
import OverlayContextProvider from "@/lib/controller/overlay/OverlayContextProvider";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";

type AriaComponentType = ComponentType<{
  isOpen?: boolean;
  children: ReactNode;
}>;

export interface OverlayTriggerProps extends FlowComponentProps {
  isDefaultOpen?: boolean;
  children: ReactNode;
}

interface Props extends OverlayTriggerProps {
  overlayType: FlowComponentName;
  component: AriaComponentType;
}

export const OverlayTrigger: FC<Props> = (props) => {
  const {
    overlayType,
    isDefaultOpen = false,
    component: AriaOverlayTrigger,
    children,
  } = props;

  const overlayController = OverlayController.useNew(isDefaultOpen);
  const isOpen = overlayController.useIsOpen();

  const propsContext: PropsContext = {
    Button: {
      onPress: overlayController.open,
    },
  };

  return (
    <OverlayContextProvider type={overlayType} controller={overlayController}>
      <PropsContextProvider props={propsContext} mergeInParentContext>
        <AriaOverlayTrigger isOpen={isOpen}>{children}</AriaOverlayTrigger>
      </PropsContextProvider>
    </OverlayContextProvider>
  );
};
