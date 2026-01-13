/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Color, type ColorProps } from "@/components/Color/Color";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ColorView: FC<ColorProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Color"] ?? Color;
  return <View {...props} />;
});
ColorView.displayName = "ColorView";

export default ColorView;
