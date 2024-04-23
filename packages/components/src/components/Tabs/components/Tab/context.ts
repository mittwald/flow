import { createContext, useContext } from "react";
import type { Status } from "@/lib/types/props";

interface TabContext {
  id: string;
  status?: Status;
}

const tabContext = createContext<TabContext>({
  id: "undefined",
  status: undefined,
});

export const useTabContext = (): TabContext => useContext(tabContext);

export const TabContextProvider = tabContext.Provider;
