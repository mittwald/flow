import * as Aria from "react-aria-components";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./OffCanvas.module.scss";
import clsx from "clsx";
import type { OverlayState } from "@/lib/controller/overlay";
import { useOverlayState } from "@/lib/controller/overlay/useOverlayState";
import { useSyncTriggerState } from "@/lib/hooks/overlay/useSyncTriggerState";
import { OverlayContextProvider } from "@/lib/controller/overlay/context";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";

export interface OffCanvasProps extends PropsWithChildren {
  state?: OverlayState;
  defaultOpen?: boolean;
  className?: string;
}

export const OffCanvas: FC<OffCanvasProps> = (props) => {
  const { state: stateFromProps, defaultOpen, children, className } = props;

  const newState = useOverlayState({
    reuseControllerFromContext: false,
    defaultOpen,
  });

  const state = stateFromProps ?? newState;
  const isOpen = state.useIsOpen();

  useSyncTriggerState(state);

  const rootClassName = clsx(styles.offCanvas, className);

  const propsContext: PropsContext = {
    Link: {
      onPress: () => state.close(),
    },
  };

  return (
    <Aria.ModalOverlay
      className={styles.overlay}
      isDismissable
      isOpen={isOpen}
      onOpenChange={(isOpen) => state.setOpen(isOpen)}
    >
      <Aria.Modal className={rootClassName}>
        <Aria.Dialog className={styles.dialog}>
          <OverlayContextProvider value={state}>
            <PropsContextProvider props={propsContext} dependencies={[state]}>
              <Button
                onPress={() => state.close()}
                style="plain"
                size="s"
                variant="secondary"
                className={styles.closeButton}
              >
                <IconClose />
              </Button>
              {children}
            </PropsContextProvider>
          </OverlayContextProvider>
        </Aria.Dialog>
      </Aria.Modal>
    </Aria.ModalOverlay>
  );
};

export default OffCanvas;
