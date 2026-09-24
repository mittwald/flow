import type { FC, PropsWithChildren, Ref, RefObject } from "react";
import { useEffect, useId, useRef } from "react";
import clsx from "clsx";
import { useObjectRef, useOverlayPosition } from "react-aria";
import type { Placement } from "react-aria";
import { useEnterAnimation, useExitAnimation } from "@react-aria/utils";
import styles from "../../Popover.module.scss";
import type { PropsWithClassName } from "@/lib/types/props";
import { popoverViewportPadding } from "../../viewportPadding";
import { popoverWidthStyle } from "../../widthStyle";
import { PopoverTip } from "../PopoverTip";

export interface NonModalPopoverContentProps
  extends PropsWithChildren, PropsWithClassName {
  withTip?: boolean;
  isOpen?: boolean;
  width?: string | number;
  placement?: Placement;
  offset?: number;
  crossOffset?: number;
  /** Swallowed on purpose — the stylesheet overrides `max-height` here. */
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

interface NonModalPopoverContentInnerProps extends Omit<
  NonModalPopoverContentProps,
  "ref"
> {
  overlayRef: RefObject<HTMLDivElement | null>;
  isExiting: boolean;
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
  useEffect(() => {
    // Read inside the effect. A coach mark that is open from its first render
    // renders before the anchor's ref is attached, and a ref filling in does not
    // re-render anything — so reading during render would see `null`, bail, and
    // leave nothing observing.
    const anchor = anchorRef.current;

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
  }, [anchorRef, isOpen, updatePosition]);
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
 *
 * Mounting is split across two components for the same reason `Aria.Popover`
 * splits it: the closing animation has to outlive `isOpen`, so the element that
 * plays it cannot be unmounted by the render that closes it. This outer half
 * keeps the ref and the mount decision and survives across open and closed; the
 * inner half holds the positioning and remounts on every open, which is what
 * resets the entry animation.
 */
export const NonModalPopoverContent: FC<NonModalPopoverContentProps> = (
  props,
) => {
  const { isOpen = false, ref, ...rest } = props;

  const overlayRef = useObjectRef(ref as Ref<HTMLDivElement>);

  const isExiting = useExitAnimation(overlayRef, isOpen);

  if (!isOpen && !isExiting) {
    return null;
  }

  return (
    <NonModalPopoverContentInner
      {...rest}
      overlayRef={overlayRef}
      isOpen={isOpen}
      isExiting={isExiting}
    />
  );
};

const NonModalPopoverContentInner: FC<NonModalPopoverContentInnerProps> = (
  props,
) => {
  const {
    children,
    className,
    withTip,
    isOpen = false,
    isExiting,
    width,
    id,
    onOpenChange,
    overlayRef,
    triggerRef,
    // Named one by one so that everything left over is a DOM prop and reaches
    // the element. Funnelling the rest into the positioning instead drops
    // `aria-*`, `data-*` and the like, which `Aria.Popover` forwards on the
    // modal path.
    placement: requestedPlacement,
    offset,
    crossOffset,
    maxHeight: ignoredMaxHeight,
    shouldFlip,
    shouldUpdatePosition,
    arrowBoundaryOffset,
    boundaryElement,
    ...rest
  } = props;

  void ignoredMaxHeight;

  const positionProps = {
    placement: requestedPlacement,
    offset,
    crossOffset,
    shouldFlip,
    shouldUpdatePosition,
    arrowBoundaryOffset,
    boundaryElement,
  };

  const arrowRef = useRef<HTMLDivElement>(null);
  const detailsId = useId();

  const { overlayProps, arrowProps, placement, updatePosition } =
    useOverlayPosition({
      ...positionProps,
      targetRef: triggerRef,
      overlayRef,
      arrowRef,
      isOpen,
      offset: positionProps.offset ?? 8,
      containerPadding: popoverViewportPadding,
    });

  useRepositionWhenAnchorMoves(triggerRef, isOpen, updatePosition);

  /*
   * Until it has a placement, `useOverlayPosition` parks the popover in the top
   * left corner (`position: fixed; top: 0; left: 0`) — it has not measured the
   * anchor yet. Rendered on a server that corner is what ships, and the popover
   * sits there until hydration measures; an anchor given by id is resolved a
   * frame later still. Either way it is visibly in the wrong place first and
   * jumps to the anchor after, so keep it out of sight until it knows where it
   * belongs. It stays in the DOM, which is what its place in the reading order
   * and `aria-details` depend on.
   */
  const isPositioned = placement !== null;

  // Held back until the popover knows where it belongs — an entry animation
  // that plays while the popover is still hidden is one the user never sees.
  const isEntering = useEnterAnimation(overlayRef, isPositioned);

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

  return (
    <div
      {...rest}
      {...overlayProps}
      id={id}
      ref={overlayRef}
      className={clsx(className, styles["non-modal"])}
      data-placement={placement ?? undefined}
      data-entering={isEntering || undefined}
      data-exiting={isExiting || undefined}
      style={{
        ...overlayProps.style,
        /*
         * Two things `useOverlayPosition` adds for an overlay portalled to the
         * end of `<body>` and pinned to the viewport. This one renders where it
         * stands and scrolls with the page, so both are wrong here.
         *
         * `z-index: 100000` would put it in front of the whole application — it
         * scrolled over the docs site's sticky header. Claiming no stacking
         * level leaves that to the page: it still covers the ordinary content
         * around it, and app chrome that sets a `z-index` keeps its place above.
         *
         * The `max-height` it caps the overlay at is wrong here for the same
         * reason, but it is written straight onto the element and has to be
         * undone in CSS — see `.non-modal` in Popover.module.scss.
         */
        zIndex: undefined,
        ...popoverWidthStyle(width),
        ...(isPositioned ? {} : { visibility: "hidden" }),
      }}
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
            // `arrowProps.style` carries the offset along the popover's edge and
            // leaves the other axis `undefined` — which still overwrites. So the
            // edge the tip sits on is set last: spread first, it silently lost
            // `top: 100%` and the tip jumped to the popover's top edge, pointing
            // away from an anchor that was below it.
            ...arrowProps.style,
            ...(placement ? { [placement]: "100%" } : {}),
          }}
        >
          <PopoverTip />
        </div>
      )}
      <div className={styles.content} id={detailsId}>
        {children}
      </div>
    </div>
  );
};

export default NonModalPopoverContent;
