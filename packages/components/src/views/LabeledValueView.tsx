/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { LabeledValueProps } from "@/components/LabeledValue";
import React, { useContext } from "react";
import { LabeledValue } from "@/components/LabeledValue";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const LabeledValueView: FC<LabeledValueProps> = (props) => {
  const View = useContext(viewComponentContext)["LabeledValue"] ?? LabeledValue;
  return <View {...props} />;
};

export default LabeledValueView;
