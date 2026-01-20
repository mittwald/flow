/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Gallery, type GalleryProps } from "@/components/Gallery/Gallery";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const GalleryView: FC<GalleryProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Gallery"] ?? Gallery;
  return <View {...props} />;
});
GalleryView.displayName = "GalleryView";

export default GalleryView;
