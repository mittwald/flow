import { ClearPropsContext } from "@/components/ClearPropsContext";
import Wrap from "@/components/Wrap";
import mergePropsContext from "@/lib/propsContext/mergePropsContext";
import { propsContext, useContextProps } from "@/lib/propsContext/propsContext";
import type { PropsContext as PropsContextShape } from "@/lib/propsContext/types";
import type { DependencyList, FC, PropsWithChildren } from "react";
import { useMemo } from "react";

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
    <Wrap if={!mergeInParentContext}>
      <ClearPropsContext>
        <propsContext.Provider value={propsWithParentPropsContext}>
          {children}
        </propsContext.Provider>
      </ClearPropsContext>
    </Wrap>
  );
};

export default PropsContextProvider;
