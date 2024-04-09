import type { ToastState } from "@react-stately/toast";
import { useToastState } from "@react-stately/toast";
import type { FC, ReactElement } from "react";
import React from "react";
import NotificationRegion from "../NotificationRegion";
import type { NotificationContentProps } from "../../Notification";

export interface NotificationProviderProps {
  children: (item: ToastState<NotificationContentProps>) => ReactElement;
}

export const NotificationProvider: FC<NotificationProviderProps> = ({
  children,
  ...props
}) => {
  const state: ToastState<NotificationContentProps> = useToastState({
    maxVisibleToasts: 5,
  });

  return (
    <>
      {children(state)}
      {state.visibleToasts.length > 0 && (
        <NotificationRegion {...props} state={state} />
      )}
    </>
  );
};

export default NotificationProvider;
