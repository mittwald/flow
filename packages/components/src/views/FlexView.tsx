/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Flex, type FlexProps } from "@/components/Flex/Flex";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const FlexView: FC<FlexProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Flex"] ?? Flex;
  return <View {...props} />;
});
FlexView.displayName = "FlexView";

export default FlexView;
