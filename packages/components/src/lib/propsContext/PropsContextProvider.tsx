import type { DependencyList, FC, PropsWithChildren } from "react";
import React, { cloneElement, isValidElement, useMemo } from "react";
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
    ...forwardChildrenProps
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

  const childrenProps = isValidElement(children)
    ? {
        ...forwardChildrenProps,
        ...children.props,
      }
    : forwardChildrenProps;

  const childrenMemoDeps = [
    children,
    ...Object.entries(childrenProps).flatMap((e) => e),
  ];

  const childrenWithForwardedProps = useMemo(
    () =>
      isValidElement(children)
        ? cloneElement(children, childrenProps)
        : children,
    childrenMemoDeps,
  );

  return (
    <propsContext.Provider value={propsWithParentPropsContext}>
      {childrenWithForwardedProps}
    </propsContext.Provider>
  );
};

export default PropsContextProvider;
