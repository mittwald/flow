/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  AlertIcon,
  type AlertIconProps,
} from "@/components/AlertIcon/AlertIcon";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AlertIconView: FC<AlertIconProps> = memo((props) => {
  const View = useContext(viewComponentContext)["AlertIcon"] ?? AlertIcon;
  return <View {...props} />;
});
AlertIconView.displayName = "AlertIconView";

export default AlertIconView;
