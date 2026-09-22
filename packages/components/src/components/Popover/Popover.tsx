import { type PropsWithChildren, useCallback, useEffect } from "react";
import type * as Aria from "react-aria-components";
import clsx from "clsx";
import { type OverlayController, useOverlayController } from "@/lib/controller";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import OverlayContextProvider from "@/lib/controller/overlay/OverlayContextProvider";
import { useWarnDeprecation } from "@/components/DeprecationWarningProvider";
import styles from "./Popover.module.scss";
import PopoverContentView from "@/views/PopoverContentView";

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
   * @internal How the popover relates to the rest of the page. `"modal"` locks
   * the page below — scrolling blocked, everything outside `inert`, focus moved
   * in, and the popover a `dialog`. `"non-modal"` leaves the page alone: no
   * dialog semantics, and rendered where it stands instead of portalled to the
   * end of the body, so it keeps its place in the reading order. Not a variant
   * to pick — it is the shape `CoachMark` needs, and that component sets it.
   */
  modality?: "modal" | "non-modal";
  /** An overlay controller to control the popover state. */
  controller?: OverlayController;
  /** A fixed width for the popover. */
  width?: string | number;
  /**
   * Whether the popover is open. Use it to control the popover state – then
   * `onOpenChange` must update the state this value comes from.
   */
  isOpen?: boolean;
  /**
   * Whether the popover is open initially. Use it for an uncontrolled popover.
   *
   * @default false
   */
  isDefaultOpen?: boolean;
  /** @deprecated Use `isDefaultOpen` instead. */
  defaultOpen?: boolean;
  /**
   * Called with the new open state whenever the popover is opened or closed –
   * on every path, including a close triggered through the controller. It only
   * reports the change; it never performs or suppresses it.
   */
  onOpenChange?: (isOpen: boolean) => void;
}

export const Popover = flowComponent("Popover", (props) => {
  const {
    children,
    className,
    controller: controllerFromProps,
    onOpenChange: onOpenChangeFromProps,
    isOpen: isOpenFromProps,
    isDefaultOpen,
    defaultOpen,
    ...contentProps
  } = props;

  const warnDeprecation = useWarnDeprecation();

  if (defaultOpen !== undefined) {
    warnDeprecation(
      "The 'defaultOpen' prop is deprecated and will be removed in a future release. Use 'isDefaultOpen' instead.",
    );
  }

  const controllerFromContext = useOverlayController("Popover", {
    reuseControllerFromContext: true,
    isDefaultOpen: isDefaultOpen ?? defaultOpen ?? false,
  });

  const controller = controllerFromProps ?? controllerFromContext;

  // The return value is dropped on purpose – the prop is typed to return
  // nothing and must not gain a controller handler's abort semantics.
  const notifyOpenChange = useCallback(
    (isOpen: boolean) => {
      onOpenChangeFromProps?.(isOpen);
    },
    [onOpenChangeFromProps],
  );

  controller.useUpdateOptions({ onOpenChange: notifyOpenChange });

  const isOpen = controller.useIsOpen();

  useEffect(() => {
    if (isOpenFromProps !== undefined && isOpenFromProps !== isOpen) {
      controller.syncOpen(isOpenFromProps);
    }
  }, [controller, isOpenFromProps, isOpen]);

  const rootClassName = clsx(styles.popover, className);

  return (
    <PopoverContentView
      {...contentProps}
      className={rootClassName}
      isOpen={isOpen}
      onOpenChange={controller.setOpen}
    >
      <OverlayContextProvider type="Popover" controller={controller}>
        {children}
      </OverlayContextProvider>
    </PopoverContentView>
  );
});

export default Popover;
