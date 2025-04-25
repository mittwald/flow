/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { ContextualHelpProps } from "@/components/ContextualHelp";
import React, { useContext } from "react";
import { ContextualHelp } from "@/components/ContextualHelp";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ContextualHelpView: FC<ContextualHelpProps> = (props) => {
  const View =
    useContext(viewComponentContext)["ContextualHelp"] ?? ContextualHelp;
  return <View {...props} />;
};

export default ContextualHelpView;
