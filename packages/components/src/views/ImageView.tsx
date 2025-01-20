/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Image, type ImageProps } from "~/components/Image";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const ImageView: FC<ImageProps> = (props) => {
  const View = useContext(viewComponentContext)["Image"] ?? Image;
  return <View {...props} />;
};

export default ImageView;
