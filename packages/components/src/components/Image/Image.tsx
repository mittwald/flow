import React, { ComponentProps, FC } from "react";
import { ClearPropsContext, useProps } from "@/lib/propsContext";

export interface ImageProps extends ComponentProps<"img"> {}

export const Image: FC<ImageProps> = (props) => {
  const propsWithContext = useProps("Image", props);
  return (
    <ClearPropsContext>
      <img {...propsWithContext} />
    </ClearPropsContext>
  );
};

export default Image;
