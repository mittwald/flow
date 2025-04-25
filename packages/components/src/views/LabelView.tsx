/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { LabelProps } from "@/components/Label";
import React, { useContext } from "react";
import { Label } from "@/components/Label";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const LabelView: FC<LabelProps> = (props) => {
  const View = useContext(viewComponentContext)["Label"] ?? Label;
  return <View {...props} />;
};

export default LabelView;
