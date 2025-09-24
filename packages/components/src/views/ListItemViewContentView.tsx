/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  ListItemViewContent,
  type ListItemViewContentProps,
} from "@/components/List";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ListItemViewContentView: FC<ListItemViewContentProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["ListItemViewContent"] ??
    ListItemViewContent;
  return <View {...props} />;
});
ListItemViewContentView.displayName = "ListItemViewContentView";

export default ListItemViewContentView;
