/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  SkeletonMode,
  type SkeletonModeProps,
} from "@/components/SkeletonMode/SkeletonMode";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SkeletonModeView: FC<SkeletonModeProps> = memo((props) => {
  const View = useContext(viewComponentContext)["SkeletonMode"] ?? SkeletonMode;
  return <View {...props} />;
});
SkeletonModeView.displayName = "SkeletonModeView";

export default SkeletonModeView;
