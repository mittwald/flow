import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Modal.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import type { OverlayController } from "@/lib/controller/overlay";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { ModalOverlay } from "@/components/ModalOverlay";
import { Header } from "@/components/Header";
import { Action } from "@/components/Action";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";
import { PropsWithClassName } from "@/lib/types/props";

export interface ModalProps
  extends PropsWithChildren,
    FlowComponentProps,
    PropsWithClassName {
  /** @default "s" */
  size?: "s" | "m" | "l";
  offCanvas?: boolean;
  controller?: OverlayController;
  slot?: string;
  isDismissable?: boolean;
}

export const Modal = flowComponent("Modal", (props) => {
  const {
    size = "s",
    offCanvas,
    controller,
    children,
    refProp: ignoredRef,
    className,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.modal,
    styles[`size-${size}`],
    offCanvas && styles.offCanvas,
    className,
  );

  const propsContext: PropsContext = {
    Content: {
      elementType: React.Fragment,
    },
    Heading: {
      level: 2,
      levelVisual: 4,
      slot: "title",
      tunnelId: "heading",
    },
    ActionGroup: {
      className: styles.actionGroup,
      tunnelId: "buttons",
    },
  };

  return (
    <ModalOverlay className={rootClassName} controller={controller} {...rest}>
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          {offCanvas && (
            <Header className={styles.header}>
              <TunnelExit id="heading" />

              <Action closeOverlay="Modal">
                <Button
                  variant="plain"
                  color="secondary"
                  className={styles.closeButton}
                >
                  <IconClose />
                </Button>
              </Action>
            </Header>
          )}
          <div className={styles.content}>
            {!offCanvas && <TunnelExit id="heading" />}
            {children}
          </div>
          <TunnelExit id="buttons" />
        </TunnelProvider>
      </PropsContextProvider>
    </ModalOverlay>
  );
});

export default Modal;
