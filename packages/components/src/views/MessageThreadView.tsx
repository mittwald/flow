/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  MessageThread,
  type MessageThreadProps,
} from "@/components/MessageThread/MessageThread";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const MessageThreadView: FC<MessageThreadProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["MessageThread"] ?? MessageThread;
  return <View {...props} />;
});
MessageThreadView.displayName = "MessageThreadView";

export default MessageThreadView;
