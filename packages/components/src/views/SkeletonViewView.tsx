/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { SkeletonView, type SkeletonViewProps } from "@/components/List";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SkeletonViewView: FC<SkeletonViewProps> = (props) => {
  const View = useContext(viewComponentContext)["SkeletonView"] ?? SkeletonView;
  return <View {...props} />;
};

export default SkeletonViewView;
