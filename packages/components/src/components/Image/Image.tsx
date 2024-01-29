import React, { ComponentProps, FC } from "react";
import { useProps } from "@/lib/propsContext";

export interface ImageProps extends ComponentProps<"img"> {}

export const Image: FC<ImageProps> = (props) => {
  return <img {...useProps("Image", props)} />;
};

export default Image;
