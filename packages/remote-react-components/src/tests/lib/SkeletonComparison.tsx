import type { FC, ReactNode } from "react";
import type { testEnvironments } from "@/tests/lib/environments";

interface Props {
  components: (typeof testEnvironments)[number]["components"];
  children: ReactNode;
}

/**
 * Renders a scenario twice, side by side: in an enabled `SkeletonMode` on the
 * left and loaded on the right, so a screenshot shows whether the skeleton
 * matches the real UI. Each side gets its own `Content`: `SkeletonMode` renders
 * no element, and two sibling `Section`s would get the stacking gap.
 */
export const SkeletonComparison: FC<Props> = (props) => {
  const {
    components: { SkeletonMode, ColumnLayout, Content },
    children,
  } = props;

  return (
    <ColumnLayout s={[1, 1]} m={[1, 1]} l={[1, 1]} gap="xl">
      <Content>
        <SkeletonMode>{children}</SkeletonMode>
      </Content>
      <Content>
        <SkeletonMode isEnabled={false}>{children}</SkeletonMode>
      </Content>
    </ColumnLayout>
  );
};
