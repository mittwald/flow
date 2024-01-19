import React, { ComponentProps, FC } from "react";
import styles from "./Image.module.css";
import clsx from "clsx";
import { useProps } from "@/lib/propsContext";

export interface ImageProps extends ComponentProps<"img"> {}

export const Image: FC<ImageProps> = (props) => {
  const { className, ...rest } = useProps("Image", props);

  const rootClassName = clsx(className, styles.root);

  return <img className={rootClassName} {...rest} />;
};

export default Image;
