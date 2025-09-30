/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { OverlayContent, type OverlayContentProps } from "@/components/Overlay";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const OverlayContentView: FC<OverlayContentProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["OverlayContent"] ?? OverlayContent;
  return <View {...props} />;
});
OverlayContentView.displayName = "OverlayContentView";

export default OverlayContentView;
