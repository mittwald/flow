import type { ComponentType, FC, PropsWithChildren, ReactNode } from "react";
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

export interface OverlayTriggerProps
  extends FlowComponentProps,
    PropsWithChildren {
  /** Whether the overlay should be open initially. */
  isDefaultOpen?: boolean;
  /** A controller to control the state of the overlay. */
  controller?: OverlayController;
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
    controller: controllerFromProps,
  } = props;

  const newOverlayController = OverlayController.useNew({ isDefaultOpen });
  const overlayController = controllerFromProps ?? newOverlayController;
  const isOpen = overlayController.useIsOpen();

  const propsContext: PropsContext = {
    Button: {
      onPress: overlayController.open,
    },
  };

  return (
    <OverlayContextProvider type={overlayType} controller={overlayController}>
      <PropsContextProvider props={propsContext}>
        <AriaOverlayTrigger isOpen={isOpen}>{children}</AriaOverlayTrigger>
      </PropsContextProvider>
    </OverlayContextProvider>
  );
};

export default OverlayTrigger;
