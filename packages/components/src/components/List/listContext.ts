import { createContext } from "react";
import type List from "@/components/List/model/List";

interface ListContext {
  list: List<never>;
}

export const listContext = createContext<ListContext>({} as ListContext);
