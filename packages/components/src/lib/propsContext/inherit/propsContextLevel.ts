import { createContext, useContext } from "react";

export const propsContextLevelContext = createContext<number>(0);

export const usePropsContextLevel = (): number =>
  useContext(propsContextLevelContext);
