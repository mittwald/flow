import * as Aria from "react-aria-components";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./Overlay.module.scss";
import clsx from "clsx";
import type { OverlayController } from "@/lib/controller";
import { useOverlayController } from "@/lib/controller";
import OverlayContextProvider from "@/lib/controller/overlay/OverlayContextProvider";
import type { PropsWithClassName } from "@/lib/types/props";

export interface OverlayProps extends PropsWithChildren, PropsWithClassName {
  /** The controller to control the overlay state. */
  controller?: OverlayController;
  /** Whether the overlay can be closed by clicking outside of it. */
  isDismissable?: boolean;
  /** Whether the overlay is a modal or a light box. */
  overlayType?: "Modal" | "LightBox";
}

export const Overlay: FC<OverlayProps> = (props) => {
  const {
    controller: controllerFromProps,
    children,
    isDismissable = true,
    className,
    overlayType = "Modal",
  } = props;

  const controllerFromContext = useOverlayController(overlayType, {
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

export default Overlay;
