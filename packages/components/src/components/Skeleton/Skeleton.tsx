import type { ComponentProps, FC } from "react";
import React from "react";
import styles from "./Skeleton.module.scss";
import clsx from "clsx";

export interface SkeletonProps extends ComponentProps<"div"> {
  width?: string;
  height?: string;
}

export const Skeleton: FC<SkeletonProps> = (props) => {
  const { width, height, className, style, ...rest } = props;

  const rootClassName = clsx(styles.skeleton, className);

  return (
    <div aria-hidden style={{ height, width }} {...rest}>
      <div className={rootClassName} style={style} />
    </div>
  );
};

export default Skeleton;
