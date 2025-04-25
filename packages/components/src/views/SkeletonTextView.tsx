/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { SkeletonTextProps } from "@/components/SkeletonText";
import React, { useContext } from "react";
import { SkeletonText } from "@/components/SkeletonText";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SkeletonTextView: FC<SkeletonTextProps> = (props) => {
  const View = useContext(viewComponentContext)["SkeletonText"] ?? SkeletonText;
  return <View {...props} />;
};

export default SkeletonTextView;
