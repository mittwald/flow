/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { ActionGroup, type ActionGroupProps } from "@/components/ActionGroup";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ActionGroupView: FC<ActionGroupProps> = (props) => {
  const View = useContext(viewComponentContext)["ActionGroup"] ?? ActionGroup;
  return <View {...props} />;
};

export default ActionGroupView;
