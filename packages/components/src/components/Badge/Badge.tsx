import React, { FC, PropsWithChildren } from "react";
import styles from "./Badge.module.css";
import clsx from "clsx";
import { StatusIcon } from "@/components/StatusIcon";
import { Text } from "@/components/Text";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface BadgeProps extends PropsWithChildren {
  /** @default "info" */
  variant?: "info" | "success" | "warning" | "negative";
  className: string;
}

export const Badge: FC<BadgeProps> = (props) => {
  const { children, className, variant = "info", ...rest } = props;

  const rootClassName = clsx(className, styles.root, styles[variant]);

  const propsContext: PropsContext = {
    Icon: {
      className: styles.customIcon,
    },
    Text: {
      className: styles.label,
    },
  };

  return (
    <div className={rootClassName} {...rest}>
      <StatusIcon className={styles.statusIcon} variant={variant} />
      <PropsContextProvider props={propsContext}>
        {typeof children === "string" ? <Text>{children}</Text> : children}
      </PropsContextProvider>
    </div>
  );
};

export default Badge;
