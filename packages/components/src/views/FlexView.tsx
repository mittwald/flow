/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { FlexProps } from "@/components/Flex";
import React, { useContext } from "react";
import { Flex } from "@/components/Flex";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const FlexView: FC<FlexProps> = (props) => {
  const View = useContext(viewComponentContext)["Flex"] ?? Flex;
  return <View {...props} />;
};

export default FlexView;
