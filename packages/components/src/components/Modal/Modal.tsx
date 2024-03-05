import * as Aria from "react-aria-components";
import React, { FC, useContext } from "react";
import styles from "./Modal.module.scss";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface ModalProps
  extends Pick<Aria.DialogProps, "children">,
    Omit<Aria.ModalOverlayProps, "children"> {
  size?: "s" | "m" | "l";
  panel?: boolean;
}

// ToDo: title slot

export const Modal: FC<ModalProps> = (props) => {
  const { size = "s", panel, ...rest } = props;

  const rootClassName = clsx(
    styles.modal,
    styles[`size-${size}`],
    panel && styles.panel,
  );

  const propsContext: PropsContext = {
    Content: {
      className: styles.content,
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
            {children}
          </PropsContextProvider>
        </Aria.Dialog>
      </Aria.Modal>
    </Aria.ModalOverlay>
  );
};

export default Modal;
