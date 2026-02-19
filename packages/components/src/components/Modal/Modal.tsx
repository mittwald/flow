import { Suspense, type ReactNode } from "react";
import styles from "./Modal.module.scss";
import clsx from "clsx";
import {
  dynamic,
  type PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import { OverlayController } from "@/lib/controller/overlay";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { Overlay, type OverlayProps } from "@/components/Overlay/Overlay";
import { Action } from "@/components/Action";
import { IconClose } from "@/components/Icon/components/icons";
import type { PropsWithClassName } from "@/lib/types/props";
import ButtonView from "@/views/ButtonView";
import { OffCanvasSuspenseFallback } from "@/components/Modal/components/OffCanvasSuspenseFallback";
import Wrap from "@/components/Wrap";
import { ClearPropsContext } from "@/components/ClearPropsContext/ClearPropsContext";
import {
  Render,
  type PropsWithRenderChildren,
} from "@/lib/react/components/Render";

type SupportedOverlayProps = Pick<
  OverlayProps,
  "isOpen" | "isDefaultOpen" | "onOpen" | "onClose" | "onOpenChange"
>;

export interface ModalProps
  extends
    PropsWithRenderChildren<{ controller: OverlayController }>,
    FlowComponentProps,
    PropsWithClassName,
    SupportedOverlayProps {
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
    ...overlayProps
  } = props;

  const rootClassName = clsx(
    offCanvas ? styles.offCanvas : styles.modal,
    styles[`size-${size}`],
    offCanvasOrientation === "left" && styles["left"],
    className,
  );

  const header = (children: ReactNode) => (
    <>
      {children}
      <Action closeModal={{ bypassConfirmation: true }}>
        <ButtonView variant="plain" color="secondary">
          <IconClose />
        </ButtonView>
      </Action>
    </>
  );

  const nestedHeadingLevel = 3;

  const nestedHeadingProps: PropsContext = {
    Heading: { level: nestedHeadingLevel },
    Section: {
      Header: { Heading: { level: nestedHeadingLevel } },
      Heading: { level: nestedHeadingLevel },
    },
    Header: { Heading: { level: nestedHeadingLevel } },
  };

  const propsContext: PropsContext = {
    Content: {
      ...nestedHeadingProps,
      className: styles.content,
    },
    ColumnLayout: {
      ...nestedHeadingProps,
      l: [2, 1],
      m: [1],
      className: styles.columnLayout,
      AccentBox: { className: styles.accentBox, color: "neutral" },
      wrapWith: <ClearPropsContext />,
    },
    Heading: {
      className: styles.header,
      level: 2,
      slot: "title",
      children: dynamic((props) => header(props.children)),
    },
    ActionGroup: {
      className: styles.actionGroup,
      spacing: "m",
      Action: {
        closeModal: dynamic((props) => {
          if (props.closeModal === undefined) {
            return;
          }
          if (props.closeModal === true) {
            return { bypassConfirmation: true };
          }
          return {
            bypassConfirmation: true,
            ...props.closeModal,
          };
        }),
        closeOverlay: dynamic((props) => {
          if (props.closeOverlay === undefined) {
            return;
          }
          if (
            props.closeOverlay instanceof OverlayController ||
            typeof props.closeOverlay === "string"
          ) {
            return {
              bypassConfirmation: true,
              overlay: props.closeOverlay,
            };
          }
          return {
            bypassConfirmation: true,
            ...props.closeOverlay,
          };
        }),
      },
    },
  };

  return (
    <Overlay
      className={rootClassName}
      controller={controller}
      ref={ref}
      {...overlayProps}
    >
      {(p) => (
        <PropsContextProvider props={propsContext}>
          <Wrap if={offCanvas}>
            <Suspense fallback={<OffCanvasSuspenseFallback />}>
              <Render renderProps={p}>{children}</Render>
            </Suspense>
          </Wrap>
        </PropsContextProvider>
      )}
    </Overlay>
  );
});

export default Modal;
