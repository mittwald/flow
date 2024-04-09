import type { ComponentProps, FC } from "react";
import React from "react";
import styles from "./Skeleton.module.scss";
import clsx from "clsx";
import { useProps } from "@/lib/propsContext";

export interface SkeletonProps extends ComponentProps<"div"> {
  fontSize?: number | string;
  width?: number | string;
  height?: number | string;
}

export const Skeleton: FC<SkeletonProps> = (props) => {
  const { className, fontSize, width, height, ...rest } = useProps(
    "Skeleton",
    props,
  );

  const rootClassName = clsx(styles.skeleton, className);

  return (
    <div
      style={{ fontSize, width, height }}
      className={rootClassName}
      aria-hidden
      {...rest}
    />
  );
};

export default Skeleton;
