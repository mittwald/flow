import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./Modal.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import type { OverlayState } from "@/lib/controller/overlay";
import { useOverlayState } from "@/lib/controller/overlay/useOverlayState";
import Overlay from "@/components/Overlay/Overlay";
import { useSyncTriggerState } from "@/components/Overlay/hooks/useSyncTriggerState";

export interface ModalProps extends PropsWithChildren {
  /** @default "s" */
  size?: "s" | "m" | "l";
  offCanvas?: boolean;
  state?: OverlayState;
  defaultOpen?: boolean;
}

export const Modal: FC<ModalProps> = (props) => {
  const {
    size = "s",
    offCanvas,
    state: stateFromProps,
    defaultOpen,
    children,
  } = props;

  const newState = useOverlayState({
    reuseControllerFromContext: false,
    defaultOpen,
  });

  const state = stateFromProps ?? newState;

  useSyncTriggerState(state);

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
    <Overlay state={state} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          <div className={styles.content}>{children}</div>
          <TunnelExit id="buttons" />
        </TunnelProvider>
      </PropsContextProvider>
    </Overlay>
  );
};

export default Modal;
