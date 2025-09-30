import {
  propsContextLevelContext,
  usePropsContextLevel,
} from "@/lib/propsContext/inherit/propsContextLevel";
import type { PropsContextLevelMode } from "@/lib/propsContext/inherit/types";
import { memo, type FC, type PropsWithChildren } from "react";

export interface PropsContextLevelProviderProps extends PropsWithChildren {
  mode: PropsContextLevelMode;
}

const Provider = memo(propsContextLevelContext.Provider);
Provider.displayName = "PropsContextLevelContextProviderInner";

export const PropsContextLevelProvider: FC<PropsContextLevelProviderProps> =
  memo((props) => {
    const { mode, children } = props;

    const newLevel = usePropsContextLevel(mode);

    if (mode === "keep") {
      return children;
    }

    return <Provider value={newLevel}>{children}</Provider>;
  });

PropsContextLevelProvider.displayName = "PropsContextLevelProvider";

export default PropsContextLevelProvider;
