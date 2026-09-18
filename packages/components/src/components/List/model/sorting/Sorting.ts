import { ListSorting } from "@mittwald/flow-components-base";

/**
 * Framework-free as it stands, so it lives in `@mittwald/flow-components-base`
 * whole — a sorting only translates between the TanStack table and the settings
 * store, and both are frameworkless. Kept under its own name here because that
 * is what the List's components import.
 */
export { ListSorting as Sorting };
export default ListSorting;
