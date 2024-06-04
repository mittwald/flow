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
  href?: string;
  onClick?: () => void;
  onClose?: () => void;
  autoClose?: boolean;
}

export const Notification: FC<NotificationProps> = (props) => {
  const {
    children,
    className,
    status = "info",
    href,
    onClick,
    onClose,
    autoClose,
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

  useEffect(() => {
    if (autoClose && onClose) {
      setTimeout(() => {
        onClose();
      }, 10000);
    }
  }, []);

  const content = (
    <>
      <StatusIcon className={styles.statusIcon} status={status} />
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </>
  );

  const hasLink = !!href || !!onClick;

  return (
    <div role="alert" {...rest} className={rootClassName}>
      <Action action={onClose}>
        <Action action={onClick}>
          {hasLink && (
            <Link unstyled href={href} className={styles.link}>
              {content}
            </Link>
          )}

          {!hasLink && <div className={styles.content}>{content}</div>}
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
