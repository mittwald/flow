import { Children, type FC, type PropsWithChildren } from "react";
import { SkeletonTextContent } from "@/components/SkeletonMode/components/SkeletonTextContent";
import { useSkeletonMode } from "@/components/SkeletonMode/skeletonModeContext";
import {
  getTextOfChild,
  isTextChild,
} from "@/components/SkeletonMode/lib/isTextChild";

/**
 * The text rule for containers: turns raw string and number children into bars
 * and leaves every element child to its own skeleton rendering. Outside an
 * enabled `SkeletonMode` it renders its children unchanged.
 */
export const SkeletonRawText: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const isSkeleton = useSkeletonMode();

  if (!isSkeleton) {
    return children;
  }

  return Children.map(children, (child) =>
    isTextChild(child) && getTextOfChild(child) !== "" ? (
      <SkeletonTextContent defaultWidth="8em">{child}</SkeletonTextContent>
    ) : (
      child
    ),
  );
};

export default SkeletonRawText;
