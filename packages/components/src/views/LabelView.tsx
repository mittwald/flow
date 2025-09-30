/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Label, type LabelProps } from "@/components/Label/Label";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const LabelView: FC<LabelProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Label"] ?? Label;
  return <View {...props} />;
});
LabelView.displayName = "LabelView";

export default LabelView;
