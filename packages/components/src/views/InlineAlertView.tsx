/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  InlineAlert,
  type InlineAlertProps,
} from "@/components/InlineAlert/InlineAlert";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const InlineAlertView: FC<InlineAlertProps> = memo((props) => {
  const View = useContext(viewComponentContext)["InlineAlert"] ?? InlineAlert;
  return <View {...props} />;
});
InlineAlertView.displayName = "InlineAlertView";

export default InlineAlertView;
