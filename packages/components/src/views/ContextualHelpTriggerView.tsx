/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { ContextualHelpTriggerProps } from "@/components/ContextualHelp";
import React, { useContext } from "react";
import { ContextualHelpTrigger } from "@/components/ContextualHelp";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ContextualHelpTriggerView: FC<ContextualHelpTriggerProps> = (props) => {
  const View =
    useContext(viewComponentContext)["ContextualHelpTrigger"] ??
    ContextualHelpTrigger;
  return <View {...props} />;
};

export default ContextualHelpTriggerView;
