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

export const TableLoadingView: FC<TableSupportedComponentProps> = (props) => {
  return (
    <TableComponent {...props}>
      <TableHeader>
        <TableColumn>
          <SkeletonText width="100%" />
        </TableColumn>
      </TableHeader>
      <TableBody>
        {Array.from(Array(5)).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <SkeletonText width="100%" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TableComponent>
  );
};
