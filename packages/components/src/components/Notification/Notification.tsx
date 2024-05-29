import type { ComponentProps, FC, PropsWithChildren } from "react";
import React, { useEffect } from "react";
import type { PropsWithStatus } from "@/lib/types/props";
import styles from "./Notification.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { StatusIcon } from "@/components/StatusIcon";
import { Link } from "@/components/Link";
import { Action } from "@/components/Action";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";

export interface NotificationProps
  extends PropsWithChildren<ComponentProps<"div">>,
    PropsWithStatus {
  onClose?: () => void;
  onClick?: () => void;
}

export const Notification: FC<NotificationProps> = (props) => {
  const {
    children,
    className,
    status = "info",
    onClick,
    onClose,
    ...rest
  } = props;

  const rootClassName = clsx(styles.notification, styles[status], className);

  const propsContext: PropsContext = {
    Heading: {
      className: styles.heading,
      level: 4,
    },
    Text: {
      className: styles.text,
    },
  };

  return (
    <div role="alert" {...rest} className={rootClassName}>
      <Action action={onClose}>
        <Action action={onClick}>
          <Link unstyled className={styles.link}>
            <StatusIcon className={styles.statusIcon} status={status} />
            <PropsContextProvider props={propsContext}>
              {children}
            </PropsContextProvider>
          </Link>
        </Action>
        {onClose && (
          <Button
            size="s"
            className={styles.close}
            variant="plain"
            color="secondary"
          >
            <IconClose />
          </Button>
        )}
      </Action>
    </div>
  );
};

export default Notification;
