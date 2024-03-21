import React, {
  cloneElement,
  DependencyList,
  FC,
  isValidElement,
  PropsWithChildren,
  useMemo,
} from "react";
import { PropsContext as PropsContextShape } from "@/lib/propsContext/types";
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

  const propsIncludingParentContext = useMemo(
    () => providedProps,
    dependencies,
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
    <propsContext.Provider value={propsIncludingParentContext}>
      {childrenWithForwardedProps}
    </propsContext.Provider>
  );
};

export default PropsContextProvider;
