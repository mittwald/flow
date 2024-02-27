import React, { FC, PropsWithChildren } from "react";
import styles from "./Button.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import {
  PropsContext,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";
import Icon from "@/components/Icon";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { Wrap } from "@/components/Wrap";

export interface ButtonProps
  extends PropsWithChildren<Omit<Aria.ButtonProps, "style">> {
  /** @default "primary" */
  variant?: "primary" | "accent" | "secondary" | "danger";
  /** @default "solid" */
  style?: "plain" | "solid";
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
      fixedWidth: true,
    },
  };

  const stateIcon = (isPending || isSucceeded || isFailed) && (
    <Icon
      faIcon={isSucceeded ? faCheck : isFailed ? faTimes : faSpinner}
      className={styles.stateIcon}
    />
  );

  return (
    <Aria.Button
      className={rootClassName}
      isDisabled={isDisabled || isPending || isSucceeded || isFailed}
      {...restProps}
    >
      <PropsContextProvider props={propsContext}>
        <Wrap if={stateIcon}>
          <span className={styles.content}>{children}</span>
        </Wrap>
      </PropsContextProvider>
      {stateIcon}
    </Aria.Button>
  );
};

export default Button;
