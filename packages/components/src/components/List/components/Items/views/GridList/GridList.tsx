import { useIgnoreClickAfterDrag } from "@/lib/hooks/useIgnoreClickAfterDrag";
import { mergeRefs } from "@react-aria/utils";
import type { FC, ReactNode, Ref } from "react";
import * as Aria from "react-aria-components";

export type GridListProps = Aria.GridListProps<never> & {
  tileMaxWidth: number;
  emptyView?: ReactNode;
  ref?: Ref<HTMLDivElement>;
};

/** @flr-generate all */
export const GridList: FC<GridListProps> = (props) => {
  const { tileMaxWidth, emptyView, ref, ...rest } = props;
  const dragRef = useIgnoreClickAfterDrag<HTMLDivElement>();

  return (
    <Aria.GridList
      {...rest}
      ref={mergeRefs(ref, dragRef)}
      renderEmptyState={() => emptyView}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${tileMaxWidth}px, 1fr))`,
      }}
    />
  );
};

export default GridList;
