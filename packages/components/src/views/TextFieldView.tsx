/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { TextFieldProps } from "@/components/TextField";
import React, { useContext } from "react";
import { TextField } from "@/components/TextField";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TextFieldView: FC<TextFieldProps> = (props) => {
  const View = useContext(viewComponentContext)["TextField"] ?? TextField;
  return <View {...props} />;
};

export default TextFieldView;
