import type { RefObject } from "react";
import type { PopoverProps } from "@/components/Popover/Popover";
import { Popover } from "@/components/Popover/Popover";
import styles from "./CoachMark.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useOverlayController } from "@/lib/controller";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider";
import { Button } from "@/components/Button";
import locales from "./locales/*.locale.json";

export interface CoachMarkProps extends Omit<
  PopoverProps,
  "withTip" | "modality" | "isNonModal" | "isDialogContent" | "triggerRef"
> {
  /**
   * The element the coach mark points at. It is an anchor, not a trigger —
   * nothing about it opens the coach mark.
   */
  anchorRef: RefObject<Element | null>;
  /**
   * The label of the button that dismisses the coach mark. Defaults to a
   * localized "Got it".
   */
  dismissLabel?: string;
  /** Hides the dismiss button, when the coach mark is closed some other way. */
  hideDismissButton?: boolean;
}

/**
 * Points at a control the user did not ask about — a feature that is new, moved
 * or easy to miss. It opens on its own, so it stays out of the way: the page
 * below keeps scrolling, focus is left alone, and the coach mark rides along
 * with its anchor instead of closing at the first scroll.
 *
 * Nothing announces it. It renders where it is written, so put it directly
 * behind the element it points at — then it follows that element in the reading
 * order, and its anchor refers to it through `aria-details`.
 */
export const CoachMark = flowComponent("CoachMark", (props) => {
  const {
    children,
    controller: controllerFromProps,
    anchorRef,
    dismissLabel,
    hideDismissButton = false,
    ref: ignoredRef,
    ...rest
  } = props;

  const stringFormatter = useLocalizedStringFormatter(locales, "CoachMark");

  const controllerFromContext = useOverlayController("CoachMark", {
    reuseControllerFromContext: true,
  });

  const controller = controllerFromProps ?? controllerFromContext;

  const propsContext: PropsContext = {
    // A coach mark holds one short thought. Its heading is a bold label, not a
    // level in the page's outline — the same call ContextualHelp makes.
    Heading: {
      level: 5,
      elementType: "span",
    },
  };

  return (
    <Popover
      withTip
      {...rest}
      modality="non-modal"
      controller={controller}
      triggerRef={anchorRef}
    >
      <PropsContextProvider props={propsContext}>
        <div className={styles.coachMark}>
          {children}
          {!hideDismissButton && (
            <Button
              size="s"
              className={styles.dismiss}
              onPress={() => controller.close()}
            >
              {dismissLabel ?? stringFormatter.format("dismiss")}
            </Button>
          )}
        </div>
      </PropsContextProvider>
    </Popover>
  );
});

export default CoachMark;
