import { getLevelAfterModeApplied } from "@/lib/propsContext/inherit/lib";
import {
  propsContextLevelContext,
  usePropsContextLevel,
} from "@/lib/propsContext/inherit/propsContextLevel";
import { type FC, type PropsWithChildren } from "react";

export type PropsContextLevelMode = "reset" | "increment" | "keep";

export interface PropsContextLevelProviderProps extends PropsWithChildren {
  mode: PropsContextLevelMode;
}

export const PropsContextLevelProvider: FC<PropsContextLevelProviderProps> = (
  props,
) => {
  const { mode, children } = props;

  const parentLevel = usePropsContextLevel();

  if (mode === "keep") {
    return children;
  }

  const newLevel = getLevelAfterModeApplied(parentLevel, mode);

  return (
    <propsContextLevelContext.Provider value={newLevel}>
      {children}
    </propsContextLevelContext.Provider>
  );
};
