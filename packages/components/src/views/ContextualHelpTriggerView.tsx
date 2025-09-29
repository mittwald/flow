/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  ContextualHelpTrigger,
  type ContextualHelpTriggerProps,
} from "@/components/ContextualHelp/components/ContextualHelpTrigger/ContextualHelpTrigger";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ContextualHelpTriggerView: FC<ContextualHelpTriggerProps> = memo(
  (props) => {
    const View =
      useContext(viewComponentContext)["ContextualHelpTrigger"] ??
      ContextualHelpTrigger;
    return <View {...props} />;
  },
);
ContextualHelpTriggerView.displayName = "ContextualHelpTriggerView";

export default ContextualHelpTriggerView;
