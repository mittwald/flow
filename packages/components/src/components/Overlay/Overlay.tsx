import type { FC, PropsWithChildren, Ref } from "react";
import styles from "./Overlay.module.scss";
import clsx from "clsx";
import type { OverlayController } from "@/lib/controller";
import { useOverlayController } from "@/lib/controller";
import OverlayContextProvider from "@/lib/controller/overlay/OverlayContextProvider";
import type { PropsWithClassName } from "@/lib/types/props";
import OverlayContentView from "@/views/OverlayContentView";

export interface OverlayProps extends PropsWithChildren, PropsWithClassName {
  ref?: Ref<HTMLDivElement>;
  /** The controller to control the overlay state. */
  controller?: OverlayController;
  /** Whether the overlay can be closed by clicking outside of it. */
  isDismissable?: boolean;
  /** Whether the overlay is a modal or a light box. */
  overlayType?: "Modal" | "LightBox";
  isOpen?: boolean;
  /** The controller to show the unsaved changes confirmation modal. */
  unsavedChangesConfirmationController?: OverlayController;
  /** Disables the confirmation dialog when there are unsaved changes. */
  disableUnsavedChangesConfirmation?: boolean;
}

export const Overlay: FC<OverlayProps> = (props) => {
  const {
    controller: controllerFromProps,
    children,
    isDismissable = true,
    className,
    overlayType = "Modal",
    isOpen: isOpenFromProps,
    ref,
    unsavedChangesConfirmationController,
    disableUnsavedChangesConfirmation,
  } = props;

  const controllerFromContext = useOverlayController(overlayType, {
    reuseControllerFromContext: true,
  });

  const controller = controllerFromProps ?? controllerFromContext;

  const isOpen = isOpenFromProps ?? controller.useIsOpen();

  const rootClassName = clsx(styles.overlay, className);

  return (
    <OverlayContentView
      onOpenChange={(isOpen) => {
        if (
          overlayType === "Modal" &&
          controller.confirmUnsavedChanges &&
          !disableUnsavedChangesConfirmation &&
          !isOpen
        ) {
          unsavedChangesConfirmationController?.open();
        } else {
          controller.setOpen(isOpen);
        }
      }}
      isOpen={isOpen}
      ref={ref}
      isDismissable={isDismissable}
      className={rootClassName}
    >
      <OverlayContextProvider type="Modal" controller={controller}>
        {children}
      </OverlayContextProvider>
    </OverlayContentView>
  );
};

export default Overlay;
