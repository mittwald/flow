import type { AriaToastProps } from "@react-aria/toast";
import { useToast } from "@react-aria/toast";
import { Button } from "@/components/Button";
import type { ToastState } from "@react-stately/toast";
import React, { FC } from "react";
import { PropsWithStatus } from "@/lib/types/props";
import styles from "./Notification.module.scss";
import clsx from "clsx";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import { StatusIcon } from "@/components/StatusIcon";
import { IconClose } from "@/components/Icon/components/icons";

export interface NotificationContentProps extends PropsWithStatus {
  title: string;
  content?: string;
}

export interface NotificationProps<T> extends AriaToastProps<T> {
  state: ToastState<T>;
}

export const Notification: FC<NotificationProps<NotificationContentProps>> = ({
  state,
  ...props
}) => {
  const ref = React.useRef(null);
  const { toastProps, closeButtonProps } = useToast(props, state, ref);

  const rootClassName = clsx(
    styles.notification,
    styles[props.toast.content.status ?? "info"],
  );

  return (
    <div {...toastProps} ref={ref} className={rootClassName}>
      <StatusIcon
        className={styles.statusIcon}
        status={props.toast.content.status}
      />
      <Heading className={styles.heading}>{props.toast.content.title}</Heading>
      <Content className={styles.content}>
        {props.toast.content.content}
      </Content>
      <Button
        size="s"
        className={styles.close}
        variant="secondary"
        style="plain"
        {...closeButtonProps}
      >
        <IconClose />
      </Button>
    </div>
  );
};

export default Notification;
