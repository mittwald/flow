/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { NumberField, type NumberFieldProps } from "@/components/NumberField";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const NumberFieldView: FC<NumberFieldProps> = memo((props) => {
  const View = useContext(viewComponentContext)["NumberField"] ?? NumberField;
  return <View {...props} />;
});
NumberFieldView.displayName = "NumberFieldView";

export default NumberFieldView;
