/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Switch, type SwitchProps } from "@/components/Switch";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SwitchView: FC<SwitchProps> = (props) => {
  const View = useContext(viewComponentContext)["Switch"] ?? Switch;
  return <View {...props} />;
};

export default SwitchView;
