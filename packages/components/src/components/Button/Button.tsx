import React, { FC, PropsWithChildren } from "react";
import styles from "./Button.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import {
  PropsContext,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";
import { Wrap } from "@/components/Wrap";
import { PropsWithActionStates } from "@/lib/types/props";
import ActionStateIcon from "../ActionStateIcon";

export interface ButtonProps
  extends PropsWithChildren<Omit<Aria.ButtonProps, "style">>,
    PropsWithActionStates {
  /** @default "primary" */
  variant?: "primary" | "accent" | "secondary" | "danger";
  /** @default "solid" */
  style?: "plain" | "solid";
  /** @default "medium" */
  size?: "medium" | "small";
}

export const Button: FC<ButtonProps> = (props) => {
  const {
    variant = "primary",
    style = "solid",
    children,
    className,
    size = "medium",
    isPending,
    isDisabled,
    isSucceeded,
    isFailed,
    ...rest
  } = useProps("Button", props);

  const rootClassName = clsx(
    styles.button,
    isPending && styles.isPending,
    isSucceeded && styles.isSucceeded,
    isFailed && styles.isFailed,
    styles[size],
    styles[variant],
    styles[style],
    className,
  );

  const propsContext: PropsContext = {
    Icon: {
      className: styles.icon,
      "aria-hidden": true,
      fixedWidth: true,
    },
  };

  const hasActionState = isPending || isSucceeded || isFailed;

  const actionStateIcon = (
    <ActionStateIcon
      isSucceeded={isSucceeded}
      isPending={isPending}
      isFailed={isFailed}
      className={styles.actionStateIcon}
    />
  );

  return (
    <Aria.Button
      className={rootClassName}
      isDisabled={hasActionState || isDisabled}
      {...rest}
    >
      <PropsContextProvider props={propsContext}>
        <Wrap if={hasActionState}>
          <span className={styles.content}>{children}</span>
        </Wrap>
      </PropsContextProvider>

      {actionStateIcon}
    </Aria.Button>
  );
};

export default Button;
