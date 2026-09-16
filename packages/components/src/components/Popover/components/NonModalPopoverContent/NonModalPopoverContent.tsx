import type { FC, PropsWithChildren, Ref, RefObject } from "react";
import { useEffect, useId, useRef, useState } from "react";
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
  /** The id react-aria's trigger points its `aria-controls` at. */
  id?: string;
  onOpenChange: (isOpen: boolean) => void;
  ref?: Ref<HTMLElement>;
  triggerRef: RefObject<Element | null>;
}

/*
 * `useOverlayPosition` recalculates when the window resizes, when a scroll
 * container scrolls, and when the anchor or the popover changes *size*. It never
 * notices the anchor merely *moving*, because a popover normally opens on a user
 * interaction, long after the page settled.
 *
 * This one opens itself, so it places itself into a page that is still filling
 * in — and anything appearing above the anchor then pushes the anchor out from
 * under it. Remotely that is the normal case, not an edge case: the host
 * materializes the page in pieces as they arrive over the connection.
 *
 * Observing the ancestors covers it. In block layout an element moves because
 * something around it changed size, and a resized ancestor is the one signal
 * every such reflow has in common. What it does not catch is an ancestor of
 * fixed height rearranging inside — rare, and the next scroll or resize
 * corrects it.
 */
const useRepositionWhenAnchorMoves = (
  anchorRef: RefObject<Element | null>,
  isOpen: boolean,
  updatePosition: () => void,
): void => {
  const anchor = anchorRef.current;

  useEffect(() => {
    if (!isOpen || !anchor) {
      return;
    }

    const observer = new ResizeObserver(updatePosition);

    for (
      let element = anchor.parentElement;
      element;
      element = element.parentElement
    ) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [anchor, isOpen, updatePosition]);
};

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
    id,
    onOpenChange,
    ref,
    triggerRef,
    ...positionProps
  } = props;

  const overlayRef = useObjectRef(ref as Ref<HTMLDivElement>);
  const arrowRef = useRef<HTMLDivElement>(null);
  const [isEntering, setIsEntering] = useState(true);
  const detailsId = useId();

  const { overlayProps, arrowProps, placement, updatePosition } =
    useOverlayPosition({
      ...positionProps,
      targetRef: triggerRef,
      overlayRef,
      arrowRef,
      isOpen,
      offset: positionProps.offset ?? 8,
      containerPadding: 16,
    });

  useRepositionWhenAnchorMoves(triggerRef, isOpen, updatePosition);

  /*
   * Nothing announces this popover, so the trigger points at it: `aria-details`
   * tells assistive tech that there is related content and offers a way over to
   * it — unlike `aria-describedby`, which would flatten the popover into a
   * string and put its buttons out of reach.
   *
   * Set on the trigger element itself, because that element belongs to whoever
   * rendered it. Whatever it carried before is restored on the way out.
   */
  useEffect(() => {
    const trigger = triggerRef.current;

    if (!isOpen || !trigger) {
      return;
    }

    const previous = trigger.getAttribute("aria-details");
    trigger.setAttribute(
      "aria-details",
      previous ? `${previous} ${detailsId}` : detailsId,
    );

    return () => {
      if (previous === null) {
        trigger.removeAttribute("aria-details");
      } else {
        trigger.setAttribute("aria-details", previous);
      }
    };
  }, [isOpen, triggerRef, detailsId]);

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
      id={id}
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
      <div className={styles.content} id={detailsId}>
        {children}
      </div>
    </div>
  );
};

export default NonModalPopoverContent;
