import type { ComponentProps, FC } from "react";
import React from "react";
import styles from "./SkeletonText.module.scss";

export interface SkeletonTextProps extends ComponentProps<"div"> {
  /** The width of the skeleton text. */
  width?: string;
}

/** @flr-generate all */
export const SkeletonText: FC<SkeletonTextProps> = (props) => {
  const { width, style = {}, ...rest } = props;
  return (
    <div
      aria-hidden
      className={styles.skeletonText}
      style={{ width, ...style }}
      {...rest}
    />
  );
};

export default SkeletonText;
