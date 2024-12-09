import type { PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { type OverlayController, useOverlayController } from "@/lib/controller";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import OverlayContextProvider from "@/lib/controller/overlay/OverlayContextProvider";
import styles from "./Popover.module.scss";

export interface PopoverProps
  extends PropsWithChildren<Omit<Aria.PopoverProps, "children">> {
  withTip?: boolean;
  isDialogContent?: boolean;
  controller?: OverlayController;
  width?: string | number;
  /** @default "m" */
  padding?: "s" | "m";
}

export const Popover = flowComponent("Popover", (props) => {
  const {
    children,
    className,
    isDialogContent = false,
    controller: controllerFromProps,
    withTip,
    refProp: ref,
    defaultOpen = false,
    width,
    padding = "m",
    ...rest
  } = props;

  const controllerFromContext = useOverlayController("Popover", {
    reuseControllerFromContext: true,
    isDefaultOpen: defaultOpen,
  });

  const controller = controllerFromProps ?? controllerFromContext;
  const isOpen = controller.useIsOpen();

  const rootClassName = clsx(styles.popover, className);

  const ContentComponent = isDialogContent ? Aria.Dialog : "div";

  return (
    <Aria.Popover
      {...rest}
      className={rootClassName}
      containerPadding={16}
      ref={ref}
      isOpen={isOpen}
      onOpenChange={(isOpen) => controller.setOpen(isOpen)}
      style={{ width }}
    >
      {withTip && (
        <Aria.OverlayArrow className={styles.tip}>
          <svg width={16} height={16} viewBox="0 0 16 16">
            <path d="M0 0 L8 8 L16 0" />
          </svg>
        </Aria.OverlayArrow>
      )}
      <ContentComponent
        className={clsx(
          styles.content,
          padding && styles[`padding-${padding}`],
        )}
      >
        <OverlayContextProvider type="Popover" controller={controller}>
          {children}
        </OverlayContextProvider>
      </ContentComponent>
    </Aria.Popover>
  );
});

export default Popover;
