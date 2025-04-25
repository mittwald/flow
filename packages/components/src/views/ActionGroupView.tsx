/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { ActionGroupProps } from "@/components/ActionGroup";
import React, { useContext } from "react";
import { ActionGroup } from "@/components/ActionGroup";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ActionGroupView: FC<ActionGroupProps> = (props) => {
  const View = useContext(viewComponentContext)["ActionGroup"] ?? ActionGroup;
  return <View {...props} />;
};

export default ActionGroupView;
