/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { RadioButtonProps } from "@/components/RadioGroup";
import React, { useContext } from "react";
import { RadioButton } from "@/components/RadioGroup";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const RadioButtonView: FC<RadioButtonProps> = (props) => {
  const View = useContext(viewComponentContext)["RadioButton"] ?? RadioButton;
  return <View {...props} />;
};

export default RadioButtonView;
