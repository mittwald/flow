/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  LightBoxGalleryItem,
  type LightBoxGalleryItemProps,
} from "@/components/LightBox/components/LightBoxGalleryItem/LightBoxGalleryItem";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const LightBoxGalleryItemView: FC<LightBoxGalleryItemProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["LightBoxGalleryItem"] ??
    LightBoxGalleryItem;
  return <View {...props} />;
});
LightBoxGalleryItemView.displayName = "LightBoxGalleryItemView";

export default LightBoxGalleryItemView;
