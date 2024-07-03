import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Popover.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { type OverlayController, useOverlayController } from "@/lib/controller";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import OverlayContextProvider from "@/lib/controller/overlay/OverlayContextProvider";

export interface PopoverProps
  extends PropsWithChildren<Omit<Aria.PopoverProps, "children">> {
  withTip?: boolean;
  controller?: OverlayController;
}

export const Popover = flowComponent("Popover", (props) => {
  const {
    children,
    className,
    controller: controllerFromProps,
    withTip,
    refProp: ref,
    defaultOpen = false,
    ...rest
  } = props;

  const controllerFromContext = useOverlayController("Popover", {
    reuseControllerFromContext: true,
    defaultOpen,
  });

  const controller = controllerFromProps ?? controllerFromContext;
  const isOpen = controller.useIsOpen();

  const rootClassName = clsx(styles.popover, className);

  return (
    <Aria.Popover
      {...rest}
      className={rootClassName}
      containerPadding={16}
      ref={ref}
      isOpen={isOpen}
      onOpenChange={(isOpen) => controller.setOpen(isOpen)}
    >
      {withTip && (
        <Aria.OverlayArrow className={styles.tip}>
          <svg width={16} height={16} viewBox="0 0 16 16">
            <path d="M0 0 L8 8 L16 0" />
          </svg>
        </Aria.OverlayArrow>
      )}
      <Aria.Dialog className={styles.content}>
        <OverlayContextProvider type="Popover" controller={controller}>
          {children}
        </OverlayContextProvider>
      </Aria.Dialog>
    </Aria.Popover>
  );
});

export default Popover;
