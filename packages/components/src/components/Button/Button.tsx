import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Button.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
import {
  IconFailed,
  IconPending,
  IconSucceeded,
} from "@/components/Icon/components/icons";
import { Wrap } from "@/components/Wrap";
import { Text } from "@/components/Text";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";

export interface ButtonProps
  extends PropsWithChildren<Omit<Aria.ButtonProps, "style">>,
    FlowComponentProps {
  /** @default "primary" */
  variant?: "primary" | "accent" | "secondary" | "danger";
  /** @default "solid" */
  style?: "plain" | "solid" | "soft";
  /** @default "m" */
  size?: "m" | "s";

  isPending?: boolean;
  isSucceeded?: boolean;
  isFailed?: boolean;
}

const disablePendingProps = (props: ButtonProps) => {
  if (props.isPending || props.isSucceeded || props.isFailed) {
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
    variant = "primary",
    style = "solid",
    children,
    className,
    size = "m",
    isPending,
    isDisabled,
    isSucceeded,
    isFailed,
    "aria-label": ariaLabel,
    ref,
    ...restProps
  } = props;

  const rootClassName = clsx(
    styles.button,
    isPending && styles.isPending,
    isSucceeded && styles.isSucceeded,
    isFailed && styles.isFailed,
    styles[`size-${size}`],
    styles[variant],
    styles[style],
    className,
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
  };

  const stringFormatter = useLocalizedStringFormatter(locales);

  const stateLabel =
    isSucceeded || isFailed || isPending
      ? stringFormatter.format(
          `button.${
            isSucceeded ? "isSucceeded" : isFailed ? "isFailed" : "isPending"
          }`,
        )
      : undefined;

  const StateIconComponent = isSucceeded
    ? IconSucceeded
    : isFailed
      ? IconFailed
      : isPending
        ? IconPending
        : undefined;

  const stateIcon = StateIconComponent && (
    <StateIconComponent size={size} className={styles.stateIcon} />
  );

  const isStringContent = typeof children === "string";

  return (
    <ClearPropsContext>
      <Aria.Button
        className={rootClassName}
        isDisabled={isDisabled}
        aria-label={stateLabel ?? ariaLabel}
        ref={ref}
        {...restProps}
      >
        <Wrap if={stateIcon}>
          <span className={styles.content}>
            <Wrap if={isStringContent}>
              <Text>
                <PropsContextProvider props={propsContext}>
                  {children}
                </PropsContextProvider>
              </Text>
            </Wrap>
          </span>
        </Wrap>
        {stateIcon}
      </Aria.Button>
    </ClearPropsContext>
  );
});

export default Button;
