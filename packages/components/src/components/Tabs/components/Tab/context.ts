import { createContext, useContext } from "react";
import type { Key } from "react-aria";

interface TabContext {
  id: Key;
}

const tabContext = createContext<TabContext>({
  id: "undefined",
});

export const useTabContext = (): TabContext => useContext(tabContext);

export const TabContextProvider = tabContext.Provider;
