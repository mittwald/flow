import { createContext, useContext } from "react";

/**
 * Whether a column is the first of its `TableHeader`. Undefined outside a
 * header that can tell, e.g. with dynamic `columns`.
 */
export const IsFirstColumnContext = createContext<boolean | undefined>(
  undefined,
);

export const useIsFirstColumn = () => useContext(IsFirstColumnContext);
