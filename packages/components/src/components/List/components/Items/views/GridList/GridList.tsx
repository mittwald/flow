import * as Aria from "react-aria-components";
import type { FC } from "react";
import { EmptyView } from "@/components/List/views/EmptyView";

export type GridListProps = Aria.GridListProps<never> & {
  tileMaxWidth: number;
};

/** @flr-generate all */
export const GridList: FC<GridListProps> = (props) => {
  const { tileMaxWidth, ...rest } = props;

  return (
    <Aria.GridList
      {...rest}
      renderEmptyState={() => <EmptyView />}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${tileMaxWidth}px, 1fr))`,
      }}
    />
  );
};

export default GridList;
