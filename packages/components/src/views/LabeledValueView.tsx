/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  LabeledValue,
  type LabeledValueProps,
} from "@/components/LabeledValue/LabeledValue";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const LabeledValueView: FC<LabeledValueProps> = memo((props) => {
  const View = useContext(viewComponentContext)["LabeledValue"] ?? LabeledValue;
  return <View {...props} />;
});
LabeledValueView.displayName = "LabeledValueView";

export default LabeledValueView;
