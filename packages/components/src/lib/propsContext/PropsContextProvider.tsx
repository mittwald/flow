import React, {
  DependencyList,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
} from "react";
import { PropsContext } from "@/lib/propsContext";
import { propsContext } from "./propsContext";
import mergePropsContext from "./mergePropsContext";

interface Props extends PropsWithChildren {
  props: PropsContext;
  dependencies?: DependencyList;
}

export const PropsContextProvider: FC<Props> = (props) => {
  const { props: providedProps, dependencies = [], children } = props;

  const parentContextProps = useContext(propsContext);
  const memoizedProvidedProps = useMemo(() => providedProps, dependencies);

  const propsIncludingParentContext = useMemo(
    () => mergePropsContext(parentContextProps, memoizedProvidedProps),
    [parentContextProps, memoizedProvidedProps],
  );

  return (
    <propsContext.Provider value={propsIncludingParentContext}>
      {children}
    </propsContext.Provider>
  );
};

export default PropsContextProvider;
