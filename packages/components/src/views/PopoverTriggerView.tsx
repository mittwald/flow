/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { PopoverTrigger, type PopoverTriggerProps } from "~/components/Popover";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const PopoverTriggerView: FC<PopoverTriggerProps> = (props) => {
  const View =
    useContext(viewComponentContext)["PopoverTrigger"] ?? PopoverTrigger;
  return <View {...props} />;
};

export default PopoverTriggerView;
