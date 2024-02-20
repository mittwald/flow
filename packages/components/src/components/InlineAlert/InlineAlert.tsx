import React, { ComponentProps, FC, PropsWithChildren } from "react";
import {
  PropsContext,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";
import styles from "./InlineAlert.module.scss";
import clsx from "clsx";
import { StatusIcon } from "@/components/StatusIcon";
import { StatusVariantProps } from "@/lib/types/props";

export interface InlineAlertProps
  extends PropsWithChildren<ComponentProps<"aside">>,
    StatusVariantProps {}

export const InlineAlert: FC<InlineAlertProps> = (props) => {
  const {
    children,
    className,
    variant = "info",
    ...rest
  } = useProps("InlineAlert", props);

  const rootClassName = clsx(styles.inlineAlert, styles[variant], className);

  const propsContext: PropsContext = {
    Heading: {
      className: styles.heading,
      level: 3,
    },
    Content: {
      className: styles.content,
    },
  };

  return (
    <aside {...rest} className={rootClassName}>
      <StatusIcon className={styles.statusIcon} variant={variant} />
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </aside>
  );
};

export default InlineAlert;
