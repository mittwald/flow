/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { MessageSeparatorProps } from "@/components/MessageSeparator";
import React, { useContext } from "react";
import { MessageSeparator } from "@/components/MessageSeparator";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const MessageSeparatorView: FC<MessageSeparatorProps> = (props) => {
  const View =
    useContext(viewComponentContext)["MessageSeparator"] ?? MessageSeparator;
  return <View {...props} />;
};

export default MessageSeparatorView;
