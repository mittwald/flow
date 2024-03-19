import React, {
  cloneElement,
  DependencyList,
  FC,
  isValidElement,
  PropsWithChildren,
  useContext,
  useMemo,
} from "react";
import { PropsContext as PropsContextShape } from "@/lib/propsContext";
import { propsContext } from "./propsContext";
import mergePropsContext from "./mergePropsContext";

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

  const parentContextProps = useContext(propsContext);

  const propsIncludingParentContext = useMemo(
    () => mergePropsContext(parentContextProps, providedProps),
    [parentContextProps, ...dependencies],
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
