import { createContext } from "react";

export const viewComponentContext = createContext<Partial<FlowViewComponents>>(
  {},
);
