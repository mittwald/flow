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
  private onOpenHandlers = new Set<() => void>();
  private onCloseHandlers = new Set<() => void>();

  public constructor(options?: OverlayControllerOptions) {
    makeObservable(this, {
      isOpen: observable,
      open: action.bound,
      close: action.bound,
      toggle: action.bound,
      setOpen: action.bound,
    });
    this.isOpen = options?.isDefaultOpen ?? false;

    if (options?.onOpen) {
      this.onOpenHandlers.add(options.onOpen);
    }
    if (options?.onClose) {
      this.onCloseHandlers.add(options.onClose);
    }
  }

  public static useNew(options?: OverlayControllerOptions): OverlayController {
    return useRef(new OverlayController(options)).current;
  }

  public addOnOpen(handler: () => void): () => void {
    this.onOpenHandlers.add(handler);
    return () => {
      this.onOpenHandlers.delete(handler);
    };
  }

  public addOnClose(handler: () => void): () => void {
    this.onCloseHandlers.add(handler);
    return () => {
      this.onCloseHandlers.delete(handler);
    };
  }

  private executeOnClose(): void {
    this.onCloseHandlers.forEach((handler) => handler());
  }

  private executeOnOpen(): void {
    this.onOpenHandlers.forEach((handler) => handler());
  }

  public open(): void {
    this.isOpen = true;
    this.executeOnOpen();
  }

  public close(): void {
    this.isOpen = false;
    this.executeOnClose();
  }

  public toggle(): void {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.executeOnOpen();
    } else {
      this.executeOnClose();
    }
  }

  public setOpen(to: boolean): void {
    this.isOpen = to;

    if (to) {
      this.executeOnOpen();
    } else {
      this.executeOnClose();
    }
  }

  public useIsOpen(): boolean {
    return useSelector(() => this.isOpen);
  }
}
