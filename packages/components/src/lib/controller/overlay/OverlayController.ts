import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import useSelector from "@/lib/mobx/useSelector";
import { useStatic } from "@/lib/hooks/useStatic";
import { useEffect, useRef, type DependencyList } from "react";
import { useCloseOverlayConfirmationController } from "@/lib/controller/overlay/useCloseOverlayConfirmationController";
import type { FlowComponentName } from "@/components/propTypes";

export type OverlayOpenHandler = () => unknown;
export type OverlayCloseHandler = () => unknown;
export type OverlayOpenStateHandler = (isOpen: boolean) => unknown;
type AnyOverlayOpenStateHandler =
  OverlayOpenHandler | OverlayCloseHandler | OverlayOpenStateHandler;

type DisposerFn = () => void;

export interface CloseOverlayOptions {
  overlay: FlowComponentName | OverlayController;
  bypassConfirmation?: boolean;
}

export interface OnOverlayClosedOptions {
  dependencies?: DependencyList;
}

export type CloseModalOptions = Omit<CloseOverlayOptions, "overlay">;

type CloseOptions = CloseOverlayOptions | CloseModalOptions;

export interface OverlayControllerOptions {
  isDefaultOpen?: boolean;
  onOpen?: OverlayOpenHandler;
  onClose?: OverlayCloseHandler;
  onOpenChange?: OverlayOpenStateHandler;
  /**
   * Whether closing the overlay must be confirmed. `undefined` means "no
   * opinion": the value is not contributed at all, so other sources (e.g. a
   * `Modal`'s `confirmOnClose` prop or a dirty `Form`) still decide.
   */
  confirmOnClose?: boolean;
}

type ConstructorOptions = Pick<
  OverlayControllerOptions,
  "isDefaultOpen" | "confirmOnClose"
>;

export class OverlayController {
  public isOpen = false;
  public isContentSuspended = false;
  private onOpenHandlers = new Set<OverlayOpenHandler>();
  private onCloseHandlers = new Set<OverlayCloseHandler>();
  private onOpenChangeHandlers = new Set<OverlayOpenStateHandler>();

  public showConfirmationModal = false;
  public closeIsConfirmed = false;
  private readonly confirmOnCloseFromOptions: boolean;
  /**
   * Every mounted component that has an opinion on close confirmation
   * contributes one entry here – e.g. a `Modal` with a `confirmOnClose` prop
   * and a `Form` tracking its dirty state. Combining them instead of assigning
   * a single flag keeps them from overwriting each other.
   */
  private confirmOnCloseSources = observable.map<object, boolean>();
  /**
   * Active grants that allow closing without a confirmation. Each entry is
   * scoped to an ongoing operation that legitimately closes the overlay – e.g.
   * a `Form` submit – and is dropped again when that operation has finished, so
   * an operation that does _not_ close the overlay leaves the confirmation
   * armed.
   */
  private closeWithoutConfirmationGrants = new Set<object>();

  public constructor(options: ConstructorOptions = {}) {
    makeObservable(this, {
      isOpen: observable,
      isContentSuspended: observable,
      showConfirmationModal: observable,
      confirmOnCloseEnabled: computed,
      open: action.bound,
      close: action.bound,
      toggle: action.bound,
      setOpen: action.bound,
      setIsContentSuspended: action.bound,
      confirmClose: action.bound,
      cancelConfirmation: action.bound,
    });
    const { isDefaultOpen = false, confirmOnClose = false } = options;
    this.isOpen = isDefaultOpen;
    this.confirmOnCloseFromOptions = confirmOnClose;
  }

  /** Whether closing this overlay currently requires a confirmation. */
  public get confirmOnCloseEnabled(): boolean {
    if (this.confirmOnCloseSources.size === 0) {
      return this.confirmOnCloseFromOptions;
    }
    return Array.from(this.confirmOnCloseSources.values()).some(Boolean);
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

    this.useConfirmOnCloseSource(confirmOnClose);
  }

  /**
   * Registers the calling component as a close confirmation source for as long
   * as it is mounted. `undefined` contributes nothing at all.
   */
  private useConfirmOnCloseSource(confirmOnClose: boolean | undefined): void {
    const source = useStatic((): object => ({}));

    useEffect(() => {
      if (confirmOnClose === undefined) {
        this.removeConfirmOnCloseSource(source);
        return;
      }
      this.setConfirmOnCloseSource(source, confirmOnClose);
      return () => this.removeConfirmOnCloseSource(source);
    }, [this, source, confirmOnClose]);
  }

  private setConfirmOnCloseSource(source: object, confirmOnClose: boolean) {
    runInAction(() => this.confirmOnCloseSources.set(source, confirmOnClose));
  }

  private removeConfirmOnCloseSource(source: object) {
    runInAction(() => this.confirmOnCloseSources.delete(source));
  }

  /**
   * Can be used to execute a callback when the Overlay has unmounted – means
   * after any closing animation.
   *
   * NOTICE: This hook only works inside the corresponding Overlay!
   */
  public useOnClosed(
    callback: () => unknown,
    options: OnOverlayClosedOptions = {},
  ) {
    const { dependencies = [] } = options;
    const isOpen = this.useIsOpen();
    const wasOpen = useRef(this.isOpen);

    this.useUpdateOptions({
      onOpen: () => {
        wasOpen.current = true;
      },
    });

    useEffect(() => {
      return () => {
        if (!isOpen && wasOpen.current) {
          wasOpen.current = false;
          callback();
        }
      };
    }, [isOpen, ...dependencies]);
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

    if (toOpen === false) {
      // The confirmation is a one-shot permission for exactly this close
      // attempt – consume it here instead of only when a close succeeds, so it
      // cannot survive an aborted close and disarm later attempts.
      const closeIsConfirmed = this.closeIsConfirmed;
      this.closeIsConfirmed = false;

      if (
        this.confirmOnCloseEnabled &&
        !closeIsConfirmed &&
        this.closeWithoutConfirmationGrants.size === 0 &&
        !bypassConfirmation
      ) {
        this.showConfirmationModal = true;
        return;
      }
    }

    let aborted: boolean;
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

  public setIsContentSuspended(to: boolean): void {
    this.isContentSuspended = to;
  }

  public useIsOpen() {
    return useSelector(() => this.isOpen);
  }

  public useIsContentSuspended() {
    return useSelector(() => this.isContentSuspended);
  }

  public useShowConfirmationModal() {
    return useSelector(() => this.showConfirmationModal);
  }

  public useConfirmOnCloseEnabled() {
    return useSelector(() => this.confirmOnCloseEnabled);
  }

  public useConfirmationController() {
    return useCloseOverlayConfirmationController(this);
  }

  /**
   * Allows closing this overlay without a confirmation until the returned
   * disposer is called. Use it around an operation that may legitimately close
   * the overlay – e.g. a `Form` submit, where a "discard unsaved changes?"
   * prompt would be nonsense – and dispose it as soon as that operation has
   * finished. An operation that ends without closing the overlay therefore
   * leaves the confirmation armed (#2775).
   */
  public grantCloseWithoutConfirmation(): DisposerFn {
    const grant = {};
    this.closeWithoutConfirmationGrants.add(grant);
    return () => {
      this.closeWithoutConfirmationGrants.delete(grant);
    };
  }

  public confirmClose(): void {
    this.closeIsConfirmed = true;
    this.showConfirmationModal = false;
  }

  public cancelConfirmation(): void {
    this.showConfirmationModal = false;
  }
}
