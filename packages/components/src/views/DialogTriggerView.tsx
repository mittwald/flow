/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  DialogTrigger,
  type DialogTriggerProps,
} from "@/components/OverlayTrigger";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const DialogTriggerView: FC<DialogTriggerProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["DialogTrigger"] ?? DialogTrigger;
  return <View {...props} />;
});
DialogTriggerView.displayName = "DialogTriggerView";

export default DialogTriggerView;
