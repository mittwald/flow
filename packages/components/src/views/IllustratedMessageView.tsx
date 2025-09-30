/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  IllustratedMessage,
  type IllustratedMessageProps,
} from "@/components/IllustratedMessage";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const IllustratedMessageView: FC<IllustratedMessageProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["IllustratedMessage"] ??
    IllustratedMessage;
  return <View {...props} />;
});
IllustratedMessageView.displayName = "IllustratedMessageView";

export default IllustratedMessageView;
