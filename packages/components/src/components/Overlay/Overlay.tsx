import type { FC, PropsWithChildren, Ref } from "react";
import styles from "./Overlay.module.scss";
import clsx from "clsx";
import type { OverlayController } from "@/lib/controller";
import { useOverlayController } from "@/lib/controller";
import OverlayContextProvider from "@/lib/controller/overlay/OverlayContextProvider";
import type { PropsWithClassName } from "@/lib/types/props";
import OverlayContentView from "@/views/OverlayContentView";
import type {
  OverlayCloseHandler,
  OverlayOpenHandler,
  OverlayOpenStateHandler,
} from "@/lib/controller/overlay/OverlayController";
import type * as Aria from "react-aria-components";

export interface OverlayProps
  extends
    PropsWithChildren,
    PropsWithClassName,
    Pick<Aria.DialogProps, "aria-labelledby"> {
  ref?: Ref<HTMLDivElement>;
  /** The controller to control the overlay state. */
  controller?: OverlayController;
  /** Whether the overlay can be closed by clicking outside of it. */
  isDismissable?: boolean;
  /** Whether the overlay is a modal or a light box. */
  overlayType?: "Modal" | "LightBox";
  /** Whether the overlay is open. Use it to control the overlay state. */
  isOpen?: boolean;
  /**
   * Whether the overlay is open initially. Use it for an uncontrolled overlay.
   *
   * @default false
   */
  isDefaultOpen?: boolean;
  /** Called when the overlay is opened. */
  onOpen?: OverlayOpenHandler;
  /** Called when the overlay is closed. */
  onClose?: OverlayCloseHandler;
  /** Called with the new open state whenever the overlay is opened or closed. */
  onOpenChange?: OverlayOpenStateHandler;
  /** Whether closing the overlay must be confirmed. */
  confirmOnClose?: boolean;
}

export const Overlay: FC<OverlayProps> = (props) => {
  const {
    controller: controllerFromProps,
    children,
    isDismissable = true,
    className,
    overlayType = "Modal",
    isDefaultOpen,
    isOpen: isOpenFromProps,
    ref,
    "aria-labelledby": ariaLabelledBy,
    ...controllerOptions
  } = props;

  const controllerFromContext = useOverlayController(overlayType, {
    reuseControllerFromContext: true,
    isDefaultOpen,
  });

  const controller = controllerFromProps ?? controllerFromContext;
  controller.useUpdateOptions(controllerOptions);

  const isOpen = isOpenFromProps ?? controller.useIsOpen();

  const rootClassName = clsx(styles.overlay, className);

  return (
    <OverlayContentView
      onOpenChange={controller.setOpen}
      isOpen={isOpen}
      ref={ref}
      isDismissable={isDismissable}
      className={rootClassName}
      aria-labelledby={ariaLabelledBy}
    >
      <OverlayContextProvider type="Modal" controller={controller}>
        {children}
      </OverlayContextProvider>
    </OverlayContentView>
  );
};

export default Overlay;
