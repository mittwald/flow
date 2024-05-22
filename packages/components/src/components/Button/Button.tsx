import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Button.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
import { IconFailed, IconSucceeded } from "@/components/Icon/components/icons";
import { Wrap } from "@/components/Wrap";
import { Text } from "@/components/Text";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useAriaAnnounceActionState } from "@/components/Action/lib/ariaLive";

export interface ButtonProps
  extends PropsWithChildren<Aria.ButtonProps>,
    FlowComponentProps<"Button"> {
  /** @default "primary" */
  color?: "primary" | "accent" | "secondary" | "danger" | "dark" | "light";
  /** @default "solid" */
  variant?: "plain" | "solid" | "soft";
  /** @default "m" */
  size?: "m" | "s";

  "aria-disabled"?: boolean;

  isPending?: boolean;
  isSucceeded?: boolean;
  isFailed?: boolean;

  /** @internal */
  unstyled?: boolean;
}

const disablePendingProps = (props: ButtonProps) => {
  if (
    props.isPending ||
    props.isSucceeded ||
    props.isFailed ||
    props["aria-disabled"]
  ) {
    props = { ...props };
    props.onPress = undefined;
    props.onPressStart = undefined;
    props.onPressEnd = undefined;
    props.onPressChange = undefined;
    props.onPressUp = undefined;
    props.onKeyDown = undefined;
    props.onKeyUp = undefined;
  }

  return props;
};

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
    refProp: ref,
    unstyled,
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
    CounterLabel: {
      className: styles.counterLabel,
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
    <StateIconComponent size={size} className={styles.stateIcon} />
  );

  const isStringContent = typeof children === "string";

  return (
    <ClearPropsContext>
      <Aria.Button className={rootClassName} ref={ref} {...restProps}>
        <PropsContextProvider props={propsContext}>
          <Wrap if={!unstyled}>
            <span className={styles.content}>
              <Wrap if={isStringContent}>
                <Text>{children}</Text>
              </Wrap>
            </span>
          </Wrap>
        </PropsContextProvider>
        {stateIcon}
      </Aria.Button>
    </ClearPropsContext>
  );
});

export default Button;
