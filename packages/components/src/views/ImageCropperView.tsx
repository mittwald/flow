/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  ImageCropper,
  type ImageCropperProps,
} from "@/components/ImageCropper";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ImageCropperView: FC<ImageCropperProps> = (props) => {
  const View = useContext(viewComponentContext)["ImageCropper"] ?? ImageCropper;
  return <View {...props} />;
};

export default ImageCropperView;
