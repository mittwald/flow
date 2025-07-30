/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  MessageSeparator,
  type MessageSeparatorProps,
} from "@/components/MessageThread";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const MessageSeparatorView: FC<MessageSeparatorProps> = (props) => {
  const View =
    useContext(viewComponentContext)["MessageSeparator"] ?? MessageSeparator;
  return <View {...props} />;
};

export default MessageSeparatorView;
