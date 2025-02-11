/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { AlertBadge, type AlertBadgeProps } from "@/components/AlertBadge";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AlertBadgeView: FC<AlertBadgeProps> = (props) => {
  const View = useContext(viewComponentContext)["AlertBadge"] ?? AlertBadge;
  return <View {...props} />;
};

export default AlertBadgeView;
