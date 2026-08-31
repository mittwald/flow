import type { ComponentType, FC, PropsWithChildren, ReactNode } from "react";
import { OverlayController } from "@/lib/controller";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { useComponentPropsContext } from "@/lib/propsContext/propsContext";
import type { FlowComponentName } from "@/components/propTypes";
import OverlayContextProvider from "@/lib/controller/overlay/OverlayContextProvider";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { useIsPendingWithWait } from "@/components/Action/hooks/useIsPendingWithWait";

type AriaComponentType = ComponentType<{
  isOpen?: boolean;
  children: ReactNode;
}>;

export interface OverlayTriggerProps
  extends FlowComponentProps, PropsWithChildren {
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
  const buttonPropsContext = useComponentPropsContext("Button");

  const newOverlayController = OverlayController.useNew({ isDefaultOpen });
  const overlayController = controllerFromProps ?? newOverlayController;
  const isOpen = overlayController.useIsOpen();
  const isContentSuspended = overlayController.useIsContentSuspended();
  const isPending = useIsPendingWithWait(isContentSuspended);

  const propsContext: PropsContext = {
    Button: {
      onPress: overlayController.open,
      isPending,
      isDisabled: Boolean(buttonPropsContext?.isDisabled) || isContentSuspended,
      /*
       * The button is the react-aria trigger. react-aria hands the press
       * handling, the trigger ref and `aria-haspopup`/`aria-expanded`/
       * `aria-controls` down through a `PressResponder`, which only reaches its
       * own subtree — so a surrounding props context must not tunnel the button
       * out of the trigger. Such a context has to tunnel the trigger as a whole
       * instead (`overlayTriggersTunneledTo`).
       */
      tunnel: null,
    },
  };

  return (
    <OverlayContextProvider type={overlayType} controller={overlayController}>
      <PropsContextProvider
        props={propsContext}
        dependencies={[isPending, overlayController]}
      >
        <AriaOverlayTrigger isOpen={isOpen}>{children}</AriaOverlayTrigger>
      </PropsContextProvider>
    </OverlayContextProvider>
  );
};

export default OverlayTrigger;
