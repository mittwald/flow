/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  ContextMenuContent,
  type ContextMenuContentProps,
} from "@/components/ContextMenu";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ContextMenuContentView: FC<ContextMenuContentProps> = (props) => {
  const View =
    useContext(viewComponentContext)["ContextMenuContent"] ??
    ContextMenuContent;
  return <View {...props} />;
};

export default ContextMenuContentView;
