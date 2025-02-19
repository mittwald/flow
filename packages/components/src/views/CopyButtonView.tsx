/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { CopyButton, type CopyButtonProps } from "@/components/CopyButton";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CopyButtonView: FC<CopyButtonProps> = (props) => {
  const View = useContext(viewComponentContext)["CopyButton"] ?? CopyButton;
  return <View {...props} />;
};

export default CopyButtonView;
