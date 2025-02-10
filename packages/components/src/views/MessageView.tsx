/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Message, type MessageProps } from "@/components/Message";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const MessageView: FC<MessageProps> = (props) => {
  const View = useContext(viewComponentContext)["Message"] ?? Message;
  return <View {...props} />;
};

export default MessageView;
