/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Text, type TextProps } from "@/components/Text";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TextView: FC<TextProps> = (props) => {
  const View = useContext(viewComponentContext)["Text"] ?? Text;
  return <View {...props} />;
};

export default TextView;
