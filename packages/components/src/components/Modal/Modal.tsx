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
import type { PropsWithClassName } from "@/lib/types/props";

export interface ModalProps
  extends PropsWithChildren,
    FlowComponentProps,
    PropsWithClassName {
  /** @default "s" */
  size?: "s" | "m";
  offCanvas?: boolean;
  offCanvasOrientation?: "left" | "right";
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
    offCanvasOrientation = "right",
    ...rest
  } = props;

  const rootClassName = clsx(
    offCanvas ? styles.offCanvas : styles.modal,
    styles[`size-${size}`],
    styles[offCanvasOrientation],
    className,
  );

  const propsContext: PropsContext = {
    Content: {
      className: styles.content,
    },
    Heading: {
      level: 2,
      slot: "title",
      tunnelId: "heading",
    },
    ActionGroup: {
      className: styles.actionGroup,
      spacing: "m",
    },
  };

  return (
    <ModalOverlay className={rootClassName} controller={controller} {...rest}>
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          <Header className={styles.header}>
            <TunnelExit id="heading" />
            {offCanvas && (
              <Action closeOverlay="Modal">
                <Button
                  variant="plain"
                  color="secondary"
                  className={styles.closeButton}
                >
                  <IconClose />
                </Button>
              </Action>
            )}
          </Header>
          {children}
        </TunnelProvider>
      </PropsContextProvider>
    </ModalOverlay>
  );
});

export default Modal;
