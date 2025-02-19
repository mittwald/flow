// Keep this exports on top, due to CSS filename generation
export * from "./components/TableBody";
export * from "./components/TableCell";
export * from "./components/TableColumn";
export * from "./components/TableHeader";
export * from "./components/TableRow";
export * from "./components/TableFooterRow";

import { Table } from "./Table";

export { type TableProps, Table } from "./Table";
export default Table;
