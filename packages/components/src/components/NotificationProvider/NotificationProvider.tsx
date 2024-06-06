import type { FC, PropsWithChildren } from "react";
import React, { createContext, useContext } from "react";
import NotificationController from "@/components/NotificationProvider/NotificationController";
import NotificationsContainer from "@/components/NotificationProvider/NotificationsContainer";

type Props = PropsWithChildren;

const context = createContext<NotificationController>(
  new NotificationController(),
);

export const useNotificationController = (): NotificationController =>
  useContext(context);

export const NotificationProvider: FC<Props> = (props) => {
  const { children, ...containerProps } = props;
  const controller = NotificationController.useNew();

  return (
    <context.Provider value={controller}>
      <NotificationsContainer controller={controller} {...containerProps} />
      {children}
    </context.Provider>
  );
};

export default NotificationProvider;
