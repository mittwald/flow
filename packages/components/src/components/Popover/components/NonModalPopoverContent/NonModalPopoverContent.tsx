import type { FC, PropsWithChildren, Ref, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { useObjectRef, useOverlayPosition } from "react-aria";
import type { Placement } from "react-aria";
import styles from "../../Popover.module.scss";
import type { PropsWithClassName } from "@/lib/types/props";

export interface NonModalPopoverContentProps
  extends PropsWithChildren, PropsWithClassName {
  withTip?: boolean;
  isOpen?: boolean;
  width?: string | number;
  placement?: Placement;
  offset?: number;
  crossOffset?: number;
  maxHeight?: number;
  shouldFlip?: boolean;
  shouldUpdatePosition?: boolean;
  arrowBoundaryOffset?: number;
  boundaryElement?: Element;
  onOpenChange: (isOpen: boolean) => void;
  ref?: Ref<HTMLElement>;
  triggerRef: RefObject<Element | null>;
}

/*
 * The non-modal popover deliberately skips react-aria's `usePopover`, which is
 * what a popover normally builds on. That hook couples three things Flow does
 * not want here: it locks page scrolling, it hides the rest of the page from
 * assistive tech, and — the reason this component exists — it closes the
 * popover on the first scroll, with no way to opt out.
 *
 * What is left is `useOverlayPosition` for the anchoring, public react-aria API.
 * The popover therefore tracks its trigger while the page scrolls, and its
 * content stays plain content: no role, no label, no focus of its own.
 *
 * It is not portalled either. A popover that is announced by nothing has to be
 * findable where it belongs, and a portal to the end of `<body>` puts it behind
 * the whole page in reading order — so it renders where it was written, right
 * next to what it points at. Being absolutely positioned it still takes no
 * space; what it does inherit is its surroundings, so an ancestor that clips
 * (`overflow: hidden`) or a stacking context can cut it off.
 */
export const NonModalPopoverContent: FC<NonModalPopoverContentProps> = (
  props,
) => {
  const {
    children,
    className,
    withTip,
    isOpen = false,
    width,
    onOpenChange,
    ref,
    triggerRef,
    ...positionProps
  } = props;

  const overlayRef = useObjectRef(ref as Ref<HTMLDivElement>);
  const arrowRef = useRef<HTMLDivElement>(null);
  const [isEntering, setIsEntering] = useState(true);

  const { overlayProps, arrowProps, placement } = useOverlayPosition({
    ...positionProps,
    targetRef: triggerRef,
    overlayRef,
    arrowRef,
    isOpen,
    offset: positionProps.offset ?? 8,
    containerPadding: 16,
  });

  // Escape closes it. react-aria would do this through `useOverlay`, which is
  // part of the machinery this component leaves out.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    if (!isOpen) {
      setIsEntering(true);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      {...overlayProps}
      ref={overlayRef}
      className={className}
      data-placement={placement ?? undefined}
      data-entering={isEntering || undefined}
      onAnimationEnd={() => setIsEntering(false)}
      style={{ ...overlayProps.style, width }}
    >
      {withTip && (
        <div
          {...arrowProps}
          ref={arrowRef}
          className={styles.tip}
          data-placement={placement ?? undefined}
          style={{
            // What <Aria.OverlayArrow /> contributes on top of `arrowProps`:
            // it lifts the tip out of the flow and centres it on the anchor.
            position: "absolute",
            transform:
              placement === "top" || placement === "bottom"
                ? "translateX(-50%)"
                : "translateY(-50%)",
            ...(placement ? { [placement]: "100%" } : {}),
            ...arrowProps.style,
          }}
        >
          <svg width={16} height={16} viewBox="0 0 16 16">
            <path d="M0 0 L8 8 L16 0" />
          </svg>
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default NonModalPopoverContent;
