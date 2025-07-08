import type { FC, PropsWithChildren, Ref, RefObject } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "../../Popover.module.scss";
import type { PropsWithClassName } from "@/lib/types/props";

export interface PopoverContentProps
  extends PropsWithChildren,
    PropsWithClassName {
  withTip?: boolean;
  isDialogContent?: boolean;
  isOpen?: boolean;
  width?: string | number;
  padding?: "s" | "m";
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
    padding = "m",
    ...rest
  } = props;

  const ContentComponent = isDialogContent ? Aria.Dialog : "div";

  return (
    <Aria.Popover
      {...rest}
      className={className}
      containerPadding={16}
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
      <ContentComponent
        className={clsx(
          styles.content,
          padding && styles[`padding-${padding}`],
        )}
      >
        {children}
      </ContentComponent>
    </Aria.Popover>
  );
};

export default PopoverContent;
