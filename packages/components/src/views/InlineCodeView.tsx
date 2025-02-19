/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { InlineCode, type InlineCodeProps } from "@/components/InlineCode";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const InlineCodeView: FC<InlineCodeProps> = (props) => {
  const View = useContext(viewComponentContext)["InlineCode"] ?? InlineCode;
  return <View {...props} />;
};

export default InlineCodeView;
