/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { SwitchProps } from "@/components/Switch";
import React, { useContext } from "react";
import { Switch } from "@/components/Switch";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SwitchView: FC<SwitchProps> = (props) => {
  const View = useContext(viewComponentContext)["Switch"] ?? Switch;
  return <View {...props} />;
};

export default SwitchView;
