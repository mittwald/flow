/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  MessageThread,
  type MessageThreadProps,
} from "@/components/MessageThread";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const MessageThreadView: FC<MessageThreadProps> = (props) => {
  const View =
    useContext(viewComponentContext)["MessageThread"] ?? MessageThread;
  return <View {...props} />;
};

export default MessageThreadView;
