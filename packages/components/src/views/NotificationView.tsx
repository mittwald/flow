/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  Notification,
  type NotificationProps,
} from "@/components/Notification";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const NotificationView: FC<NotificationProps> = (props) => {
  const View = useContext(viewComponentContext)["Notification"] ?? Notification;
  return <View {...props} />;
};

export default NotificationView;
