/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { CopyButtonProps } from "@/components/CopyButton";
import React, { useContext } from "react";
import { CopyButton } from "@/components/CopyButton";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CopyButtonView: FC<CopyButtonProps> = (props) => {
  const View = useContext(viewComponentContext)["CopyButton"] ?? CopyButton;
  return <View {...props} />;
};

export default CopyButtonView;
