/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  LightBoxGallery,
  type LightBoxGalleryProps,
} from "@/components/LightBox/components/LightBoxGallery/LightBoxGallery";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const LightBoxGalleryView: FC<LightBoxGalleryProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["LightBoxGallery"] ?? LightBoxGallery;
  return <View {...props} />;
});
LightBoxGalleryView.displayName = "LightBoxGalleryView";

export default LightBoxGalleryView;
