import { action, makeObservable, observable } from "mobx";
import useSelector from "@/lib/mobx/useSelector";
import { useStatic } from "@/lib/hooks/useStatic";
import { useEffect } from "react";
import { useCloseOverlayConfirmationController } from "@/lib/controller/overlay/useCloseOverlayConfirmationController";
import type { FlowComponentName } from "@/components/propTypes";

export type OverlayOpenHandler = () => unknown;
export type OverlayCloseHandler = () => unknown;
export type OverlayOpenStateHandler = (isOpen: boolean) => unknown;
type AnyOverlayOpenStateHandler =
  | OverlayOpenHandler
  | OverlayCloseHandler
  | OverlayOpenStateHandler;

type DisposerFn = () => void;

export interface CloseOverlayOptions {
  overlay: FlowComponentName | OverlayController;
  bypassConfirmation?: boolean;
}

export type CloseModalOptions = Omit<CloseOverlayOptions, "overlay">;

type CloseOptions = CloseOverlayOptions | CloseModalOptions;

export interface OverlayControllerOptions {
  isDefaultOpen?: boolean;
  onOpen?: OverlayOpenHandler;
  onClose?: OverlayCloseHandler;
  onOpenChange?: OverlayOpenStateHandler;
  confirmOnClose?: boolean;
}

type ConstructorOptions = Pick<
  OverlayControllerOptions,
  "isDefaultOpen" | "confirmOnClose"
>;

export class OverlayController {
  public isOpen = false;
  private onOpenHandlers = new Set<OverlayOpenHandler>();
  private onCloseHandlers = new Set<OverlayCloseHandler>();
  private onOpenChangeHandlers = new Set<OverlayOpenStateHandler>();

  public showConfirmationModal = false;
  public closeIsConfirmed = false;
  public confirmOnCloseEnabled: boolean;

  public constructor(options: ConstructorOptions = {}) {
    makeObservable(this, {
      isOpen: observable,
      showConfirmationModal: observable,
      open: action.bound,
      close: action.bound,
      toggle: action.bound,
      setOpen: action.bound,
      confirmClose: action.bound,
    });
    const { isDefaultOpen = false, confirmOnClose = false } = options;
    this.isOpen = isDefaultOpen;
    this.confirmOnCloseEnabled = confirmOnClose;
  }

  public useUpdateOptions(options: OverlayControllerOptions = {}): void {
    const {
      onOpen,
      onClose,
      onOpenChange,
      confirmOnClose = this.confirmOnCloseEnabled,
    } = options;

    this.useOnHandler(onOpen, (h) =>
      this.addOpenStateHandler(h, this.onOpenHandlers),
    );
    this.useOnHandler(onClose, (h) =>
      this.addOpenStateHandler(h, this.onCloseHandlers),
    );
    this.useOnHandler(onOpenChange, (h) =>
      this.addOpenStateHandler(h, this.onOpenChangeHandlers),
    );

    this.confirmOnCloseEnabled = confirmOnClose;
  }

  public static useNew(
    options: OverlayControllerOptions = {},
  ): OverlayController {
    const controller = useStatic(() => new OverlayController(options));
    controller.useUpdateOptions(options);
    return controller;
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

  private useOnHandler<T extends AnyOverlayOpenStateHandler>(
    handler: T | undefined,
    addHandlerFn: (handler: T) => DisposerFn,
  ) {
    useEffect(
      () => (handler ? addHandlerFn(handler) : undefined),
      [handler, this],
    );
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

  public addOnClose(handler: OverlayCloseHandler) {
    return this.addOpenStateHandler(handler, this.onCloseHandlers);
  }

  public addOnOpen(handler: OverlayOpenHandler) {
    return this.addOpenStateHandler(handler, this.onOpenHandlers);
  }

  public addOnOpenChange(handler: OverlayOpenStateHandler) {
    return this.addOpenStateHandler(handler, this.onOpenChangeHandlers);
  }

  public open(): void {
    this.setOpen(true);
  }

  public close(options?: CloseOptions): void {
    this.setOpen(false, options);
  }

  public toggle(): void {
    this.setOpen(!this.isOpen);
  }

  public setOpen(toOpen: boolean, options: CloseOptions = {}): void {
    if (this.isOpen === toOpen) {
      return;
    }

    const { bypassConfirmation = false } = options;

    if (
      toOpen === false &&
      this.confirmOnCloseEnabled &&
      !this.closeIsConfirmed &&
      !bypassConfirmation
    ) {
      this.showConfirmationModal = true;
      return;
    }

    let aborted = false;
    if (toOpen) {
      aborted = this.executeOnOpen();
    } else {
      aborted = this.executeOnClose();
    }
    if (!aborted) {
      aborted = this.executeOnOpenChange(toOpen);
    }

    if (!aborted) {
      this.isOpen = toOpen;
      this.closeIsConfirmed = false;
    }
  }

  public useIsOpen() {
    return useSelector(() => this.isOpen);
  }

  public useShowConfirmationModal() {
    return useSelector(() => this.showConfirmationModal);
  }

  public useConfirmationController() {
    return useCloseOverlayConfirmationController(this);
  }

  public confirmClose(): void {
    this.closeIsConfirmed = true;
    this.showConfirmationModal = false;
  }

  public cancelConfirmation(): void {
    this.showConfirmationModal = false;
  }
}
