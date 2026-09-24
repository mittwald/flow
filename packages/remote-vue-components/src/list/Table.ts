import {
  SkeletonText,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/auto-generated";
import { watchMobxValue } from "@/lib/mobxSelector";
import { defineComponent, h, type VNodeChild } from "vue";
import { injectListModel } from "./listContext";
import { className } from "./styles";
import { composition } from "@/lib/composition";

const tableStyles = {
  table: "flow--list--table",
  isLoading: "flow--list--table--is-loading",
  row: "flow--list--table--row",
  hasAction: "flow--list--table--has-action",
} as const;

/**
 * The list as a table.
 *
 * The columns, the cells and their render functions come from the `ListTable*`
 * elements inside the list — the same arrangement Flow's React list reads out
 * of its children, over the same remote elements.
 */
export const ListTableView = defineComponent({
  name: "ListTableView",

  setup() {
    const list = injectListModel();

    const items = watchMobxValue(() => list.renderedItems);
    const isEmpty = watchMobxValue(() => list.isEmpty);
    const isLoading = watchMobxValue(() => list.loaderState.isLoading);
    const isInitiallyLoading = watchMobxValue(
      () => list.loaderState.isInitiallyLoading,
    );

    return () => {
      const table = list.shape.table;

      if (!table || isEmpty.value) {
        return null;
      }

      const onAction = list.shape.onAction;

      const renderCells = (data: never): VNodeChild[] =>
        table.cells.map((cell, index) =>
          h(TableCell, { key: index, ...cell.props }, () =>
            cell.render?.(data),
          ),
        );

      const rows = items.value.map((item) =>
        h(
          TableRow,
          {
            key: item.id,
            id: item.id,
            ...table.rowProps,
            class: className(
              tableStyles.row,
              onAction && tableStyles.hasAction,
              table.rowProps.class as string | undefined,
            ),
            onAction: onAction ? () => onAction(item.data) : undefined,
          },
          () => renderCells(item.data),
        ),
      );

      /* Placeholder rows in the table's own shape, one cell per column. */
      const skeletonRows = Array.from(
        { length: list.loadingItemsCount },
        (_unused, index) =>
          h(TableRow, { key: `skeleton-${index}`, ...table.rowProps }, () =>
            table.cells.map((cell, cellIndex) =>
              h(TableCell, { key: cellIndex, ...cell.props }, () =>
                h(SkeletonText, { width: "10em" }),
              ),
            ),
          ),
      );

      return h(
        Table,
        {
          "aria-label": list.shape["aria-label"],
          "aria-labelledby": list.shape["aria-labelledby"],
          ...list.shape.componentProps,
          ...table.props,
          class: className(
            tableStyles.table,
            isLoading.value && tableStyles.isLoading,
            table.props.class as string | undefined,
          ),
          "aria-hidden": isInitiallyLoading.value,
          "aria-busy": isLoading.value,
        },
        () => [
          h(TableHeader, table.headerProps, () =>
            table.columns.map((column, index) =>
              h(TableColumn, { key: index, ...column.props }, () =>
                column.render?.(),
              ),
            ),
          ),
          h(TableBody, table.bodyProps, () =>
            isInitiallyLoading.value ? skeletonRows : rows,
          ),
        ],
      );
    };
  },
});

composition(ListTableView);

export default ListTableView;
