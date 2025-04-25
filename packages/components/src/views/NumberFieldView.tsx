/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { NumberFieldProps } from "@/components/NumberField";
import React, { useContext } from "react";
import { NumberField } from "@/components/NumberField";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const NumberFieldView: FC<NumberFieldProps> = (props) => {
  const View = useContext(viewComponentContext)["NumberField"] ?? NumberField;
  return <View {...props} />;
};

export default NumberFieldView;
