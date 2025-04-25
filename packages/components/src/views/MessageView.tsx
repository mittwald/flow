/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { MessageProps } from "@/components/Message";
import React, { useContext } from "react";
import { Message } from "@/components/Message";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const MessageView: FC<MessageProps> = (props) => {
  const View = useContext(viewComponentContext)["Message"] ?? Message;
  return <View {...props} />;
};

export default MessageView;
