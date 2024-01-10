import React, { FC, PropsWithChildren } from "react";
import styles from "./Pill.module.css";
import clsx from "clsx";
import { StatusIcon } from "@/components/StatusIcon";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface PillProps extends PropsWithChildren {
  /** @default "info" */
  variant?: "info" | "success" | "warning" | "negative";
  className: string;
}

export const Pill: FC<PillProps> = (props) => {
  const { children, className, variant = "info", ...rest } = props;

  const rootClassName = clsx(className, styles.root, styles[variant], {
    [styles.iconOnly]: !children,
  });

  const propsContext: PropsContext = {
    icon: {
      className: styles.customIcon,
    },
    text: {
      className: styles.label,
    },
  };

  return (
    <div className={rootClassName} {...rest}>
      <StatusIcon className={styles.statusIcon} variant={variant} />
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </div>
  );
};

export default Pill;
