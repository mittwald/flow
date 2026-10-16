import type { Ref } from "react";
import { memo } from "react";
import clsx from "clsx";
import type { Key } from "react-aria-components";
import type ListModel from "@/components/List/model/List";
import TableRowView from "@/views/TableRowView";
import TableCellView from "@/views/TableCellView";
import styles from "../Table.module.scss";

interface Props {
  id: Key;
  data: never;
  list: ListModel<never>;
  /** Stable invoker of the list's latest `onAction` */
  onAction?: (data: never) => void;
  triggerRef?: Ref<HTMLTableRowElement>;
}

const RowImpl = (props: Props) => {
  const { id, data, list, onAction, triggerRef } = props;
  const row = list.table?.body.row;

  if (!row) {
    return null;
  }

  return (
    <TableRowView
      className={clsx(
        styles.row,
        onAction && styles.hasAction,
        row.componentProps.className,
      )}
      id={id}
      onAction={onAction ? () => onAction(data) : undefined}
      {...row.componentProps}
      {...(triggerRef ? { ref: triggerRef } : {})}
    >
      {row.cells.map((cell, i) => (
        <TableCellView key={i} {...cell.componentProps}>
          {cell.renderFn ? cell.renderFn(data, list) : undefined}
        </TableCellView>
      ))}
    </TableRowView>
  );
};

// The list model is rebuilt on every render, so it cannot be compared by
// identity. A row that declares `dependencies` re-renders only when its data,
// those dependencies or a cell's props change — the cells' render functions
// count by the dependencies. Without them, rows re-render with the list.
export const Row = memo(
  RowImpl,
  (prev, next) =>
    prev.id === next.id &&
    prev.data === next.data &&
    prev.triggerRef === next.triggerRef &&
    !!prev.onAction === !!next.onAction &&
    !!prev.list.table?.body.row.rendersSameAs(next.list.table?.body.row),
);
Row.displayName = "Row";

export default Row;
