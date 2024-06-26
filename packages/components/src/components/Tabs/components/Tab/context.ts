import { createContext, useContext } from "react";

interface TabContext {
  id: string;
}

const tabContext = createContext<TabContext>({
  id: "undefined",
});

export const useTabContext = (): TabContext => useContext(tabContext);

export const TabContextProvider = tabContext.Provider;
