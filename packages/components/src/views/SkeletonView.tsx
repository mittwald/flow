/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Skeleton, type SkeletonProps } from "@/components/Skeleton";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SkeletonView: FC<SkeletonProps> = (props) => {
  const View = useContext(viewComponentContext)["Skeleton"] ?? Skeleton;
  return <View {...props} />;
};

export default SkeletonView;
