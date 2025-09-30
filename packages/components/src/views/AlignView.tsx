/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Align, type AlignProps } from "@/components/Align";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AlignView: FC<AlignProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Align"] ?? Align;
  return <View {...props} />;
});
AlignView.displayName = "AlignView";

export default AlignView;
