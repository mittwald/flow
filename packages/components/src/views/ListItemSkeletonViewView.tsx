/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  ListItemSkeletonView,
  type ListItemSkeletonViewProps,
} from "@/components/List";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ListItemSkeletonViewView: FC<ListItemSkeletonViewProps> = (props) => {
  const View =
    useContext(viewComponentContext)["ListItemSkeletonView"] ??
    ListItemSkeletonView;
  return <View {...props} />;
};

export default ListItemSkeletonViewView;
