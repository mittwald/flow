import type { FC } from "react";
import React from "react";
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "~/components/Table";
import { SkeletonText } from "~/components/SkeletonText";
import type { TableSupportedComponentProps } from "~/components/List/model/table/types";
import { useViewComponents } from "~/lib/viewComponentContext/useViewComponent";

export const TableLoadingView: FC<TableSupportedComponentProps> = (props) => {
  const {
    TableView,
    TableBodyView,
    TableCellView,
    TableHeaderView,
    TableRowView,
    SkeletonTextView,
    TableColumnView,
  } = useViewComponents(
    ["Table", TableComponent],
    ["TableHeader", TableHeader],
    ["SkeletonText", SkeletonText],
    ["TableBody", TableBody],
    ["TableRow", TableRow],
    ["TableCell", TableCell],
    ["TableColumn", TableColumn],
  );

  return (
    <TableView {...props}>
      <TableHeaderView>
        <TableColumnView>
          <SkeletonText width="100%" />
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
