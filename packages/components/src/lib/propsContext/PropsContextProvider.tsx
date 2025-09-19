import { usePropsContextLevel } from "@/lib/propsContext/inherit/propsContextLevel";
import { PropsContextLevelProvider } from "@/lib/propsContext/inherit/PropsContextLevelProvider";
import mergePropsContext from "@/lib/propsContext/mergePropsContext";
import { propsContext, usePropsContext } from "@/lib/propsContext/propsContext";
import type { PropsContext as PropsContextShape } from "@/lib/propsContext/types";
import type { DependencyList, FC, PropsWithChildren } from "react";
import { useMemo } from "react";

interface Props extends PropsWithChildren {
  props: PropsContextShape;
  dependencies?: DependencyList;
  resetPropsContextLevel?: boolean;
}

export const PropsContextProvider: FC<Props> = (props) => {
  const {
    props: providedProps,
    dependencies = [],
    resetPropsContextLevel = true,
    children,
  } = props;

  const parentPropsContext = usePropsContext();
  const memoizedProps = useMemo(() => providedProps, dependencies);
  const propsContextLevel = usePropsContextLevel();
  const propsContextLevelToUse = resetPropsContextLevel ? 0 : propsContextLevel;

  const propsWithParentPropsContext = useMemo(
    () =>
      mergePropsContext(
        parentPropsContext,
        memoizedProps,
        propsContextLevelToUse,
      ),
    [memoizedProps, parentPropsContext, propsContextLevelToUse],
  );

  let component = (
    <propsContext.Provider value={propsWithParentPropsContext}>
      {children}
    </propsContext.Provider>
  );

  if (resetPropsContextLevel) {
    component = (
      <PropsContextLevelProvider mode="reset">
        {component}
      </PropsContextLevelProvider>
    );
  }

  return component;
};

export default PropsContextProvider;
