import React, { ComponentProps, FC } from "react";
import styles from "./Skeleton.module.css";
import clsx from "clsx";
import { useProps } from "@/lib/propsContext";

export interface SkeletonProps extends ComponentProps<"div"> {
  fontSize?: number | string;
}

export const Skeleton: FC<SkeletonProps> = (props) => {
  const { className, fontSize, ...rest } = useProps("Skeleton", props);

  const rootClassName = clsx(className, styles.root);

  return <div style={{ fontSize }} className={rootClassName} {...rest}></div>;
};

export default Skeleton;
