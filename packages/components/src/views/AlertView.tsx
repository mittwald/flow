/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Alert, type AlertProps } from "@/components/Alert";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AlertView: FC<AlertProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Alert"] ?? Alert;
  return <View {...props} />;
});
AlertView.displayName = "AlertView";

export default AlertView;
