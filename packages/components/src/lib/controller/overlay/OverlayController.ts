import { action, makeObservable, observable } from "mobx";
import useSelector from "@/lib/mobx/useSelector";
import { useRef } from "react";

export interface OverlayControllerOptions {
  isDefaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export class OverlayController {
  public isOpen: boolean;
  public onOpen?: () => void;
  public onClose?: () => void;

  public constructor(options?: OverlayControllerOptions) {
    makeObservable(this, {
      isOpen: observable,
      open: action.bound,
      close: action.bound,
      toggle: action.bound,
      setOpen: action.bound,
    });
    this.isOpen = options?.isDefaultOpen ?? false;
    this.onOpen = options?.onOpen;
    this.onClose = options?.onClose;
  }

  public static useNew(options?: OverlayControllerOptions): OverlayController {
    return useRef(new OverlayController(options)).current;
  }

  public open(): void {
    this.isOpen = true;
    this.onOpen?.();
  }

  public close(): void {
    this.isOpen = false;
    this.onClose?.();
  }

  public toggle(): void {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.onOpen?.();
    } else {
      this.onClose?.();
    }
  }

  public setOpen(to: boolean): void {
    this.isOpen = to;

    if (to) {
      this.onOpen?.();
    } else {
      this.onClose?.();
    }
  }

  public useIsOpen(): boolean {
    return useSelector(() => this.isOpen);
  }
}
