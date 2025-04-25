/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { AlertProps } from "@/components/Alert";
import React, { useContext } from "react";
import { Alert } from "@/components/Alert";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AlertView: FC<AlertProps> = (props) => {
  const View = useContext(viewComponentContext)["Alert"] ?? Alert;
  return <View {...props} />;
};

export default AlertView;
