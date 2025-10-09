/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  TextField,
  type TextFieldProps,
} from "@/components/TextField/TextField";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TextFieldView: FC<TextFieldProps> = memo((props) => {
  const View = useContext(viewComponentContext)["TextField"] ?? TextField;
  return <View {...props} />;
});
TextFieldView.displayName = "TextFieldView";

export default TextFieldView;
