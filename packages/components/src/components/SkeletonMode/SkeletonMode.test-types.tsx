import { createRef } from "react";
import { SkeletonMode } from "@/components/SkeletonMode";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testRef() {
  const ref = createRef<HTMLDivElement>();
  // @ts-expect-error SkeletonMode has no element of its own to ref
  <SkeletonMode ref={ref}>Content</SkeletonMode>;
}
