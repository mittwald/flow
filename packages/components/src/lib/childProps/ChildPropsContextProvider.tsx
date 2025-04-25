import type { FC } from "react";
import React from "react";
import { useContext, useMemo } from "react";
import type { PropsWithChildren } from "react";
import { ChildPropsStore } from "@/lib/childProps/ChildPropsStore";
import { childPropsContext } from "@/lib/childProps/context";

interface ChildPropsContextProviderProps extends PropsWithChildren {
  store?: ChildPropsStore;
  scope?: string;
}

export const ChildPropsContextProvider: FC<ChildPropsContextProviderProps> = (
  props,
) => {
  const { children, store: storeFromProps, scope } = props;

  const newStore = ChildPropsStore.useNew(scope ?? "undefined");
  const store = storeFromProps ?? newStore;

  const parentContext = useContext(childPropsContext);
  const mergedContext = useMemo(
    () => ({
      ...parentContext,
      [store.scope]: store,
    }),
    [store.scope, store, parentContext],
  );

  return (
    <childPropsContext.Provider value={mergedContext}>
      {children}
    </childPropsContext.Provider>
  );
};
