import type { AriaToastRegionProps } from "@react-aria/toast";
import type { ToastState } from "@react-stately/toast";
import { useToastRegion } from "@react-aria/toast";
import { Toast, ToastContentProps } from "../../Toast";
import React, { FC, useRef } from "react";
import styles from "./ToastRegion.module.scss";

export interface ToastRegionProps<T> extends AriaToastRegionProps {
  state: ToastState<T>;
}

export const ToastRegion: FC<ToastRegionProps<ToastContentProps>> = ({
  state,
  ...props
}) => {
  const ref = useRef(null);
  const { regionProps } = useToastRegion(props, state, ref);

  return (
    <div {...regionProps} ref={ref} className={styles.toastRegion}>
      {state.visibleToasts.map((toast) => (
        <Toast key={toast.key} toast={toast} state={state} />
      ))}
    </div>
  );
};

export default ToastRegion;
