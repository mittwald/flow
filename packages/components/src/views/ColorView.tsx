/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { ColorProps } from "@/components/Color";
import React, { useContext } from "react";
import { Color } from "@/components/Color";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ColorView: FC<ColorProps> = (props) => {
  const View = useContext(viewComponentContext)["Color"] ?? Color;
  return <View {...props} />;
};

export default ColorView;
