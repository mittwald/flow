import * as Aria from "react-aria-components";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./Modal.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import type { OverlayState } from "@/lib/controller/overlay";
import { useOverlayState } from "@/lib/controller/overlay/useOverlayState";
import { useSyncTriggerState } from "@/components/Modal/hooks/useSyncTriggerState";
import { OverlayContextProvider } from "@/lib/controller/overlay/context";

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
    ...rest
  } = props;

  const newState = useOverlayState({
    reuseControllerFromContext: false,
    defaultOpen,
  });

  const state = stateFromProps ?? newState;
  const isOpen = state.useIsOpen();

  useSyncTriggerState(state);

  const rootClassName = clsx(
    styles.modal,
    styles[`size-${size}`],
    offCanvas && styles.offCanvas,
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
      onOpenChange={(isOpen) => state.setOpen(isOpen)}
    >
      <Aria.Modal className={rootClassName}>
        <Aria.Dialog className={styles.dialog}>
          <OverlayContextProvider value={state}>
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
