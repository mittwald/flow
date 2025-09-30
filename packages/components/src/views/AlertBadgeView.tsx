/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  AlertBadge,
  type AlertBadgeProps,
} from "@/components/AlertBadge/AlertBadge";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AlertBadgeView: FC<AlertBadgeProps> = memo((props) => {
  const View = useContext(viewComponentContext)["AlertBadge"] ?? AlertBadge;
  return <View {...props} />;
});
AlertBadgeView.displayName = "AlertBadgeView";

export default AlertBadgeView;
