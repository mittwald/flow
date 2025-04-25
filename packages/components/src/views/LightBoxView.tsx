/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { LightBoxProps } from "@/components/LightBox";
import React, { useContext } from "react";
import { LightBox } from "@/components/LightBox";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const LightBoxView: FC<LightBoxProps> = (props) => {
  const View = useContext(viewComponentContext)["LightBox"] ?? LightBox;
  return <View {...props} />;
};

export default LightBoxView;
