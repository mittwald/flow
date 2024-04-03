import * as Aria from "react-aria-components";
import React, { FC, PropsWithChildren } from "react";
import styles from "./Modal.module.scss";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import { OverlayController } from "@/lib/controller/overlayController/types";
import { useOverlayController } from "@/lib/controller/overlayController/useOverlayController";
import { useSyncTriggerState } from "@/components/Modal/hooks/useSyncTriggerState";
import { OverlayContextProvider } from "@/lib/controller/overlayController/context";

export interface ModalProps extends PropsWithChildren {
  size?: "s" | "m" | "l";
  panel?: boolean;
  controller?: OverlayController;
  defaultOpen?: boolean;
}

export const Modal: FC<ModalProps> = (props) => {
  const {
    size = "s",
    panel,
    controller: controllerFromProps,
    defaultOpen,
    children,
    ...rest
  } = props;

  const newController = useOverlayController({
    reuseControllerFromContext: false,
    defaultOpen,
  });

  const controller = controllerFromProps ?? newController;
  const isOpen = controller.useIsOpen();

  useSyncTriggerState(controller);

  const rootClassName = clsx(
    styles.modal,
    styles[`size-${size}`],
    panel && styles.panel,
  );

  const propsContext: PropsContext = {
    Content: {
      tunnelId: "content",
      elementType: React.Fragment,
    },
    Heading: {
      level: 2,
      tunnelId: "title",
      slot: "title",
    },
    ButtonGroup: {
      className: styles.buttonGroup,
    },
  };

  return (
    <Aria.ModalOverlay
      className={styles.overlay}
      {...rest}
      isDismissable
      isOpen={isOpen}
      onOpenChange={controller.setIsOpen}
    >
      <Aria.Modal className={rootClassName}>
        <Aria.Dialog className={styles.dialog}>
          <OverlayContextProvider value={{ controller }}>
            <PropsContextProvider props={propsContext}>
              <TunnelProvider>
                <div className={styles.content}>
                  <TunnelExit id="title" />
                  <TunnelExit id="content" />
                </div>
                {children}
              </TunnelProvider>
            </PropsContextProvider>
          </OverlayContextProvider>
        </Aria.Dialog>
      </Aria.Modal>
    </Aria.ModalOverlay>
  );
};

export default Modal;
