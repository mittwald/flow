/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  SkeletonText,
  type SkeletonTextProps,
} from "~/components/SkeletonText";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const SkeletonTextView: FC<SkeletonTextProps> = (props) => {
  const View = useContext(viewComponentContext)["SkeletonText"] ?? SkeletonText;
  return <View {...props} />;
};

export default SkeletonTextView;
