import type { FC, PropsWithChildren } from "react";
import React, { createContext, useContext, useEffect, useRef } from "react";
import type { ActionState } from "@/components/Action/models/ActionState";
import { action, computed, makeObservable, observable } from "mobx";
import useSelector from "@/lib/mobx/useSelector";

export class ActionStateContext {
  public states = new Set<ActionState>();

  public constructor() {
    makeObservable(this, {
      states: observable,
      addState: action,
      removeState: action,
      isBusy: computed,
    });
  }

  public static useNew(): ActionStateContext {
    return useRef(new ActionStateContext()).current;
  }

  public static useRegisterState(state: ActionState): void {
    const context = useActionStateContext();

    useEffect(() => {
      context?.addState(state);
      return () => {
        context?.removeState(state);
      };
    }, [context, state]);
  }

  public addState(state: ActionState): void {
    this.states.add(state);
  }

  public removeState(state: ActionState): void {
    this.states.delete(state);
  }

  public useIsBusy(): boolean {
    return useSelector(() => this.isBusy, [this.states.size]);
  }

  public get isBusy(): boolean {
    for (const s of this.states) {
      if (s.isBusy) {
        return true;
      }
    }
    return false;
  }
}

const context = createContext<ActionStateContext | undefined>(undefined);

export const ActionStateContextProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const ctx = ActionStateContext.useNew();
  return <context.Provider value={ctx}>{children}</context.Provider>;
};

export const useActionStateContext = (): ActionStateContext => {
  const newContext = ActionStateContext.useNew();
  return useContext(context) ?? newContext;
};
