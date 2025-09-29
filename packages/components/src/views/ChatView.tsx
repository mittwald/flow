/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Chat, type ChatProps } from "@/components/Chat/Chat";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ChatView: FC<ChatProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Chat"] ?? Chat;
  return <View {...props} />;
});
ChatView.displayName = "ChatView";

export default ChatView;
