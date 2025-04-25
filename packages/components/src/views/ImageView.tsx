/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { ImageProps } from "@/components/Image";
import React, { useContext } from "react";
import { Image } from "@/components/Image";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ImageView: FC<ImageProps> = (props) => {
  const View = useContext(viewComponentContext)["Image"] ?? Image;
  return <View {...props} />;
};

export default ImageView;
