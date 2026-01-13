import mergePropsContext from "@/lib/propsContext/mergePropsContext";
import { addNestingLevel } from "@/lib/propsContext/nestedPropsContext/lib";
import { propsContext, usePropsContext } from "@/lib/propsContext/propsContext";
import type { PropsContext as PropsContextShape } from "@/lib/propsContext/types";
import type { DependencyList, FC, PropsWithChildren } from "react";
import { memo, useMemo } from "react";

interface Props extends PropsWithChildren {
  props: PropsContextShape;
  dependencies?: DependencyList;
}

const Provider = memo(propsContext.Provider);
Provider.displayName = "PropsContextProviderInner";

export const PropsContextProvider: FC<Props> = memo((props) => {
  const { props: providedProps, dependencies = [], children } = props;

  const parentPropsContext = usePropsContext();

  const propsWithParentPropsContext = useMemo(() => {
    const propsWithNestingLevel = addNestingLevel(providedProps);
    return mergePropsContext(parentPropsContext, propsWithNestingLevel);
  }, [parentPropsContext, ...dependencies]);

  return <Provider value={propsWithParentPropsContext}>{children}</Provider>;
});

PropsContextProvider.displayName = "PropsContextProvider";

export default PropsContextProvider;
