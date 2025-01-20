/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { RadioGroup, type RadioGroupProps } from "~/components/RadioGroup";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const RadioGroupView: FC<RadioGroupProps> = (props) => {
  const View = useContext(viewComponentContext)["RadioGroup"] ?? RadioGroup;
  return <View {...props} />;
};

export default RadioGroupView;
