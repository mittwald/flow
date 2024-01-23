import React, { FC, PropsWithChildren } from "react";
import styles from "./Badge.module.scss";
import clsx from "clsx";
import { StatusIcon } from "@/components/StatusIcon";
import { Text } from "@/components/Text";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { StatusVariantProps } from "@/lib/types/props";

export interface BadgeProps extends PropsWithChildren, StatusVariantProps {
  className?: string;
}

export const Badge: FC<BadgeProps> = (props) => {
  const { children, className, variant = "info", ...rest } = props;

  const rootClassName = clsx(styles.badge, styles[variant], className);

  const propsContext: PropsContext = {
    Icon: {
      className: styles.customIcon,
    },
    Text: {
      className: styles.content,
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
