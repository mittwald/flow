import type { DependencyList, FC, PropsWithChildren } from "react";
import React, { cloneElement, isValidElement, useMemo } from "react";
import type { PropsContext as PropsContextShape } from "@/lib/propsContext/types";
import { propsContext } from "@/lib/propsContext/propsContext";

interface Props extends PropsWithChildren {
  props: PropsContextShape;
  dependencies?: DependencyList;
}

export const PropsContextProvider: FC<Props> = (props) => {
  const {
    props: providedProps,
    dependencies = [],
    children,
    ...forwardChildrenProps
  } = props;

  const memoizedProps = useMemo(() => providedProps, dependencies);

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
    <propsContext.Provider value={memoizedProps}>
      {childrenWithForwardedProps}
    </propsContext.Provider>
  );
};

export default PropsContextProvider;
