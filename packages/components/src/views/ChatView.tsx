/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Chat, type ChatProps } from "@/components/Chat";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ChatView: FC<ChatProps> = (props) => {
  const View = useContext(viewComponentContext)["Chat"] ?? Chat;
  return <View {...props} />;
};

export default ChatView;
