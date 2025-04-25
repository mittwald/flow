/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { NotificationProps } from "@/components/Notification";
import React, { useContext } from "react";
import { Notification } from "@/components/Notification";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const NotificationView: FC<NotificationProps> = (props) => {
  const View = useContext(viewComponentContext)["Notification"] ?? Notification;
  return <View {...props} />;
};

export default NotificationView;
