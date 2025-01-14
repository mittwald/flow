import { createContext } from "react";
import type { ActionModel } from "~/components/Action/models/ActionModel";

export const actionContext = createContext<ActionModel | undefined>(undefined);
export const ActionContextProvider = actionContext.Provider;
