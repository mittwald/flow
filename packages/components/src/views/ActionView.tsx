/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Action, type ActionProps } from "~/components/Action";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const ActionView: FC<ActionProps> = (props) => {
  const View = useContext(viewComponentContext)["Action"] ?? Action;
  return <View {...props} />;
};

export default ActionView;
