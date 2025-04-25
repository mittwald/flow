/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { SkeletonProps } from "@/components/Skeleton";
import React, { useContext } from "react";
import { Skeleton } from "@/components/Skeleton";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SkeletonView: FC<SkeletonProps> = (props) => {
  const View = useContext(viewComponentContext)["Skeleton"] ?? Skeleton;
  return <View {...props} />;
};

export default SkeletonView;
