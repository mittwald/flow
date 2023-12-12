import React, {
  DependencyList,
  FC,
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
  const { props: providedProps, dependencies = [], children } = props;

  const parentContextProps = useContext(propsContext);

  const propsIncludingParentContext = useMemo(
    () => mergePropsContext(parentContextProps, providedProps),
    [parentContextProps, ...dependencies],
  );

  return (
    <propsContext.Provider value={propsIncludingParentContext}>
      {children}
    </propsContext.Provider>
  );
};

export default PropsContextProvider;
