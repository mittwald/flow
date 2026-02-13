import { action, makeObservable, observable } from "mobx";
import useSelector from "@/lib/mobx/useSelector";
import { useStatic } from "@/lib/hooks/useStatic";
import { useEffect } from "react";
import { useCloseOverlayConfirmationController } from "@/lib/controller/overlay/useCloseOverlayConfirmationController";

export type OverlayOpenHandler = () => unknown;
export type OverlayCloseHandler = () => unknown;
export type OverlayOpenStateHandler = (isOpen: boolean) => unknown;
type AnyOverlayOpenStateHandler =
  | OverlayOpenHandler
  | OverlayCloseHandler
  | OverlayOpenStateHandler;

type DisposerFn = () => void;

export interface CloseOverlayOptions {
  bypassConfirmation?: boolean;
}

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
  public showConfirmationModal = false;
  public confirmOnCloseEnabled: boolean;
  private onOpenHandlers = new Set<OverlayOpenHandler>();
  private onCloseHandlers = new Set<OverlayCloseHandler>();
  private onOpenChangeHandlers = new Set<OverlayOpenStateHandler>();

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
    this.isOpen = options?.isDefaultOpen ?? false;
    this.confirmOnCloseEnabled = options?.confirmOnClose === true;
  }

  public useUpdateOptions(options: OverlayControllerOptions = {}): void {
    const { onOpen, onClose, onOpenChange, confirmOnClose } = options;

    this.useOnHandler(onOpen, (h) =>
      this.addOpenStateHandler(h, this.onOpenHandlers),
    );
    this.useOnHandler(onClose, (h) =>
      this.addOpenStateHandler(h, this.onCloseHandlers),
    );
    this.useOnHandler(onOpenChange, (h) =>
      this.addOpenStateHandler(h, this.onOpenChangeHandlers),
    );

    useEffect(() => {
      if (confirmOnClose) {
        this.confirmOnCloseEnabled = true;
      }
    }, [confirmOnClose, this]);
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

  public open(): void {
    this.setOpen(true);
  }

  public close(options?: CloseOverlayOptions): void {
    this.setOpen(false, options);
  }

  public toggle(): void {
    this.setOpen(!this.isOpen);
  }

  public setOpen(toOpen: boolean, options: CloseOverlayOptions = {}): void {
    if (this.isOpen === toOpen) {
      return;
    }

    const { bypassConfirmation = false } = options;

    if (
      this.confirmOnCloseEnabled &&
      toOpen === false &&
      bypassConfirmation === false
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
    this.showConfirmationModal = false;
    this.confirmOnCloseEnabled = false;
  }

  public cancelConfirmation(): void {
    this.showConfirmationModal = false;
  }
}
