/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  RadioGroup,
  type RadioGroupProps,
} from "@/components/RadioGroup/RadioGroup";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const RadioGroupView: FC<RadioGroupProps> = memo((props) => {
  const View = useContext(viewComponentContext)["RadioGroup"] ?? RadioGroup;
  return <View {...props} />;
});
RadioGroupView.displayName = "RadioGroupView";

export default RadioGroupView;
