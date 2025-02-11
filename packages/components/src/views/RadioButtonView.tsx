/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { RadioButton, type RadioButtonProps } from "@/components/RadioGroup";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const RadioButtonView: FC<RadioButtonProps> = (props) => {
  const View = useContext(viewComponentContext)["RadioButton"] ?? RadioButton;
  return <View {...props} />;
};

export default RadioButtonView;
