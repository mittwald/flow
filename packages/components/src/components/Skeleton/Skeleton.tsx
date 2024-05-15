import type { ComponentProps, FC } from "react";
import React from "react";
import styles from "./Skeleton.module.scss";
import clsx from "clsx";

export type SkeletonProps = ComponentProps<"div">;

export const Skeleton: FC<SkeletonProps> = (props) => {
  const { className, ...rest } = props;

  const rootClassName = clsx(styles.skeleton, className);

  return <div className={rootClassName} aria-hidden {...rest} />;
};

export default Skeleton;
