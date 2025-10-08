/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Tooltip, type TooltipProps } from "@/components/Tooltip/Tooltip";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TooltipView: FC<TooltipProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Tooltip"] ?? Tooltip;
  return <View {...props} />;
});
TooltipView.displayName = "TooltipView";

export default TooltipView;
