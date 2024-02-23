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
import { Wrap } from "@/components/Wrap";
import { IconCheck, IconLoader2, IconX } from "@tabler/icons-react";

export interface ButtonProps
  extends PropsWithChildren<Omit<Aria.ButtonProps, "style">> {
  /** @default "primary" */
  variant?: "primary" | "accent" | "secondary" | "danger";
  /** @default "solid" */
  style?: "plain" | "solid";
  /** @default "medium" */
  size?: "medium" | "small";

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
    size = "medium",
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
    styles[size],
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
  };

  const stateIcon = (isPending || isSucceeded || isFailed) && (
    <Icon
      size={size}
      tablerIcon={
        isSucceeded ? <IconCheck /> : isFailed ? <IconX /> : <IconLoader2 />
      }
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
