/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { ChatProps } from "@/components/Chat";
import React, { useContext } from "react";
import { Chat } from "@/components/Chat";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ChatView: FC<ChatProps> = (props) => {
  const View = useContext(viewComponentContext)["Chat"] ?? Chat;
  return <View {...props} />;
};

export default ChatView;
