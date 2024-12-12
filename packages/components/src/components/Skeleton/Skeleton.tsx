import type { ComponentProps, FC } from "react";
import React from "react";
import styles from "./Skeleton.module.scss";
import clsx from "clsx";

export interface SkeletonProps extends ComponentProps<"div"> {
  /** The width of the skeleton. */
  width?: string;
  /** The height of the skeleton. */
  height?: string;
}

export const Skeleton: FC<SkeletonProps> = (props) => {
  const { width, height, className, ...rest } = props;

  const rootClassName = clsx(styles.skeleton, className);

  return (
    <div
      className={rootClassName}
      aria-hidden
      style={{ height, width }}
      {...rest}
    />
  );
};

export default Skeleton;
