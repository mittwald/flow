import type { FC, PropsWithChildren, Ref, RefObject } from "react";
import { useContext } from "react";
import * as Aria from "react-aria-components";
import styles from "../../Popover.module.scss";
import type { PropsWithClassName } from "@/lib/types/props";
import { useIsActivityActive } from "@/components/Activity/context";
import { NonModalPopoverContent } from "../NonModalPopoverContent";
import { popoverViewportPadding } from "../../viewportPadding";

export interface PopoverContentProps
  extends PropsWithChildren, PropsWithClassName {
  withTip?: boolean;
  isDialogContent?: boolean;
  isOpen?: boolean;
  width?: string | number;
  /** @internal Set by `CoachMark`; see `PopoverProps`. */
  modality?: "modal" | "non-modal";
  onOpenChange: (isOpen: boolean) => void;
  ref?: Ref<HTMLElement>;
  triggerRef?: RefObject<Element | null>;
}

/**
 * @flr-generate all
 * @flr-ignore-props modality
 */
export const PopoverContent: FC<PopoverContentProps> = (props) => {
  const {
    children,
    className,
    isDialogContent = false,
    withTip,
    onOpenChange,
    ref,
    isOpen,
    width,
    modality,
    ...rest
  } = props;

  const isActivityActive = useIsActivityActive();

  // A trigger hands its popover a ref through the context react-aria sets up,
  // and the non-modal popover has to anchor itself with it.
  const popoverContext = useContext(Aria.PopoverContext);
  const triggerRefFromContext =
    popoverContext && "triggerRef" in popoverContext
      ? popoverContext.triggerRef
      : undefined;

  // The trigger points its `aria-controls` at this id while the popover is
  // open, so the popover has to carry it — react-aria's own only applies it
  // when the popover is a dialog.
  const idFromContext =
    popoverContext && "id" in popoverContext ? popoverContext.id : undefined;

  const ContentComponent = isDialogContent ? Aria.Dialog : "div";

  if (!isActivityActive) {
    return null;
  }

  if (modality === "non-modal") {
    const anchor = rest.triggerRef ?? triggerRefFromContext;

    // Without an anchor there is nothing to position against. react-aria's own
    // popover has the same requirement; it just throws further in.
    if (!anchor) {
      return null;
    }

    return (
      <NonModalPopoverContent
        {...rest}
        className={className}
        ref={ref}
        isOpen={isOpen}
        width={width}
        withTip={withTip}
        id={idFromContext}
        triggerRef={anchor}
        onOpenChange={onOpenChange}
      >
        {children}
      </NonModalPopoverContent>
    );
  }

  return (
    <Aria.Popover
      {...rest}
      className={className}
      containerPadding={popoverViewportPadding}
      ref={ref}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      style={{ width }}
    >
      {withTip && (
        <Aria.OverlayArrow className={styles.tip}>
          <svg width={16} height={16} viewBox="0 0 16 16">
            <path d="M0 0 L8 8 L16 0" />
          </svg>
        </Aria.OverlayArrow>
      )}
      <ContentComponent className={styles.content}>{children}</ContentComponent>
    </Aria.Popover>
  );
};

export default PopoverContent;
