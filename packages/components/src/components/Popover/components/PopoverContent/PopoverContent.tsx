import type { FC, PropsWithChildren, Ref, RefObject } from "react";
import * as Aria from "react-aria-components";
import styles from "../../Popover.module.scss";
import type { PropsWithClassName } from "@/lib/types/props";
import { useIsActivityActive } from "@/components/Activity/context";
import tokens from "@mittwald/flow-design-tokens/json-runtime/all-light.json";

/**
 * The gap a popover keeps to the viewport edge. The stylesheet caps the
 * popover's width with it, `containerPadding` insets the position by it — and
 * `containerPadding` is a number, so it cannot read the CSS variable.
 *
 * @internal
 */
export const popoverViewportPadding = Number.parseFloat(
  tokens.popover["viewport-padding"].value,
);

export interface PopoverContentProps
  extends PropsWithChildren, PropsWithClassName {
  withTip?: boolean;
  isDialogContent?: boolean;
  isOpen?: boolean;
  width?: string | number;
  onOpenChange: (isOpen: boolean) => void;
  ref?: Ref<HTMLElement>;
  triggerRef?: RefObject<Element | null>;
}

/** @flr-generate all */
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
    ...rest
  } = props;

  const isActivityActive = useIsActivityActive();

  const ContentComponent = isDialogContent ? Aria.Dialog : "div";

  if (!isActivityActive) {
    return null;
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
