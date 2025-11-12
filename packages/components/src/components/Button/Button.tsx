import type { PropsWithChildren } from "react";
import styles from "./Button.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { IconFailed, IconSucceeded } from "@/components/Icon/components/icons";
import { Wrap } from "@/components/Wrap";
import { Text } from "@/components/Text";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useAriaAnnounceActionState } from "@/components/Action/lib/ariaLive";

export interface ButtonProps
  extends PropsWithChildren<Aria.ButtonProps>,
    FlowComponentProps<HTMLButtonElement> {
  /** Slot for button placement in action groups. */
  slot?: string;
  /** The color of the button. @default "primary" */
  color?: "primary" | "accent" | "secondary" | "danger" | "dark" | "light";
  /** The visual variant of the button. @default "solid" */
  variant?: "plain" | "solid" | "soft" | "outline";
  /** The size of the button. @default "m" */
  size?: "m" | "s";
  /** Disables button but keeps it focusable. */
  "aria-disabled"?: boolean;
  /** Whether the button is in a pending state. */
  isPending?: boolean;
  /** Whether the button is in a succeeded state. */
  isSucceeded?: boolean;
  /** Whether the button is in a failed state. */
  isFailed?: boolean;
  /** Whether the button is in a read only state. */
  isReadOnly?: boolean;
  /** @internal */
  unstyled?: boolean;
  /** @internal */
  ariaSlot?: string | null;
}

const disablePendingProps = (props: ButtonProps) => {
  if (
    props.isPending ||
    props.isSucceeded ||
    props.isFailed ||
    props["aria-disabled"] ||
    props.isReadOnly
  ) {
    props = { ...props };
    props.onPress = undefined;
    props.onPressStart = undefined;
    props.onPressEnd = undefined;
    props.onPressChange = undefined;
    props.onPressUp = undefined;
    props.onKeyDown = undefined;
    props.onKeyUp = undefined;
    props.type = "button";
  }

  return props;
};

/** @flr-generate all */
export const Button = flowComponent("Button", (props) => {
  props = disablePendingProps(props);

  const {
    color = "primary",
    variant = "solid",
    children,
    className,
    size = "m",
    isPending,
    isSucceeded,
    isFailed,
    "aria-disabled": ariaDisabled,
    ref,
    slot: ignoredSlotProp,
    ariaSlot: slot,
    unstyled,
    isReadOnly,
    ...restProps
  } = props;

  const rootClassName = unstyled
    ? className
    : clsx(
        styles.button,
        isPending && styles.isPending,
        isSucceeded && styles.isSucceeded,
        isFailed && styles.isFailed,
        styles[`size-${size}`],
        styles[color],
        styles[variant],
        className,
        /**
         * Workaround warning: The Aria.Button does not support "aria-disabled"
         * by now, so this Button will be visually disabled via CSS.
         */
        ariaDisabled && styles.ariaDisabled,
      );

  useAriaAnnounceActionState(
    isPending
      ? "isPending"
      : isSucceeded
        ? "isSucceeded"
        : isFailed
          ? "isFailed"
          : "isIdle",
  );

  const propsContext: PropsContext = {
    Icon: {
      className: styles.icon,
      "aria-hidden": true,
      size,
    },
    Text: {
      className: styles.text,
    },
    Avatar: {
      className: styles.avatar,
    },
    CounterBadge: {
      className: styles.counterBadge,
    },
    Image: {
      className: styles.image,
    },
  };

  const StateIconComponent = isSucceeded
    ? IconSucceeded
    : isFailed
      ? IconFailed
      : isPending
        ? LoadingSpinner
        : undefined;

  const stateIcon = StateIconComponent && (
    <StateIconComponent
      size={size}
      className={styles.stateIcon}
      status={isFailed ? "danger" : isSucceeded ? "success" : undefined}
    />
  );

  const isStringContent = typeof children === "string";

  return (
    <Aria.Button
      className={rootClassName}
      ref={ref}
      slot={slot}
      {...(isReadOnly === true ? { "data-readonly": true } : {})}
      {...restProps}
    >
      <PropsContextProvider props={propsContext}>
        <Wrap if={!unstyled}>
          <span className={styles.content}>
            <Wrap if={isStringContent}>
              <Text className={styles.text}>{children}</Text>
            </Wrap>
          </span>
        </Wrap>
      </PropsContextProvider>
      {stateIcon}
    </Aria.Button>
  );
});

export default Button;
