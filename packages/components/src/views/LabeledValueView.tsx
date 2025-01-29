/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  LabeledValue,
  type LabeledValueProps,
} from "@/components/LabeledValue";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const LabeledValueView: FC<LabeledValueProps> = (props) => {
  const View = useContext(viewComponentContext)["LabeledValue"] ?? LabeledValue;
  return <View {...props} />;
};

export default LabeledValueView;
