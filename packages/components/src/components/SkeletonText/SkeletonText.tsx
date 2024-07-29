import type { ComponentProps, FC } from "react";
import React from "react";
import styles from "./SkeletonText.module.scss";

export interface SkeletonProps extends ComponentProps<"div"> {
  width?: string;
}

export const Skeleton: FC<SkeletonProps> = (props) => {
  const { width, style = {}, ...rest } = props;
  return (
    <div aria-hidden style={{ width, ...style }} {...rest}>
      <div className={styles.skeletonText} />
    </div>
  );
};

export default Skeleton;
