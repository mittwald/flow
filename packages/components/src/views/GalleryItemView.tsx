/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  GalleryItem,
  type GalleryItemProps,
} from "@/components/Gallery/components/GalleryItem";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const GalleryItemView: FC<GalleryItemProps> = memo((props) => {
  const View = useContext(viewComponentContext)["GalleryItem"] ?? GalleryItem;
  return <View {...props} />;
});
GalleryItemView.displayName = "GalleryItemView";

export default GalleryItemView;
