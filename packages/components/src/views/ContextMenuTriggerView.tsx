/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  ContextMenuTrigger,
  type ContextMenuTriggerProps,
} from "@/components/ContextMenu";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ContextMenuTriggerView: FC<ContextMenuTriggerProps> = (props) => {
  const View =
    useContext(viewComponentContext)["ContextMenuTrigger"] ??
    ContextMenuTrigger;
  return <View {...props} />;
};

export default ContextMenuTriggerView;
