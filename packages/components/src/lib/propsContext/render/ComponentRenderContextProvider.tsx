import type { FlowComponentName } from "@/components/propTypes";
import type { FlowRenderFn } from "@/lib/types/props";
import type { FC, PropsWithChildren } from "react";
import React, { createContext, useContext } from "react";
import type { PropsContext } from "@/lib/propsContext";
import { mapValues } from "remeda";

export interface ComponentRenderContext {
  render: Partial<{
    [C in FlowComponentName]: FlowRenderFn<never>;
  }>;
  parentContext?: ComponentRenderContext;
}

const componentRenderContext = createContext<
  ComponentRenderContext | undefined
>(undefined);

export const useComponentRenderContext = ():
  | ComponentRenderContext
  | undefined => useContext(componentRenderContext);

interface ComponentRenderContextProviderProps extends PropsWithChildren {
  propsContext: PropsContext;
}

export const ComponentRenderContextProvider = componentRenderContext.Provider;

export const PropsContextRenderProvider: FC<
  ComponentRenderContextProviderProps
> = (props) => {
  const { children, propsContext } = props;
  const parentContext = useComponentRenderContext();

  const renderFunctions = mapValues(propsContext, (componentProps) =>
    componentProps &&
    "render" in componentProps &&
    componentProps.render !== false
      ? (componentProps.render as FlowRenderFn<never>)
      : undefined,
  );

  return (
    <ComponentRenderContextProvider
      value={{
        render: renderFunctions,
        parentContext,
      }}
    >
      {children}
    </ComponentRenderContextProvider>
  );
};
