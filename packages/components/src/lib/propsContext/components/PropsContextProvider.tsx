import mergePropsContext from "@/lib/propsContext/mergePropsContext";
import { addNestingLevel } from "@/lib/propsContext/nestedPropsContext/lib";
import { propsContext, usePropsContext } from "@/lib/propsContext/propsContext";
import { arePropsContextsEqual } from "@/lib/propsContext/arePropsContextsEqual";
import type { PropsContext as PropsContextShape } from "@/lib/propsContext/types";
import type { DependencyList, FC, PropsWithChildren } from "react";
import { memo, useMemo, useRef } from "react";

interface Props extends PropsWithChildren {
  props: PropsContextShape;
  dependencies?: DependencyList;
}

const Provider = memo(propsContext.Provider);
Provider.displayName = "PropsContextProviderInner";

const useStablePropsContext = (props: PropsContextShape) => {
  const stableProps = useRef(props);
  if (!arePropsContextsEqual(stableProps.current, props)) {
    stableProps.current = props;
  }
  return stableProps.current;
};

export const PropsContextProvider: FC<Props> = memo((props) => {
  const { props: providedProps, dependencies = [], children } = props;

  const parentPropsContext = usePropsContext();
  const stableProvidedProps = useStablePropsContext(providedProps);

  const propsWithParentPropsContext = useMemo(() => {
    const propsWithNestingLevel = addNestingLevel(stableProvidedProps);
    return mergePropsContext(parentPropsContext, propsWithNestingLevel);
  }, [parentPropsContext, stableProvidedProps, ...dependencies]);

  return <Provider value={propsWithParentPropsContext}>{children}</Provider>;
});

PropsContextProvider.displayName = "PropsContextProvider";

export default PropsContextProvider;
