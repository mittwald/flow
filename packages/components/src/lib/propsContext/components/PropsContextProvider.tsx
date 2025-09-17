import { usePropsContextLevel } from "@/lib/propsContext/inherit/propsContextLevel";
import { PropsContextLevelProvider } from "@/lib/propsContext/inherit/PropsContextLevelProvider";
import type { PropsContextLevelMode } from "@/lib/propsContext/inherit/types";
import mergePropsContext from "@/lib/propsContext/mergePropsContext";
import { propsContext, usePropsContext } from "@/lib/propsContext/propsContext";
import type { PropsContext as PropsContextShape } from "@/lib/propsContext/types";
import type { DependencyList, FC, PropsWithChildren } from "react";
import { useMemo } from "react";

interface Props extends PropsWithChildren {
  props: PropsContextShape;
  dependencies?: DependencyList;
  clear?: boolean;
  levelMode?: PropsContextLevelMode;
}

export const PropsContextProvider: FC<Props> = (props) => {
  const {
    props: providedProps,
    dependencies = [],
    levelMode = "reset",
    children,
  } = props;

  const parentPropsContext = usePropsContext();

  const readPropsContextLevel = usePropsContextLevel(
    levelMode === "keep" ? "decrement" : levelMode,
  );

  const propsWithParentPropsContext = useMemo(
    () =>
      mergePropsContext(
        parentPropsContext,
        providedProps,
        readPropsContextLevel,
      ),
    [parentPropsContext, readPropsContextLevel, ...dependencies],
  );

  return (
    <PropsContextLevelProvider mode={levelMode}>
      <propsContext.Provider value={propsWithParentPropsContext}>
        {children}
      </propsContext.Provider>
    </PropsContextLevelProvider>
  );
};

export default PropsContextProvider;
