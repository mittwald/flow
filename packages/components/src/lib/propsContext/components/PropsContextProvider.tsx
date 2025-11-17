import { usePropsContextLevel } from "@/lib/propsContext/inherit/propsContextLevel";
import { PropsContextLevelProvider } from "@/lib/propsContext/inherit/PropsContextLevelProvider";
import type { PropsContextLevelMode } from "@/lib/propsContext/inherit/types";
import mergePropsContext from "@/lib/propsContext/mergePropsContext";
import { propsContext, usePropsContext } from "@/lib/propsContext/propsContext";
import type { PropsContext as PropsContextShape } from "@/lib/propsContext/types";
import type { DependencyList, FC, PropsWithChildren } from "react";
import { memo, useMemo } from "react";
import { filterPreservedInheritEntries } from "@/lib/propsContext/inherit/lib";

interface Props extends PropsWithChildren {
  props: PropsContextShape;
  dependencies?: DependencyList;
  clear?: boolean;
  levelMode?: PropsContextLevelMode;
}

const Provider = memo(propsContext.Provider);
Provider.displayName = "PropsContextProviderInner";

export const PropsContextProvider: FC<Props> = memo((props) => {
  const {
    props: providedProps,
    dependencies = [],
    levelMode = "reset",
    children,
    clear = false,
  } = props;

  const parentPropsContext = usePropsContext();

  const readPropsContextLevel = usePropsContextLevel(
    levelMode === "keep" ? "decrement" : levelMode,
  );

  const propsWithParentPropsContext = useMemo(
    () =>
      mergePropsContext(
        clear
          ? filterPreservedInheritEntries(parentPropsContext)
          : parentPropsContext,
        providedProps,
        readPropsContextLevel,
      ),
    [parentPropsContext, clear, readPropsContextLevel, ...dependencies],
  );

  return (
    <PropsContextLevelProvider mode={levelMode}>
      <Provider value={propsWithParentPropsContext}>{children}</Provider>
    </PropsContextLevelProvider>
  );
});

PropsContextProvider.displayName = "PropsContextProvider";

export default PropsContextProvider;
