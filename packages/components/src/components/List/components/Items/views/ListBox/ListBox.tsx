import * as Aria from "react-aria-components";
import type { FC } from "react";
import { EmptyView } from "@/components/List/views/EmptyView";

export type ListBoxProps = Aria.ListBoxProps<never> & {
  tileMaxWidth: number;
};

/** @flr-generate all */
export const ListBox: FC<ListBoxProps> = (props) => {
  const { tileMaxWidth, ...rest } = props;

  return (
    <Aria.ListBox
      {...rest}
      renderEmptyState={() => <EmptyView />}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${tileMaxWidth}px, 1fr))`,
      }}
    />
  );
};

export default ListBox;
