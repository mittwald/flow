import type { AriaToastRegionProps } from "@react-aria/toast";
import type { ToastState } from "@react-stately/toast";
import { useToastRegion } from "@react-aria/toast";
import { Notification, NotificationContentProps } from "../../Notification";
import React, { FC, useRef } from "react";
import styles from "./NotificationRegion.module.scss";

export interface NotificationRegionProps<T> extends AriaToastRegionProps {
  state: ToastState<T>;
}

export const NotificationRegion: FC<
  NotificationRegionProps<NotificationContentProps>
> = ({ state, ...props }) => {
  const ref = useRef(null);
  const { regionProps } = useToastRegion(props, state, ref);

  return (
    <div {...regionProps} ref={ref} className={styles.notificationRegion}>
      {state.visibleToasts.map((toast) => (
        <Notification key={toast.key} toast={toast} state={state} />
      ))}
    </div>
  );
};

export default NotificationRegion;
