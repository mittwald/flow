/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  PasswordCreationField,
  type PasswordCreationFieldProps,
} from "@/components/PasswordCreationField";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const PasswordCreationFieldView: FC<PasswordCreationFieldProps> = (props) => {
  const View =
    useContext(viewComponentContext)["PasswordCreationField"] ??
    PasswordCreationField;
  return <View {...props} />;
};

export default PasswordCreationFieldView;
