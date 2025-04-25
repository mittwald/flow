/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { TextAreaProps } from "@/components/TextArea";
import React, { useContext } from "react";
import { TextArea } from "@/components/TextArea";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TextAreaView: FC<TextAreaProps> = (props) => {
  const View = useContext(viewComponentContext)["TextArea"] ?? TextArea;
  return <View {...props} />;
};

export default TextAreaView;
