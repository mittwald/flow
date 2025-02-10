/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  NotificationProvider,
  type NotificationProviderProps,
} from "@/components/NotificationProvider";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const NotificationProviderView: FC<NotificationProviderProps> = (props) => {
  const View =
    useContext(viewComponentContext)["NotificationProvider"] ??
    NotificationProvider;
  return <View {...props} />;
};

export default NotificationProviderView;
