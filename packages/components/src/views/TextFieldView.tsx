/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { TextField, type TextFieldProps } from "~/components/TextField";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const TextFieldView: FC<TextFieldProps> = (props) => {
  const View = useContext(viewComponentContext)["TextField"] ?? TextField;
  return <View {...props} />;
};

export default TextFieldView;
