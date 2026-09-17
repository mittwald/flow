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
   * The `id` of the element the coach mark points at, looked up when it opens.
   * Use it where a ref cannot be shared — an mStudio extension renders in a
   * different context than the host, so a ref never arrives, while an id does.
   */
  anchor?: string;
}

/**
 * Resolves whichever anchor was given into something `Popover` can position
 * against. The id is looked up after the commit, so the anchor is in the DOM by
 * then — which it is, since a coach mark belongs right behind it.
 */
const useAnchorRef = (
  anchorRef: RefObject<Element | null> | undefined,
  anchor: string | undefined,
): RefObject<Element | null> => {
  const [anchorElement, setAnchorElement] = useState<Element | null>(null);

  useEffect(() => {
    setAnchorElement(anchor ? document.getElementById(anchor) : null);
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
