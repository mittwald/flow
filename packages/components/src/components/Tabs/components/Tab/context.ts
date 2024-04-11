import { createContext, useContext } from "react";

interface TabContext {
  id?: string;
}

const tabContext = createContext<TabContext>({});

export const useTabTabContext = (): TabContext => useContext(tabContext);

export const TabContextProvider = tabContext.Provider;
