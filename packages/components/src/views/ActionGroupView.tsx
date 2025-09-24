/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { ActionGroup, type ActionGroupProps } from "@/components/ActionGroup";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ActionGroupView: FC<ActionGroupProps> = memo((props) => {
  const View = useContext(viewComponentContext)["ActionGroup"] ?? ActionGroup;
  return <View {...props} />;
});
ActionGroupView.displayName = "ActionGroupView";

export default ActionGroupView;
