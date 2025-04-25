/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { InlineCodeProps } from "@/components/InlineCode";
import React, { useContext } from "react";
import { InlineCode } from "@/components/InlineCode";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const InlineCodeView: FC<InlineCodeProps> = (props) => {
  const View = useContext(viewComponentContext)["InlineCode"] ?? InlineCode;
  return <View {...props} />;
};

export default InlineCodeView;
