import type { RefObject } from "react";
import { useEffect, useMemo, useState } from "react";
import type { PopoverProps } from "@/components/Popover/Popover";
import { Popover } from "@/components/Popover/Popover";
import styles from "./CoachMark.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useOverlayController } from "@/lib/controller";
import OverlayContextProvider from "@/lib/controller/overlay/OverlayContextProvider";

export interface CoachMarkProps extends Omit<
  PopoverProps,
  // The popover's own shape, which a coach mark decides for itself.
  | "withTip"
  | "modality"
  // react-aria's own non-modal switch, which would compete with the shape this
  // component already decided on.
  | "isNonModal"
  | "isDialogContent"
  | "triggerRef"
  // Positioning and dismissal it does not hand out: it is never dismissed by an
  // interaction outside it, it owns its Escape handling, and it renders where it
  // stands instead of in a portal.
  | "getTargetRect"
  | "shouldCloseOnInteractOutside"
  // Overridden in CSS to escape react-aria's viewport clamp, so a value here
  // would be silently ignored.
  | "maxHeight"
  | "isKeyboardDismissDisabled"
  | "UNSTABLE_portalContainer"
  // Popover keeps this one working for the consumers it already has; a coach
  // mark has none yet, so it ships only the current name.
  | "defaultOpen"
> {
  /**
   * The element the coach mark points at. It is an anchor, not a trigger —
   * nothing about it opens the coach mark. Give it either this or `anchor`.
   */
  anchorRef?: RefObject<Element | null>;
  /**
   * The `id` of the element the coach mark points at, looked up once the
   * element exists. Use it where a ref cannot be shared — an mStudio extension
   * renders in a different context than the host, so a ref never arrives, while
   * an id does.
   */
  anchor?: string;
}

/**
 * Resolves whichever anchor was given into something `Popover` can position
 * against.
 *
 * An id is looked up after the commit, and kept looking for until it resolves.
 * A single lookup would only work for an anchor that is already mounted, which
 * is the case this prop does not exist for: remotely the host materializes the
 * page in pieces, so the anchor regularly arrives after the coach mark. Without
 * the observer the hint stays parked and invisible, and nothing says why.
 */
const useAnchorRef = (
  anchorRef: RefObject<Element | null> | undefined,
  anchor: string | undefined,
): RefObject<Element | null> => {
  const [anchorElement, setAnchorElement] = useState<Element | null>(null);

  useEffect(() => {
    if (!anchor) {
      setAnchorElement(null);
      return;
    }

    const element = document.getElementById(anchor);
    setAnchorElement(element);

    if (element) {
      return;
    }

    const observer = new MutationObserver(() => {
      const late = document.getElementById(anchor);

      if (late) {
        setAnchorElement(late);
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [anchor]);

  return useMemo(
    () => anchorRef ?? { current: anchorElement },
    [anchorRef, anchorElement],
  );
};

/**
 * Points at a control the user did not ask about — a feature that is new, moved
 * or easy to miss. It opens on its own, so it stays out of the way: the page
 * below keeps scrolling, focus is left alone, and the coach mark rides along
 * with its anchor instead of closing at the first scroll.
 *
 * Nothing announces it. It renders where it is written, so put it directly
 * behind the element it points at — then it follows that element in the reading
 * order, and its anchor refers to it through `aria-details`.
 *
 * @flr-generate all
 * @flr-ignore-props anchorRef
 * @flowStatus beta, new
 */
export const CoachMark = flowComponent("CoachMark", (props) => {
  const {
    children,
    controller: controllerFromProps,
    anchorRef,
    anchor,
    isDefaultOpen = false,
    ref: ignoredRef,
    ...rest
  } = props;

  const resolvedAnchorRef = useAnchorRef(anchorRef, anchor);

  const controllerFromContext = useOverlayController("CoachMark", {
    reuseControllerFromContext: true,
    isDefaultOpen,
  });

  const controller = controllerFromProps ?? controllerFromContext;

  const propsContext: PropsContext = {
    // A coach mark holds one short thought. Its heading is a bold label, not a
    // level in the page's outline — the same call ContextualHelp makes.
    Heading: {
      level: 5,
      elementType: "span",
    },
    // The dismiss action is composed, not configured. Flow never closes an
    // overlay on a consumer's behalf — `Modal` only augments a `closeOverlay`
    // that is already there — so this sets the shape and leaves the behaviour
    // to whatever `Action` the consumer wraps the button in.
    Button: {
      size: "s",
      className: styles.dismiss,
    },
  };

  return (
    <Popover
      withTip
      {...rest}
      modality="non-modal"
      controller={controller}
      triggerRef={resolvedAnchorRef}
    >
      <OverlayContextProvider type="CoachMark" controller={controller}>
        <PropsContextProvider props={propsContext}>
          <div className={styles.coachMark}>{children}</div>
        </PropsContextProvider>
      </OverlayContextProvider>
    </Popover>
  );
});

export default CoachMark;
