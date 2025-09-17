import type { PropsWithChildren } from "react";
import styles from "./Badge.module.scss";
import clsx from "clsx";
import type { PropsWithClassName } from "@/lib/types/props";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PressEvent } from "@react-types/shared";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";

export const badgeColors = [
  "neutral",
  "blue",
  "navy",
  "violet",
  "teal",
  "lilac",
  "green",
  "orange",
  "red",
  "dark",
  "light",
] as const;
export type BadgeColors = (typeof badgeColors)[number];

export interface BadgeProps
  extends PropsWithChildren,
    FlowComponentProps,
    PropsWithClassName {
  /** Handler that is called when the badge is pressed. */
  onPress?: (e: PressEvent) => void;
  /** Handler that is called when the badges close icon is pressed. */
  onClose?: (e: PressEvent) => void;
  /** The color of the badge. @default "neutral" */
  color?: BadgeColors;
  /** Whether the badge is disabled. */
  isDisabled?: boolean;
}

/** @flr-generate all */
export const Badge = flowComponent("Badge", (props) => {
  const {
    children,
    className,
    color = "neutral",
    ref,
    onPress,
    onClose,
    isDisabled,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.badge,
    styles[color],
    isDisabled && styles.disabled,
    className,
  );

  const propsContext: PropsContext = {
    Label: {
      elementType: "span",
      className: styles.scope,
      unstyled: true,
    },
    Text: {
      elementType: "span",
      className: styles.value,
    },
    Button: {
      Label: {
        elementType: "span",
        className: styles.scope,
        unstyled: true,
      },
      Text: {
        elementType: "span",
        className: styles.value,
      },
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <div className={rootClassName} {...rest} ref={ref}>
        {!onPress && <div className={styles.content}>{children}</div>}
        {onPress && (
          <Button
            isDisabled={isDisabled}
            unstyled
            className={styles.button}
            onPress={onPress}
          >
            {children}
          </Button>
        )}
        {onClose && (
          <Button
            className={styles.close}
            size="s"
            color="dark"
            variant="plain"
            onPress={onClose}
            isDisabled={isDisabled}
          >
            <IconClose />
          </Button>
        )}
      </div>
    </PropsContextProvider>
  );
});

export default Badge;
