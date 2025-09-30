/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  ContextMenuContent,
  type ContextMenuContentProps,
} from "@/components/ContextMenu/components/ContextMenuContent/ContextMenuContent";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ContextMenuContentView: FC<ContextMenuContentProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["ContextMenuContent"] ??
    ContextMenuContent;
  return <View {...props} />;
});
ContextMenuContentView.displayName = "ContextMenuContentView";

export default ContextMenuContentView;
