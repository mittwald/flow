/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  ContextualHelp,
  type ContextualHelpProps,
} from "@/components/ContextualHelp";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ContextualHelpView: FC<ContextualHelpProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["ContextualHelp"] ?? ContextualHelp;
  return <View {...props} />;
});
ContextualHelpView.displayName = "ContextualHelpView";

export default ContextualHelpView;
