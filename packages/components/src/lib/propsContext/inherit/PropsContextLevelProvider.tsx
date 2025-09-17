import {
  propsContextLevelContext,
  usePropsContextLevel,
} from "@/lib/propsContext/inherit/propsContextLevel";
import type { PropsContextLevelMode } from "@/lib/propsContext/inherit/types";
import { type FC, type PropsWithChildren } from "react";

export interface PropsContextLevelProviderProps extends PropsWithChildren {
  mode: PropsContextLevelMode;
}

export const PropsContextLevelProvider: FC<PropsContextLevelProviderProps> = (
  props,
) => {
  const { mode, children } = props;

  const newLevel = usePropsContextLevel(mode);

  if (mode === "keep") {
    return children;
  }

  return (
    <propsContextLevelContext.Provider value={newLevel}>
      {children}
    </propsContextLevelContext.Provider>
  );
};
