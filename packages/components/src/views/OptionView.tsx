/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Option, type OptionProps } from "@/components/Option";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const OptionView: FC<OptionProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Option"] ?? Option;
  return <View {...props} />;
});
OptionView.displayName = "OptionView";

export default OptionView;
