import { TableRowSkeletonView } from "@/components/List/components/Table/components/TableRowSkeletonView";
import { useList } from "@/components/List/hooks/useList";
import type { FC } from "react";

export const TableBodyLoadingView: FC = () => {
  const list = useList();

  return (
    <>
      {Array.from(Array(list.loadingItemsCount)).map((_, i) => (
        <TableRowSkeletonView key={i} />
      ))}
    </>
  );
};
