import type { PropsWithChildren } from "react";
import type * as Aria from "react-aria-components";
import clsx from "clsx";
import { type OverlayController, useOverlayController } from "@/lib/controller";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import OverlayContextProvider from "@/lib/controller/overlay/OverlayContextProvider";
import styles from "./Popover.module.scss";
import PopoverContentView from "@/views/PopoverContentView";
import ClearPropsContextView from "@/views/ClearPropsContextView";

export interface PopoverProps
  extends PropsWithChildren<Omit<Aria.PopoverProps, "children">>,
    FlowComponentProps {
  /**
   * Whether the popover should display a tip, pointing towards the trigger
   * element.
   */
  withTip?: boolean;
  /** Whether the popover contains a dialog. */
  isDialogContent?: boolean;
  /** An overlay controller to control the popover state. */
  controller?: OverlayController;
  /** A fixed width for the popover. */
  width?: string | number;
}

export const Popover = flowComponent("Popover", (props) => {
  const {
    children,
    className,
    controller: controllerFromProps,
    defaultOpen = false,
    ref,
    ...contentProps
  } = props;

  const controllerFromContext = useOverlayController("Popover", {
    reuseControllerFromContext: true,
    isDefaultOpen: defaultOpen,
  });

  const controller = controllerFromProps ?? controllerFromContext;
  const isOpen = controller.useIsOpen();

  const rootClassName = clsx(styles.popover, className);

  return (
    <ClearPropsContextView>
      <PopoverContentView
        {...contentProps}
        className={rootClassName}
        isOpen={isOpen}
        onOpenChange={(isOpen) => controller.setOpen(isOpen)}
        ref={ref}
      >
        <OverlayContextProvider type="Popover" controller={controller}>
          {children}
        </OverlayContextProvider>
      </PopoverContentView>
    </ClearPropsContextView>
  );
});

export default Popover;
