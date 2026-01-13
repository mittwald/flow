/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Switch, type SwitchProps } from "@/components/Switch/Switch";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SwitchView: FC<SwitchProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Switch"] ?? Switch;
  return <View {...props} />;
});
SwitchView.displayName = "SwitchView";

export default SwitchView;
