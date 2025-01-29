/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  DialogTrigger,
  type DialogTriggerProps,
} from "@/components/OverlayTrigger";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const DialogTriggerView: FC<DialogTriggerProps> = (props) => {
  const View =
    useContext(viewComponentContext)["DialogTrigger"] ?? DialogTrigger;
  return <View {...props} />;
};

export default DialogTriggerView;
