import React, { FC, HTMLAttributes } from "react";
import styles from "./Image.module.css";
import clsx from "clsx";
import { useProps } from "@/lib/propsContext";

export interface ImageProps extends HTMLAttributes<HTMLImageElement> {}

export const Image: FC<ImageProps> = (props) => {
  const { className, ...rest } = useProps("image", props);

  const rootClassName = clsx(className, styles.root);

  return <img className={rootClassName} {...rest} />;
};

export default Image;
