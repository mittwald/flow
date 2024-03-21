import { createContext } from "react";
import List from "@/components/List/model/List";
import { AnyData } from "@/components/List/model/item/types";

interface ListContext {
  list: List<AnyData>;
}

export const listContext = createContext<ListContext>({} as ListContext);
