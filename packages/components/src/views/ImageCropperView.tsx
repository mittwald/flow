/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  ImageCropper,
  type ImageCropperProps,
} from "@/components/ImageCropper/ImageCropper";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ImageCropperView: FC<ImageCropperProps> = memo((props) => {
  const View = useContext(viewComponentContext)["ImageCropper"] ?? ImageCropper;
  return <View {...props} />;
});
ImageCropperView.displayName = "ImageCropperView";

export default ImageCropperView;
