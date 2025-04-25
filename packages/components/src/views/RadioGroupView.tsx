/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { RadioGroupProps } from "@/components/RadioGroup";
import React, { useContext } from "react";
import { RadioGroup } from "@/components/RadioGroup";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const RadioGroupView: FC<RadioGroupProps> = (props) => {
  const View = useContext(viewComponentContext)["RadioGroup"] ?? RadioGroup;
  return <View {...props} />;
};

export default RadioGroupView;
