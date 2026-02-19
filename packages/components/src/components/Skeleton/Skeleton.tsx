import type { ComponentProps, CSSProperties, FC } from "react";
import React from "react";
import styles from "./Skeleton.module.scss";
import clsx from "clsx";

export interface SkeletonProps extends ComponentProps<"div"> {
  /** The width of the skeleton. */
  width?: CSSProperties["width"];
  /** The height of the skeleton. */
  height?: CSSProperties["height"];
}

/** @flr-generate all */
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
