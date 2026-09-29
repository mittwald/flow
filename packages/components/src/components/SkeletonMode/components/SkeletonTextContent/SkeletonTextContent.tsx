import type { CSSProperties, FC, PropsWithChildren } from "react";
import { SkeletonText } from "@/components/SkeletonText";
import { hasContent } from "@/components/SkeletonMode/lib/hasContent";
import {
  SkeletonModeReset,
  useSkeletonMode,
} from "@/components/SkeletonMode/skeletonModeContext";
import styles from "./SkeletonTextContent.module.scss";

export interface SkeletonTextContentProps extends PropsWithChildren {
  /** Width of the bar when there is no content to take the width from. */
  defaultWidth: CSSProperties["width"];
}

/**
 * The text rule of `SkeletonMode`: content becomes one bar per line in the
 * width of that line, no content becomes a `SkeletonText` in `defaultWidth`.
 * Outside an enabled `SkeletonMode` it renders its children unchanged.
 */
export const SkeletonTextContent: FC<SkeletonTextContentProps> = (props) => {
  const { children, defaultWidth } = props;

  const isSkeleton = useSkeletonMode();

  if (!isSkeleton) {
    return children;
  }

  if (!hasContent(children)) {
    return <SkeletonText width={defaultWidth} />;
  }

  return (
    <span className={styles.skeletonTextContent} aria-hidden>
      <SkeletonModeReset>{children}</SkeletonModeReset>
    </span>
  );
};

export default SkeletonTextContent;
