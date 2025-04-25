/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { IllustratedMessageProps } from "@/components/IllustratedMessage";
import React, { useContext } from "react";
import { IllustratedMessage } from "@/components/IllustratedMessage";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const IllustratedMessageView: FC<IllustratedMessageProps> = (props) => {
  const View =
    useContext(viewComponentContext)["IllustratedMessage"] ??
    IllustratedMessage;
  return <View {...props} />;
};

export default IllustratedMessageView;
