import React, { FC, PropsWithChildren } from "react";
import styles from "./Button.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import {
  ClearPropsContext,
  PropsContext,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";
import {
  IconFailed,
  IconPending,
  IconSucceeded,
} from "@/components/Icon/components/icons";
import { Wrap } from "@/components/Wrap";
import { Text } from "@/components/Text";

export interface ButtonProps
  extends PropsWithChildren<Omit<Aria.ButtonProps, "style">> {
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

export const Button: FC<ButtonProps> = (props) => {
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
    ...restProps
  } = useProps("Button", props);

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
        isDisabled={isDisabled || isPending || isSucceeded || isFailed}
        {...restProps}
      >
        <PropsContextProvider props={propsContext}>
          <Wrap if={stateIcon}>
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
};

export default Button;
