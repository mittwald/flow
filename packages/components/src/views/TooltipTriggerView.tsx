/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { TooltipTriggerProps } from "@/components/Tooltip";
import React, { useContext } from "react";
import { TooltipTrigger } from "@/components/Tooltip";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TooltipTriggerView: FC<TooltipTriggerProps> = (props) => {
  const View =
    useContext(viewComponentContext)["TooltipTrigger"] ?? TooltipTrigger;
  return <View {...props} />;
};

export default TooltipTriggerView;
