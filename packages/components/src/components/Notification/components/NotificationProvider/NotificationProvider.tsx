import { ToastState, useToastState } from "@react-stately/toast";
import React, { FC, ReactElement } from "react";
import NotificationRegion from "../NotificationRegion";
import { NotificationContentProps } from "../../Notification";

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
