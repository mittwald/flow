import { createContext, useLayoutEffect, useState } from "react";
import type List from "@/components/List/model/List";

/**
 * Hands the list model to its components without changing the context value.
 * The model is rebuilt on every render of `List`; as a context value it would
 * re-render every consumer, including the ones inside items that skip their own
 * render. `useList` subscribes instead, and `useListSelector` only re-renders
 * when the value it reads changes.
 */
export class ListContextStore {
  private list: List<never>;
  private readonly listeners = new Set<() => void>();

  public constructor(list: List<never>) {
    this.list = list;
  }

  public static useNew(list: List<never>): ListContextStore {
    const store = useState(() => new ListContextStore(list))[0];
    // Components rendering in the same pass read the new model right away …
    store.list = list;
    // … the others get it once the list has committed.
    useLayoutEffect(() => {
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

interface ListContext {
  store: ListContextStore;
}

export const listContext = createContext<ListContext>({} as ListContext);
