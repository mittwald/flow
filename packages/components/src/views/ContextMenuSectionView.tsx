/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  ContextMenuSection,
  type ContextMenuSectionProps,
} from "@/components/ContextMenu/components/ContextMenuSection/ContextMenuSection";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ContextMenuSectionView: FC<ContextMenuSectionProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["ContextMenuSection"] ??
    ContextMenuSection;
  return <View {...props} />;
});
ContextMenuSectionView.displayName = "ContextMenuSectionView";

export default ContextMenuSectionView;
