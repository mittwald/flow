import type { ComponentProps, CSSProperties } from "react";
import clsx from "clsx";
import styles from "./SkeletonText.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface SkeletonTextProps
  extends ComponentProps<"span">, FlowComponentProps<HTMLSpanElement> {
  /** The width of the skeleton text. */
  width?: CSSProperties["width"];
}

/** @flr-generate all */
export const SkeletonText = flowComponent("SkeletonText", (props) => {
  const { width, style = {}, className, ref, ...rest } = props;
  return (
    <span
      aria-hidden
      style={{ width, ...style }}
      {...rest}
      className={clsx(styles.skeletonText, className)}
      ref={ref}
    />
  );
});

export default SkeletonText;
