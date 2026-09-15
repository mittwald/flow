import { type PropsWithChildren } from "react";
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

/**
 * How a popover relates to the rest of the page.
 *
 * - `"modal"` – the page below is locked: scrolling is blocked, everything
 *   outside the popover is `inert`, and focus moves into the popover, which is
 *   a `dialog`.
 * - `"non-modal"` – the page stays scrollable and interactive. The popover
 *   carries no dialog semantics: no role, no label, no focus. Its content is
 *   plain content, read in document order like everything else.
 */
export type PopoverModality = "modal" | "non-modal";

export interface PopoverProps
  extends
    PropsWithChildren<Omit<Aria.PopoverProps, "children" | "ref">>,
    FlowComponentProps<HTMLDivElement> {
  /**
   * Whether the popover should display a tip, pointing towards the trigger
   * element.
   */
  withTip?: boolean;
  /** Whether the popover contains a dialog. */
  isDialogContent?: boolean;
  /**
   * How the popover relates to the rest of the page. Use `"non-modal"` for a
   * popover the user did not ask for – it must not take the page hostage.
   * Nothing announces a non-modal popover, so it needs content that stands on
   * its own where it is found. @default "modal"
   */
  modality?: PopoverModality;
  /**
   * React-aria's own non-modal popover: it neither locks the page nor carries
   * dialog semantics, but it closes on the first scroll. Meant for a list of
   * suggestions that hangs off a field, not for standalone content – reach for
   * `modality` instead. @internal
   */
  isNonModal?: boolean;
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
    onOpenChange: onOpenChangeFromProps,
    defaultOpen = false,
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
    <PopoverContentView
      {...contentProps}
      className={rootClassName}
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        if (!onOpenChangeFromProps) {
          controller.setOpen(isOpen);
        } else {
          onOpenChangeFromProps(isOpen);
        }
      }}
    >
      <OverlayContextProvider type="Popover" controller={controller}>
        {children}
      </OverlayContextProvider>
    </PopoverContentView>
  );
});

export default Popover;
