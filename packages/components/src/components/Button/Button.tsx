import React, { FC, PropsWithChildren } from "react";
import styles from "./Button.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import {
  PropsContext,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";
import Icon from "../Icon";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { Text } from "@/components/Text";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

export interface ButtonProps
  extends PropsWithChildren<Omit<Aria.ButtonProps, "style">> {
  /** @default "primary" */
  variant?: "primary" | "success" | "secondary" | "danger";
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
    size === "s" && styles.small,
    (isPending || isSucceeded || isFailed) && styles.pending,
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

  return (
    <Aria.Button
      className={rootClassName}
      isDisabled={isDisabled || isPending || isSucceeded || isFailed}
      {...restProps}
    >
      <PropsContextProvider props={propsContext}>
        {typeof children === "string" ? (
          <Text className={styles.text}>{children}</Text>
        ) : (
          children
        )}
      </PropsContextProvider>
      {isPending && <Icon faIcon={faSpinner} className={styles.pendingIcon} />}
      {isSucceeded && (
        <Icon faIcon={faCheck} className={styles.succeededIcon} />
      )}
      {isFailed && <Icon faIcon={faTimes} className={styles.failedIcon} />}
    </Aria.Button>
  );
};

export default Button;
