import { createContext, useContext } from "react";
import type { ActionFn } from "@/components/Action/types";

const actionContext = createContext<ActionFn | undefined>(undefined);

export const useParentAction = (): ActionFn | undefined =>
  useContext(actionContext);

export const ActionContextProvider = actionContext.Provider;
