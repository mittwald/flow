import { createContext } from "react";
import type List from "@/components/List/model/List";
import type { AnyData } from "@/components/List/model/item/types";

interface ListContext {
  list: List<AnyData>;
}

export const listContext = createContext<ListContext>({} as ListContext);
