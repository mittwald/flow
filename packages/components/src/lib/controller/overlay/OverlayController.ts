import { action, makeObservable, observable } from "mobx";
import useSelector from "@/lib/mobx/useSelector";
import { useState } from "react";

export class OverlayController {
  public isOpen: boolean;

  public constructor(isDefaultOpen = false) {
    makeObservable(this, {
      isOpen: observable,
      open: action.bound,
      close: action.bound,
      toggle: action.bound,
      setOpen: action.bound,
    });
    this.isOpen = isDefaultOpen;
  }

  public static useNew(isDefaultOpen?: boolean) {
    return useState(new OverlayController(isDefaultOpen))[0];
  }

  public open(): void {
    this.isOpen = true;
  }

  public close(): void {
    this.isOpen = false;
  }

  public toggle(): void {
    this.isOpen = !this.isOpen;
  }

  public setOpen(to: boolean): void {
    this.isOpen = to;
  }

  public useIsOpen(): boolean {
    return useSelector(() => this.isOpen);
  }
}
