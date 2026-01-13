/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  MessageSeparator,
  type MessageSeparatorProps,
} from "@/components/MessageThread/components/MessageSeparator/MessageSeparator";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const MessageSeparatorView: FC<MessageSeparatorProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["MessageSeparator"] ?? MessageSeparator;
  return <View {...props} />;
});
MessageSeparatorView.displayName = "MessageSeparatorView";

export default MessageSeparatorView;
