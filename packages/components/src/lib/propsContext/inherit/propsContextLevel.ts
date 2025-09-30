import { getLevelAfterModeApplied } from "@/lib/propsContext/inherit/lib";
import type { PropsContextLevelMode } from "@/lib/propsContext/inherit/types";
import { createContext, useContext } from "react";

export const propsContextLevelContext = createContext<number>(0);

export const usePropsContextLevel = (
  mode: PropsContextLevelMode = "keep",
): number => {
  const level = useContext(propsContextLevelContext);
  return getLevelAfterModeApplied(level, mode);
};
