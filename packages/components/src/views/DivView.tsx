/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Div, type DivProps } from "@/components/Div";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const DivView: FC<DivProps> = (props) => {
  const View = useContext(viewComponentContext)["Div"] ?? Div;
  return <View {...props} />;
};

export default DivView;
