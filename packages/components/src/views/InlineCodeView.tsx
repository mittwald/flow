/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  InlineCode,
  type InlineCodeProps,
} from "@/components/InlineCode/InlineCode";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const InlineCodeView: FC<InlineCodeProps> = memo((props) => {
  const View = useContext(viewComponentContext)["InlineCode"] ?? InlineCode;
  return <View {...props} />;
});
InlineCodeView.displayName = "InlineCodeView";

export default InlineCodeView;
