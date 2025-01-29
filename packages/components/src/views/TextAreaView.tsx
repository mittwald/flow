/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { TextArea, type TextAreaProps } from "@/components/TextArea";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TextAreaView: FC<TextAreaProps> = (props) => {
  const View = useContext(viewComponentContext)["TextArea"] ?? TextArea;
  return <View {...props} />;
};

export default TextAreaView;
