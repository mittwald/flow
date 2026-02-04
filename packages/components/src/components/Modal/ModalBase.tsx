import { type ReactNode, Suspense } from "react";
import styles from "./Modal.module.scss";
import clsx from "clsx";
import {
  dynamic,
  type PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { Overlay } from "@/components/Overlay/Overlay";
import { Action } from "@/components/Action";
import { IconClose } from "@/components/Icon/components/icons";
import ButtonView from "@/views/ButtonView";
import { OffCanvasSuspenseFallback } from "@/components/Modal/components/OffCanvasSuspenseFallback";
import Wrap from "@/components/Wrap";
import { ClearPropsContext } from "@/components/ClearPropsContext/ClearPropsContext";
import type { OverlayController } from "@/lib/controller";
import type { ModalProps } from "@/components/Modal/Modal";

export interface ModalBaseProps extends ModalProps {
  /** The controller to show the unsaved changes confirmation modal. */
  unsavedChangesConfirmationController?: OverlayController;
}

export const ModalBase = flowComponent("ModalBase", (props) => {
  const {
    size = "s",
    offCanvas,
    controller,
    children,
    ref,
    className,
    offCanvasOrientation = "right",
    unsavedChangesConfirmationController,
    disableUnsavedChangesConfirmation,
    ...rest
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
      <Action closeOverlay="Modal">
        <ButtonView
          variant="plain"
          color="secondary"
          onPress={controller?.close}
        >
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
    },
  };

  return (
    <>
      <Overlay
        className={rootClassName}
        controller={controller}
        ref={ref}
        unsavedChangesConfirmationController={
          unsavedChangesConfirmationController
        }
        disableUnsavedChangesConfirmation={disableUnsavedChangesConfirmation}
        {...rest}
      >
        <PropsContextProvider props={propsContext}>
          <Wrap if={offCanvas}>
            <Suspense fallback={<OffCanvasSuspenseFallback />}>
              {children}
            </Suspense>
          </Wrap>
        </PropsContextProvider>
      </Overlay>
    </>
  );
});

export default ModalBase;
