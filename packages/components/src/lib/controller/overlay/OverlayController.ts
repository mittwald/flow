import { action, makeObservable, observable } from "mobx";
import useSelector from "@/lib/mobx/useSelector";
import { useStatic } from "@/lib/hooks/useStatic";

type OpenStateHandler = () => void;
type DisposerFn = () => void;

export interface OverlayControllerOptions {
  isDefaultOpen?: boolean;
  onOpen?: OpenStateHandler;
  onClose?: OpenStateHandler;
}

export class OverlayController {
  public isOpen = false;
  private onOpenHandlers = new Set<OpenStateHandler>();
  private onCloseHandlers = new Set<OpenStateHandler>();
  public confirmUnsavedChanges = false;

  public constructor(options?: OverlayControllerOptions) {
    makeObservable(this, {
      isOpen: observable,
      open: action.bound,
      close: action.bound,
      toggle: action.bound,
      setOpen: action.bound,
      confirmUnsavedChanges: observable,
      setConfirmUnsavedChanges: action.bound,
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
    return useStatic(() => new OverlayController(options));
  }

  public addOnOpen(handler: OpenStateHandler): DisposerFn {
    this.onOpenHandlers.add(handler);
    return () => {
      this.onOpenHandlers.delete(handler);
    };
  }

  public addOnClose(handler: OpenStateHandler): DisposerFn {
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
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;
    this.executeOnOpen();
  }

  public close(): void {
    if (!this.isOpen) {
      return;
    }
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

  public setConfirmUnsavedChanges(to: boolean): void {
    this.confirmUnsavedChanges = to;
  }
}
