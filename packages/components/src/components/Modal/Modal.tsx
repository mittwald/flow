import * as Aria from "react-aria-components";
import React, { FC, PropsWithChildren, ReactNode } from "react";
import styles from "./Modal.module.scss";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface ModalProps
  extends PropsWithChildren,
    Omit<Aria.ModalOverlayProps, "children"> {
  size?: "s" | "m" | "l";
}

export const Modal: FC<ModalProps> = (props) => {
  const { children, size = "s", ...rest } = props;

  const rootClassName = clsx(styles.modal, styles[`size-${size}`]);

  const propsContext: PropsContext = {
    Content: {
      className: styles.content,
    },
    ButtonGroup: {
      className: styles.buttonGroup,
    },
  };

  return (
    <Aria.ModalOverlay className={styles.overlay} {...rest}>
      <Aria.Modal className={rootClassName}>
        <Aria.Dialog>
          <PropsContextProvider props={propsContext}>
            {children}
          </PropsContextProvider>
        </Aria.Dialog>
      </Aria.Modal>
    </Aria.ModalOverlay>
  );
};

export default Modal;
