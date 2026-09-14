import type { ComponentType, FC, PropsWithChildren, ReactNode } from "react";
import { OverlayController } from "@/lib/controller";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { useComponentPropsContext } from "@/lib/propsContext/propsContext";
import type { FlowComponentName } from "@/components/propTypes";
import OverlayContextProvider from "@/lib/controller/overlay/OverlayContextProvider";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { useIsPendingWithWait } from "@/components/Action/hooks/useIsPendingWithWait";
import { Action } from "@/components/Action";
import { useOverlayHoistRegistry } from "@/lib/overlayHoist/context";
import { isHoistableOverlayType } from "@/lib/overlayHoist/lib";

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

  const hoistRegistry = useOverlayHoistRegistry();
  const isHoisted = !!hoistRegistry && isHoistableOverlayType(overlayType);

  const propsContext: PropsContext = {
    Button: {
      onPress: overlayController.open,
      isPending,
      isDisabled: Boolean(buttonPropsContext?.isDisabled) || isContentSuspended,
    },
  };

  /**
   * Inside a menu the trigger is a `MenuItem`, and the overlay is hoisted out
   * of the menu (see `OverlayHoistProvider`).
   *
   * `Action` – not a props context – wires the trigger to the controller there.
   * A menu item is already driven by the `Action` the `ContextMenu` wraps its
   * items in, which closes the menu; a props context entry for `onAction` would
   * replace that one instead of adding to it, and the menu would stay open.
   * Nesting an `Action` composes: activating the item runs both, so the overlay
   * opens and the menu closes.
   *
   * The `Action` sits inside the props context, so its own dynamic entries win
   * over the ones above – they derive the trigger's state from the action.
   *
   * React Aria's trigger component is skipped: its `PressResponder` would latch
   * the menu item into a pressed state, because nothing ever resets the React
   * Aria trigger state that Flow does not use.
   */
  const trigger = isHoisted ? (
    <Action openOverlay={overlayType}>{children}</Action>
  ) : (
    <AriaOverlayTrigger isOpen={isOpen}>{children}</AriaOverlayTrigger>
  );

  return (
    <OverlayContextProvider type={overlayType} controller={overlayController}>
      <PropsContextProvider
        props={propsContext}
        dependencies={[isPending, overlayController]}
      >
        {trigger}
      </PropsContextProvider>
    </OverlayContextProvider>
  );
};

export default OverlayTrigger;
