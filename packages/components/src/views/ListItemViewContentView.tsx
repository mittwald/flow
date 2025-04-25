/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { ListItemViewContentProps } from "@/components/List";
import React, { useContext } from "react";
import { ListItemViewContent } from "@/components/List";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ListItemViewContentView: FC<ListItemViewContentProps> = (props) => {
  const View =
    useContext(viewComponentContext)["ListItemViewContent"] ??
    ListItemViewContent;
  return <View {...props} />;
};

export default ListItemViewContentView;
