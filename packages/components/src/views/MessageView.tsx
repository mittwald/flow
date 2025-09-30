/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Message, type MessageProps } from "@/components/Message";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const MessageView: FC<MessageProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Message"] ?? Message;
  return <View {...props} />;
});
MessageView.displayName = "MessageView";

export default MessageView;
