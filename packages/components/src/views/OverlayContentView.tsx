/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { OverlayContentProps } from "@/components/Overlay";
import React, { useContext } from "react";
import { OverlayContent } from "@/components/Overlay";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const OverlayContentView: FC<OverlayContentProps> = (props) => {
  const View =
    useContext(viewComponentContext)["OverlayContent"] ?? OverlayContent;
  return <View {...props} />;
};

export default OverlayContentView;
