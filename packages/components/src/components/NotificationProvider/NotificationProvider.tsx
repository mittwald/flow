import type { FC, PropsWithChildren } from "react";
import { createContext, useContext } from "react";
import NotificationController from "@/components/NotificationProvider/NotificationController";
import type { NotificationsContainerProps } from "@/components/NotificationProvider/NotificationContainer/NotificationContainer";
import { NotificationContainer } from "@/components/NotificationProvider/NotificationContainer";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

export type NotificationProviderProps =
  PropsWithChildren<NotificationsContainerProps>;

const context = createContext<NotificationController>(
  new NotificationController(),
);

export const useNotificationController = (): NotificationController =>
  useContext(context);

export const NotificationProvider: FC<NotificationProviderProps> = (props) => {
  const { children, ...containerProps } = props;
  const controller = NotificationController.useNew();
  const ContainerView =
    useContext(viewComponentContext)["NotificationContainer"] ??
    NotificationContainer;

  return (
    <context.Provider value={controller}>
      <ContainerView {...containerProps} />
      {children}
    </context.Provider>
  );
};

export default NotificationProvider;
