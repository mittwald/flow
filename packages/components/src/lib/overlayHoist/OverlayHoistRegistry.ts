import { action, makeObservable, observable } from "mobx";
import type { ReactNode } from "react";

/**
 * Holds the overlays that have been hoisted out of a subtree which unmounts
 * while the overlay is still open – see `OverlayHoistProvider`.
 */
export class OverlayHoistRegistry {
  public readonly overlays = observable.map<string, ReactNode>(
    {},
    { deep: false },
  );

  public constructor() {
    makeObservable(this, {
      set: action.bound,
      remove: action.bound,
    });
  }

  public set(key: string, overlay: ReactNode): void {
    this.overlays.set(key, overlay);
  }

  public remove(key: string): void {
    this.overlays.delete(key);
  }
}

export default OverlayHoistRegistry;
