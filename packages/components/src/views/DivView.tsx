/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Div, type DivProps } from "@/components/Div";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const DivView: FC<DivProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Div"] ?? Div;
  return <View {...props} />;
});
DivView.displayName = "DivView";

export default DivView;
