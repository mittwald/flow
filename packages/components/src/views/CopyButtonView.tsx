/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  CopyButton,
  type CopyButtonProps,
} from "@/components/CopyButton/CopyButton";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CopyButtonView: FC<CopyButtonProps> = memo((props) => {
  const View = useContext(viewComponentContext)["CopyButton"] ?? CopyButton;
  return <View {...props} />;
});
CopyButtonView.displayName = "CopyButtonView";

export default CopyButtonView;
