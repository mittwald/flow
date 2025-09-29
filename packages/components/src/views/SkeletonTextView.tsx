/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  SkeletonText,
  type SkeletonTextProps,
} from "@/components/SkeletonText/SkeletonText";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SkeletonTextView: FC<SkeletonTextProps> = memo((props) => {
  const View = useContext(viewComponentContext)["SkeletonText"] ?? SkeletonText;
  return <View {...props} />;
});
SkeletonTextView.displayName = "SkeletonTextView";

export default SkeletonTextView;
