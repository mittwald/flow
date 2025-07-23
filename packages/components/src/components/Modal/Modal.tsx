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
import { Overlay } from "@/components/Overlay/Overlay";
import { Action } from "@/components/Action";
import { IconClose } from "@/components/Icon/components/icons";
import type { PropsWithClassName } from "@/lib/types/props";
import HeaderView from "@/views/HeaderView";
import ButtonView from "@/views/ButtonView";

export interface ModalProps
  extends PropsWithChildren,
    FlowComponentProps,
    PropsWithClassName {
  /** The size of the modal. @default "s" */
  size?: "s" | "m" | "l";
  /** Whether the modal should be displayed as an off canvas. */
  offCanvas?: boolean;
  /**
   * Whether the off canvas should be displayed on the right or left side of the
   * screen. @default "right"
   */
  offCanvasOrientation?: "left" | "right";
  /** An overlay controller to control the modal state. */
  controller?: OverlayController;
  /**
   * Accepts "actionConfirm" to use the modal as a confirmation modal for an
   * action.
   */
  slot?: string;
  /** Whether the modal can be closed by clicking outside of it. */
  isDismissable?: boolean;
}

export const Modal = flowComponent("Modal", (props) => {
  const {
    size = "s",
    offCanvas,
    controller,
    children,
    ref,
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
      Section: {
        Heading: {
          level: 3,
        },
        Header: {
          Heading: {
            level: 3,
          },
        },
      },
    },
    ColumnLayout: {
      l: [2, 1],
      m: [1],
      className: styles.columnLayout,
      Section: {
        Heading: {
          level: 3,
        },
      },
      AccentBox: { className: styles.accentBox, color: "neutral" },
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
    <Overlay
      className={rootClassName}
      controller={controller}
      ref={ref}
      {...rest}
    >
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          <HeaderView className={styles.header}>
            <TunnelExit id="heading" />
            <Action closeOverlay="Modal">
              <ButtonView
                variant="plain"
                color="secondary"
                className={styles.closeButton}
                onPress={controller?.close}
              >
                <IconClose />
              </ButtonView>
            </Action>
          </HeaderView>
          {children}
        </TunnelProvider>
      </PropsContextProvider>
    </Overlay>
  );
});

export default Modal;
