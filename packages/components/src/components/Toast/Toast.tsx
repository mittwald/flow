import type { AriaToastProps } from "@react-aria/toast";
import { useToast } from "@react-aria/toast";
import { Button } from "@/components/Button";
import type { ToastState } from "@react-stately/toast";
import React, { FC } from "react";
import { StatusVariantProps } from "@/lib/types/props";
import styles from "./Toast.module.scss";
import clsx from "clsx";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import { Icon } from "@/components/Icon";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { StatusIcon } from "@/components/StatusIcon";

export interface ToastContentProps extends StatusVariantProps {
  title: string;
  content?: string;
}

export interface ToastProps<T> extends AriaToastProps<T> {
  state: ToastState<T>;
}

export const Toast: FC<ToastProps<ToastContentProps>> = ({
  state,
  ...props
}) => {
  const ref = React.useRef(null);
  const { toastProps, closeButtonProps } = useToast(props, state, ref);

  const rootClassName = clsx(
    styles.toast,
    styles[props.toast.content.variant ?? "info"],
  );

  return (
    <div {...toastProps} ref={ref} className={rootClassName}>
      <StatusIcon
        className={styles.statusIcon}
        variant={props.toast.content.variant}
      />
      <Heading className={styles.heading}>{props.toast.content.title}</Heading>
      <Content className={styles.content}>
        {props.toast.content.content}
      </Content>
      <Button
        size="s"
        className={styles.close}
        variant="plain"
        {...closeButtonProps}
      >
        <Icon faIcon={faClose} />
      </Button>
    </div>
  );
};

export default Toast;
