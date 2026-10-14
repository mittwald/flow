import type { ComponentProps, CSSProperties, FC } from "react";
import clsx from "clsx";
import styles from "./SkeletonText.module.scss";

export interface SkeletonTextProps extends ComponentProps<"span"> {
  /** The width of the skeleton text. */
  width?: CSSProperties["width"];
}

/** @flr-generate all */
export const SkeletonText: FC<SkeletonTextProps> = (props) => {
  const { width, style = {}, className, ...rest } = props;
  return (
    <span
      aria-hidden
      style={{ width, ...style }}
      {...rest}
      className={clsx(styles.skeletonText, className)}
    />
  );
};

export default SkeletonText;
