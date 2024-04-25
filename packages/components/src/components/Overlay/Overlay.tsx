import * as Aria from "react-aria-components";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./Overlay.module.scss";
import clsx from "clsx";
import type { OverlayState } from "@/lib/controller/overlay";
import { OverlayContextProvider } from "@/lib/controller/overlay/context";
import { useSyncTriggerState } from "@/components/Overlay/hooks/useSyncTriggerState";

export interface OverlayProps extends PropsWithChildren {
  state: OverlayState;
  className?: string;
}

export const Overlay: FC<OverlayProps> = (props) => {
  const { state, children, className } = props;

  const isOpen = state.useIsOpen();

  useSyncTriggerState(state);

  const rootClassName = clsx(styles.overlay, className);

  return (
    <Aria.ModalOverlay
      className={rootClassName}
      isDismissable
      isOpen={isOpen}
      onOpenChange={(isOpen) => state.setOpen(isOpen)}
    >
      <Aria.Modal>
        <Aria.Dialog>
          <OverlayContextProvider value={state}>
            {children}
          </OverlayContextProvider>
        </Aria.Dialog>
      </Aria.Modal>
    </Aria.ModalOverlay>
  );
};

export default Overlay;
