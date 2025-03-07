import type { DependencyList, FC, PropsWithChildren } from "react";
import React, { useMemo } from "react";
import type { PropsContext as PropsContextShape } from "@/lib/propsContext/types";
import { propsContext, useContextProps } from "@/lib/propsContext/propsContext";
import mergePropsContext from "@/lib/propsContext/mergePropsContext";

interface Props extends PropsWithChildren {
  props: PropsContextShape;
  dependencies?: DependencyList;
  mergeInParentContext?: boolean;
}

export const PropsContextProvider: FC<Props> = (props) => {
  const {
    props: providedProps,
    dependencies = [],
    mergeInParentContext = false,
    children,
  } = props;

  const parentPropsContext = useContextProps();

  const memoizedProps = useMemo(() => providedProps, dependencies);

  const propsWithParentPropsContext = useMemo(
    () =>
      mergeInParentContext
        ? mergePropsContext(parentPropsContext, providedProps)
        : providedProps,
    [memoizedProps, parentPropsContext, mergeInParentContext],
  );

  return (
    <propsContext.Provider value={propsWithParentPropsContext}>
      {children}
    </propsContext.Provider>
  );
};

export default PropsContextProvider;
