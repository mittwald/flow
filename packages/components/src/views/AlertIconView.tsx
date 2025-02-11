/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { AlertIcon, type AlertIconProps } from "@/components/AlertIcon";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AlertIconView: FC<AlertIconProps> = (props) => {
  const View = useContext(viewComponentContext)["AlertIcon"] ?? AlertIcon;
  return <View {...props} />;
};

export default AlertIconView;
