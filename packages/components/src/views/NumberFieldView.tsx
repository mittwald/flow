/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { NumberField, type NumberFieldProps } from "~/components/NumberField";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const NumberFieldView: FC<NumberFieldProps> = (props) => {
  const View = useContext(viewComponentContext)["NumberField"] ?? NumberField;
  return <View {...props} />;
};

export default NumberFieldView;
