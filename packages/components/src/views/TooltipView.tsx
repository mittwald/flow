/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Tooltip, type TooltipProps } from "~/components/Tooltip";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const TooltipView: FC<TooltipProps> = (props) => {
  const View = useContext(viewComponentContext)["Tooltip"] ?? Tooltip;
  return <View {...props} />;
};

export default TooltipView;
