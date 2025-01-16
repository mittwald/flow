import * as Aria from "react-aria-components";
import type { FC } from "react";
import { EmptyView } from "~/components/List/views/EmptyView";

export type GridListProps = Aria.GridListProps<never>;

/** @flr-generate all */
export const GridList: FC<GridListProps> = (props) => {
  return <Aria.GridList {...props} renderEmptyState={() => <EmptyView />} />;
};

export default GridList;
