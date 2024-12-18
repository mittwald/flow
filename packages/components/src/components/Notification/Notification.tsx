import type { ComponentProps, FC, PropsWithChildren } from "react";
import React from "react";
import type { PropsWithStatus } from "@/lib/types/props";
import styles from "./Notification.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import { AlertIcon } from "@/components/AlertIcon";
import { Link } from "@/components/Link";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";

export interface NotificationProps
  extends PropsWithChildren<ComponentProps<"div">>,
    PropsWithStatus {
  /** A link that is triggered when clicking the notification. */
  href?: string;
  /** Whether the notification should disappear automatically after some time. */
  autoClose?: boolean;
  /** Handler that is called when the notification is clicked. */
  onClick?: () => void;
  /**
   * Handler that is called when the close button of the notification is
   * clicked.
   */
  onClose?: () => void;
}

export const Notification: FC<NotificationProps> = (props) => {
  const {
    children,
    className,
    status = "info",
    role = "alert",
    href,
    onClick,
    onClose,
    autoClose: ignoredAutoClose,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.notification,
    styles[status],
    (onClick || onClose || href) && styles.hasLink,
    className,
  );

  const propsContext: PropsContext = {
    Heading: {
      className: styles.heading,
      level: 4,
      children: dynamic((props) => (
        <>
          <AlertIcon status={status} />
          {props.children}
        </>
      )),
    },
    Text: {
      className: styles.text,
    },
  };

  const closeButton = onClose && (
    <Button
      size="s"
      className={styles.close}
      variant="plain"
      color="secondary"
      onPress={onClose}
    >
      <IconClose />
    </Button>
  );

  return (
    <div {...rest} className={rootClassName} role={role}>
      <Link unstyled href={href} className={styles.link} onPress={onClick}>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </Link>
      {closeButton}
    </div>
  );
};

export default Notification;
