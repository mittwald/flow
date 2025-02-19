/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { LightBox, type LightBoxProps } from "@/components/LightBox";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const LightBoxView: FC<LightBoxProps> = (props) => {
  const View = useContext(viewComponentContext)["LightBox"] ?? LightBox;
  return <View {...props} />;
};

export default LightBoxView;
