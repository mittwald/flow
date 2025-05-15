import Wrap from "@/components/Wrap";
import { ClearPropsContext } from "@/index/internal";
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
  const propsWithParentPropsContext = useMemo(
    () =>
      mergeInParentContext
        ? mergePropsContext(parentPropsContext, providedProps)
        : providedProps,
    [dependencies, mergeInParentContext],
  );

  /**
   * <ClearPropsContext> is used here, because it has remote support, and
   * clearing context (!mergeInParentContext) is also applied while rendering on
   * host side.
   */
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
