/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { ContextMenuSectionProps } from "@/components/ContextMenu";
import React, { useContext } from "react";
import { ContextMenuSection } from "@/components/ContextMenu";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ContextMenuSectionView: FC<ContextMenuSectionProps> = (props) => {
  const View =
    useContext(viewComponentContext)["ContextMenuSection"] ??
    ContextMenuSection;
  return <View {...props} />;
};

export default ContextMenuSectionView;
