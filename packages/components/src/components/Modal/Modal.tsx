import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Modal.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import type { OverlayController } from "@/lib/controller/overlay";
import { useOverlayController } from "@/lib/controller/overlay/useOverlayController";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { Overlay } from "@/components/Overlay";
import { useSyncTriggerState } from "@/components/Overlay/hooks/useSyncTriggerState";

export interface ModalProps
  extends PropsWithChildren,
    FlowComponentProps<"Modal"> {
  /** @default "s" */
  size?: "s" | "m" | "l";
  offCanvas?: boolean;
  controller?: OverlayController;
  defaultOpen?: boolean;
  slot?: string;
  /** @internal */
  reuseControllerFromContext?: boolean;
}

export const Modal = flowComponent("Modal", (props) => {
  const {
    size = "s",
    offCanvas,
    controller: controllerFromProps,
    defaultOpen,
    children,
    reuseControllerFromContext = false,
    ...rest
  } = props;

  const newController = useOverlayController({
    reuseControllerFromContext,
    defaultOpen,
  });

  const controller = controllerFromProps ?? newController;

  useSyncTriggerState(controller);

  const rootClassName = clsx(
    styles.modal,
    styles[`size-${size}`],
    offCanvas && styles.offCanvas,
  );

  const propsContext: PropsContext = {
    Content: {
      elementType: React.Fragment,
    },
    Heading: {
      level: 2,
      slot: "title",
    },
    ButtonGroup: {
      className: styles.buttonGroup,
      tunnelId: "buttons",
    },
  };

  return (
    <Overlay controller={controller} className={rootClassName} {...rest}>
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          <div className={styles.content}>{children}</div>
          <TunnelExit id="buttons" />
        </TunnelProvider>
      </PropsContextProvider>
    </Overlay>
  );
});

export default Modal;
