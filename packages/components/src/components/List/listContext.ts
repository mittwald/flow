import { createContext, useLayoutEffect, useState } from "react";
import type List from "@/components/List/model/List";

interface ListContext {
  list: List<never>;
}

export const listContext = createContext<ListContext>({} as ListContext);

/**
 * Hands the committed list model to `useListSelector` without changing the
 * context value. The model is rebuilt on every render of `List`; read from
 * `listContext`, it re-renders every consumer, including the ones inside items
 * that skip their own render. A selector re-renders only when the value it
 * reads changes.
 */
export class ListContextStore {
  private list: List<never>;
  private readonly listeners = new Set<() => void>();

  public constructor(list: List<never>) {
    this.list = list;
  }

  public static useNew(list: List<never>): ListContextStore {
    const store = useState(() => new ListContextStore(list))[0];
    useLayoutEffect(() => {
      store.list = list;
      store.listeners.forEach((listener) => listener());
    });
    return store;
  }

  public readonly getList = (): List<never> => this.list;

  public readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
}

export const listStoreContext = createContext(
  new ListContextStore(undefined as unknown as List<never>),
);
