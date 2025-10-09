/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  Notification,
  type NotificationProps,
} from "@/components/Notification/Notification";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const NotificationView: FC<NotificationProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Notification"] ?? Notification;
  return <View {...props} />;
});
NotificationView.displayName = "NotificationView";

export default NotificationView;
