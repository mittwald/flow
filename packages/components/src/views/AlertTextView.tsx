/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  AlertText,
  type AlertTextProps,
} from "@/components/AlertText/AlertText";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AlertTextView: FC<AlertTextProps> = memo((props) => {
  const View = useContext(viewComponentContext)["AlertText"] ?? AlertText;
  return <View {...props} />;
});
AlertTextView.displayName = "AlertTextView";

export default AlertTextView;
