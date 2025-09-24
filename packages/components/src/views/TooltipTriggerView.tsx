/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { TooltipTrigger, type TooltipTriggerProps } from "@/components/Tooltip";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TooltipTriggerView: FC<TooltipTriggerProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["TooltipTrigger"] ?? TooltipTrigger;
  return <View {...props} />;
});
TooltipTriggerView.displayName = "TooltipTriggerView";

export default TooltipTriggerView;
