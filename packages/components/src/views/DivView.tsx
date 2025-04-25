/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { DivProps } from "@/components/Div";
import React, { useContext } from "react";
import { Div } from "@/components/Div";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const DivView: FC<DivProps> = (props) => {
  const View = useContext(viewComponentContext)["Div"] ?? Div;
  return <View {...props} />;
};

export default DivView;
