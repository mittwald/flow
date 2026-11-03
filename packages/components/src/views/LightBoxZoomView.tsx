/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  LightBoxZoom,
  type LightBoxZoomProps,
} from "@/components/LightBox/components/LightBoxZoom/LightBoxZoom";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const LightBoxZoomView: FC<LightBoxZoomProps> = memo((props) => {
  const View = useContext(viewComponentContext)["LightBoxZoom"] ?? LightBoxZoom;
  return <View {...props} />;
});
LightBoxZoomView.displayName = "LightBoxZoomView";

export default LightBoxZoomView;
