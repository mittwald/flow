/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Text, type TextProps } from "@/components/Text/Text";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TextView: FC<TextProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Text"] ?? Text;
  return <View {...props} />;
});
TextView.displayName = "TextView";

export default TextView;
