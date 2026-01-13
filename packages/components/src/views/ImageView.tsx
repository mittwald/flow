/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Image, type ImageProps } from "@/components/Image/Image";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ImageView: FC<ImageProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Image"] ?? Image;
  return <View {...props} />;
});
ImageView.displayName = "ImageView";

export default ImageView;
