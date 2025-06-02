import type { FC } from "react";
import React from "react";
import type { TableSupportedComponentProps } from "@/components/List/model/table/types";
import TableView from "@/views/TableView";
import TableColumnView from "@/views/TableColumnView";
import TableBodyView from "@/views/TableBodyView";
import TableRowView from "@/views/TableRowView";
import SkeletonTextView from "@/views/SkeletonTextView";
import TableHeaderView from "@/views/TableHeaderView";
import TableCellView from "@/views/TableCellView";

export const TableLoadingView: FC<TableSupportedComponentProps> = (props) => {
  return (
    <TableView {...props}>
      <TableHeaderView>
        <TableColumnView>
          <SkeletonTextView width="100%" />
        </TableColumnView>
      </TableHeaderView>
      <TableBodyView>
        {Array.from(Array(5)).map((_, i) => (
          <TableRowView key={i}>
            <TableCellView>
              <SkeletonTextView width="100%" />
            </TableCellView>
          </TableRowView>
        ))}
      </TableBodyView>
    </TableView>
  );
};
