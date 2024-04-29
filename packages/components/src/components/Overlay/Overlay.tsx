import * as Aria from "react-aria-components";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./Overlay.module.scss";
import clsx from "clsx";
import { OverlayContextProvider } from "@/lib/controller/overlay/context";
import { useSyncTriggerState } from "@/components/Overlay/hooks/useSyncTriggerState";
import type { OverlayController } from "@/lib/controller";

export interface OverlayProps extends PropsWithChildren {
  controller: OverlayController;
  className?: string;
}

export const Overlay: FC<OverlayProps> = (props) => {
  const { controller, children, className } = props;

  const isOpen = controller.useIsOpen();

  useSyncTriggerState(controller);

  const rootClassName = clsx(styles.overlay, className);

  return (
    <Aria.ModalOverlay
      className={rootClassName}
      isDismissable
      isOpen={isOpen}
      onOpenChange={(isOpen) => controller.setOpen(isOpen)}
    >
      <Aria.Modal>
        <Aria.Dialog>
          <OverlayContextProvider value={controller}>
            {children}
          </OverlayContextProvider>
        </Aria.Dialog>
      </Aria.Modal>
    </Aria.ModalOverlay>
  );
};

export default Overlay;
