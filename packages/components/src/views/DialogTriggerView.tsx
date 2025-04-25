/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { DialogTriggerProps } from "@/components/OverlayTrigger";
import React, { useContext } from "react";
import { DialogTrigger } from "@/components/OverlayTrigger";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const DialogTriggerView: FC<DialogTriggerProps> = (props) => {
  const View =
    useContext(viewComponentContext)["DialogTrigger"] ?? DialogTrigger;
  return <View {...props} />;
};

export default DialogTriggerView;
