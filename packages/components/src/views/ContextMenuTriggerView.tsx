/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  ContextMenuTrigger,
  type ContextMenuTriggerProps,
} from "@/components/ContextMenu";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ContextMenuTriggerView: FC<ContextMenuTriggerProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["ContextMenuTrigger"] ??
    ContextMenuTrigger;
  return <View {...props} />;
});
ContextMenuTriggerView.displayName = "ContextMenuTriggerView";

export default ContextMenuTriggerView;
