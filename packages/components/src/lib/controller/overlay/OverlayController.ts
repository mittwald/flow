import { action, makeObservable, observable } from "mobx";
import useSelector from "@/lib/mobx/useSelector";
import { useStatic } from "@/lib/hooks/useStatic";
import { useEffect } from "react";

export type OverlayOpenHandler = () => unknown;
export type OverlayCloseHandler = () => unknown;
export type OverlayOpenStateHandler = (isOpen: boolean) => unknown;
type AnyOverlayOpenStateHandler =
  | OverlayOpenHandler
  | OverlayCloseHandler
  | OverlayOpenStateHandler;

type DisposerFn = () => void;

export interface OverlayControllerOptions {
  isDefaultOpen?: boolean;
  onOpen?: OverlayOpenHandler;
  onClose?: OverlayCloseHandler;
  onOpenChange?: OverlayOpenStateHandler;
}

export class OverlayController {
  public isOpen = false;
  private onOpenHandlers = new Set<OverlayOpenHandler>();
  private onCloseHandlers = new Set<OverlayCloseHandler>();
  private onOpenChangeHandlers = new Set<OverlayOpenStateHandler>();

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
    if (options?.onOpenChange) {
      this.onOpenChangeHandlers.add(options.onOpenChange);
    }
  }

  public static useNew(
    options: OverlayControllerOptions = {},
  ): OverlayController {
    return useStatic(() => new OverlayController(options));
  }

  private addOpenStateHandler<T extends AnyOverlayOpenStateHandler>(
    handler: T,
    handlersSet: Set<T>,
  ): DisposerFn {
    handlersSet.add(handler);
    return () => {
      handlersSet.delete(handler);
    };
  }

  public addOnOpen(handler: OverlayOpenHandler): DisposerFn {
    return this.addOpenStateHandler(handler, this.onOpenHandlers);
  }

  public addOnClose(handler: OverlayCloseHandler): DisposerFn {
    return this.addOpenStateHandler(handler, this.onCloseHandlers);
  }

  public addOnOpenChange(handler: OverlayOpenStateHandler): DisposerFn {
    return this.addOpenStateHandler(handler, this.onOpenChangeHandlers);
  }

  private useOnHandler<T extends AnyOverlayOpenStateHandler>(
    handler: T | undefined,
    addHandlerFn: (handler: T) => DisposerFn,
  ) {
    useEffect(
      () => (handler ? addHandlerFn(handler) : undefined),
      [handler, this],
    );
  }

  public useOnOpen(handler?: OverlayOpenHandler): void {
    this.useOnHandler(handler, (h) => this.addOnOpen(h));
  }

  public useOnClose(handler?: OverlayCloseHandler): void {
    this.useOnHandler(handler, (h) => this.addOnClose(h));
  }

  public useOnOpenChange(handler?: OverlayOpenStateHandler): void {
    this.useOnHandler(handler, (h) => this.addOnOpenChange(h));
  }

  private executeHandlers(
    isOpen: boolean,
    handlers: Set<
      OverlayOpenHandler | OverlayCloseHandler | OverlayOpenStateHandler
    >,
  ): boolean {
    const handlerResult = Array.from(handlers).map((handler) =>
      handler(isOpen),
    );
    return handlerResult.some((result) => result === false);
  }

  private executeOnClose(): boolean {
    return this.executeHandlers(false, this.onCloseHandlers);
  }

  private executeOnOpen(): boolean {
    return this.executeHandlers(true, this.onOpenHandlers);
  }

  private executeOnOpenChange(isOpen: boolean): boolean {
    return this.executeHandlers(isOpen, this.onOpenChangeHandlers);
  }

  public open(): void {
    this.setOpen(true);
  }

  public close(): void {
    this.setOpen(false);
  }

  public toggle(): void {
    this.setOpen(!this.isOpen);
  }

  public setOpen(to: boolean): void {
    if (this.isOpen === to) {
      return;
    }

    let aborted = false;
    if (to) {
      aborted = this.executeOnOpen();
    } else {
      aborted = this.executeOnClose();
    }
    if (!aborted) {
      aborted = this.executeOnOpenChange(to);
    }

    if (!aborted) {
      this.isOpen = to;
    }
  }

  public useIsOpen() {
    return useSelector(() => this.isOpen);
  }
}
