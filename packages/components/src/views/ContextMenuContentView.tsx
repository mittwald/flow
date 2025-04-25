/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { ContextMenuContentProps } from "@/components/ContextMenu";
import React, { useContext } from "react";
import { ContextMenuContent } from "@/components/ContextMenu";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ContextMenuContentView: FC<ContextMenuContentProps> = (props) => {
  const View =
    useContext(viewComponentContext)["ContextMenuContent"] ??
    ContextMenuContent;
  return <View {...props} />;
};

export default ContextMenuContentView;
