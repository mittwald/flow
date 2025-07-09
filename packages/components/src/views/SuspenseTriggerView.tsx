/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  SuspenseTrigger,
  type SuspenseTriggerProps,
} from "@/components/SuspenseTrigger";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SuspenseTriggerView: FC<SuspenseTriggerProps> = (props) => {
  const View =
    useContext(viewComponentContext)["SuspenseTrigger"] ?? SuspenseTrigger;
  return <View {...props} />;
};

export default SuspenseTriggerView;
