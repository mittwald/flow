/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  ContextMenuSection,
  type ContextMenuSectionProps,
} from "~/components/ContextMenu";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const ContextMenuSectionView: FC<ContextMenuSectionProps> = (props) => {
  const View =
    useContext(viewComponentContext)["ContextMenuSection"] ??
    ContextMenuSection;
  return <View {...props} />;
};

export default ContextMenuSectionView;
