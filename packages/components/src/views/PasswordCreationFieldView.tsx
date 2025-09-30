/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  PasswordCreationField,
  type PasswordCreationFieldProps,
} from "@/components/PasswordCreationField";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const PasswordCreationFieldView: FC<PasswordCreationFieldProps> = memo(
  (props) => {
    const View =
      useContext(viewComponentContext)["PasswordCreationField"] ??
      PasswordCreationField;
    return <View {...props} />;
  },
);
PasswordCreationFieldView.displayName = "PasswordCreationFieldView";

export default PasswordCreationFieldView;
