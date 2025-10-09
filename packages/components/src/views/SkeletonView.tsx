/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Skeleton, type SkeletonProps } from "@/components/Skeleton/Skeleton";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SkeletonView: FC<SkeletonProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Skeleton"] ?? Skeleton;
  return <View {...props} />;
});
SkeletonView.displayName = "SkeletonView";

export default SkeletonView;
