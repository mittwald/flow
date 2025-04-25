/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { AlertIconProps } from "@/components/AlertIcon";
import React, { useContext } from "react";
import { AlertIcon } from "@/components/AlertIcon";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AlertIconView: FC<AlertIconProps> = (props) => {
  const View = useContext(viewComponentContext)["AlertIcon"] ?? AlertIcon;
  return <View {...props} />;
};

export default AlertIconView;
