import * as Aria from "react-aria-components";
import React, { FC, useContext } from "react";
import styles from "./Modal.module.scss";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";

export interface ModalProps
  extends Pick<Aria.DialogProps, "children">,
    Omit<Aria.ModalOverlayProps, "children"> {
  size?: "s" | "m" | "l";
  panel?: boolean;
}

export const Modal: FC<ModalProps> = (props) => {
  const { size = "s", panel, ...rest } = props;

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

  const state = useContext(Aria.OverlayTriggerStateContext);

  let children = props.children;
  if (typeof children === "function") {
    children = children({
      close: state?.close || (() => {}),
    });
  }

  return (
    <Aria.ModalOverlay className={styles.overlay} {...rest} isDismissable>
      <Aria.Modal className={rootClassName}>
        <Aria.Dialog className={styles.dialog}>
          <PropsContextProvider props={propsContext}>
            <TunnelProvider>
              <div className={styles.content}>
                <TunnelExit id="title" />
                <TunnelExit id="content" />
              </div>
              {children}
            </TunnelProvider>
          </PropsContextProvider>
        </Aria.Dialog>
      </Aria.Modal>
    </Aria.ModalOverlay>
  );
};

export default Modal;
