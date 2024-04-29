import { action, makeObservable, observable } from "mobx";
import useSelector from "@/lib/mobx/useSelector";
import { useRef } from "react";

export type ActionStateValue =
  | "isIdle"
  | "isSucceeded"
  | "isPending"
  | "isExecuting"
  | "isFailed";

export class ActionState {
  public state: ActionStateValue = "isIdle";

  private constructor() {
    makeObservable(this, {
      state: observable,
      updateState: action,
    });
  }

  public static useNew(): ActionState {
    return useRef(new ActionState()).current;
  }

  public updateState(newState: ActionStateValue): void {
    this.state = newState;
  }

  public useState(): ActionStateValue {
    return useSelector(() => this.state, [this]);
  }
}
