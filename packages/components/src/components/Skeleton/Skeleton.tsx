import type { ComponentProps, CSSProperties } from "react";
import styles from "./Skeleton.module.scss";
import clsx from "clsx";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface SkeletonProps
  extends ComponentProps<"div">, FlowComponentProps {
  /** The width of the skeleton. */
  width?: CSSProperties["width"];
  /** The height of the skeleton. */
  height?: CSSProperties["height"];
}

/** @flr-generate all */
export const Skeleton = flowComponent("Skeleton", (props) => {
  const { width, height, className, ref, ...rest } = props;

  const rootClassName = clsx(styles.skeleton, className);

  return (
    <div
      className={rootClassName}
      aria-hidden
      style={{ height, width }}
      {...rest}
      ref={ref}
    />
  );
});

export default Skeleton;
