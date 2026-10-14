import * as Aria from "react-aria-components";
import type { FC, ReactNode } from "react";
import { useLabelledBySectionHeading } from "@/components/Section/context";

export type GridListProps = Aria.GridListProps<never> & {
  tileMaxWidth: number;
  emptyView?: ReactNode;
};

/** @flr-generate all */
export const GridList: FC<GridListProps> = (props) => {
  const { tileMaxWidth, emptyView, ...rest } = props;
  const ariaLabelledBy = useLabelledBySectionHeading(rest);

  return (
    <Aria.GridList
      {...rest}
      aria-labelledby={ariaLabelledBy}
      renderEmptyState={() => emptyView}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${tileMaxWidth}px, 1fr))`,
      }}
    />
  );
};

export default GridList;
