import * as Aria from "react-aria-components";
import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Modal.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import type { OverlayController } from "@/lib/controller/overlay";
import { useOverlayController } from "@/lib/controller/overlay/useOverlayController";
import { OverlayContextProvider } from "@/lib/controller/overlay/context";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface ModalProps
  extends PropsWithChildren,
    FlowComponentProps<"Modal"> {
  /** @default "s" */
  size?: "s" | "m" | "l";
  offCanvas?: boolean;
  controller?: OverlayController;
  defaultOpen?: boolean;
  slot?: string;
}

export const Modal = flowComponent("Modal", (props) => {
  const {
    size = "s",
    offCanvas,
    controller: controllerFromProps,
    defaultOpen,
    children,
    ...rest
  } = props;

  const controllerFromContext = useOverlayController({
    reuseControllerFromContext: true,
    defaultOpen,
  });

  const controller = controllerFromProps ?? controllerFromContext;
  const isOpen = controller.useIsOpen();

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
    <Aria.ModalOverlay
      className={styles.overlay}
      {...rest}
      isDismissable
      isOpen={isOpen}
      onOpenChange={(isOpen) => controller.setOpen(isOpen)}
    >
      <Aria.Modal className={rootClassName}>
        <Aria.Dialog className={styles.dialog}>
          <OverlayContextProvider value={controller}>
            <PropsContextProvider props={propsContext}>
              <TunnelProvider>
                <div className={styles.content}>{children}</div>
                <TunnelExit id="buttons" />
              </TunnelProvider>
            </PropsContextProvider>
          </OverlayContextProvider>
        </Aria.Dialog>
      </Aria.Modal>
    </Aria.ModalOverlay>
  );
});

export default Modal;
