import * as Aria from "react-aria-components";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./ModalOverlay.module.scss";
import clsx from "clsx";
import type { OverlayController } from "@/lib/controller";
import { useOverlayController } from "@/lib/controller";
import OverlayContextProvider from "@/lib/controller/overlay/OverlayContextProvider";

export interface ModalOverlayProps extends PropsWithChildren {
  controller?: OverlayController;
  isDismissable?: boolean;
  className?: string;
}

export const ModalOverlay: FC<ModalOverlayProps> = (props) => {
  const {
    controller: controllerFromProps,
    children,
    isDismissable = true,
    className,
  } = props;

  const controllerFromContext = useOverlayController("Modal", {
    reuseControllerFromContext: true,
  });

  const controller = controllerFromProps ?? controllerFromContext;

  const isOpen = controller.useIsOpen();

  const rootClassName = clsx(styles.overlay, className);

  return (
    <Aria.ModalOverlay
      className={rootClassName}
      isDismissable={isDismissable}
      isOpen={isOpen}
      onOpenChange={(isOpen) => controller.setOpen(isOpen)}
    >
      <Aria.Modal>
        <Aria.Dialog>
          <OverlayContextProvider type="Modal" controller={controller}>
            {children}
          </OverlayContextProvider>
        </Aria.Dialog>
      </Aria.Modal>
    </Aria.ModalOverlay>
  );
};

export default ModalOverlay;
