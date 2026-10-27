import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

export type OverlayOpenHandler = () => unknown;
export type OverlayCloseHandler = () => unknown;
export type OverlayOpenStateHandler = (isOpen: boolean) => unknown;
export type AnyOverlayOpenStateHandler =
  OverlayOpenHandler | OverlayCloseHandler | OverlayOpenStateHandler;

export type DisposerFn = () => void;

export interface OverlayCloseOptions {
  /** Close without asking, even when the overlay requires confirmation. */
  bypassConfirmation?: boolean;
}

export interface OverlayStateOptions {
  isDefaultOpen?: boolean;
  /**
   * Whether closing the overlay must be confirmed while no source has an
   * opinion (`setConfirmOnCloseSource`).
   */
  confirmOnClose?: boolean;
}

/**
 * Whether an overlay is open, and whether closing it has to be confirmed first.
 * Each binding adds its subscription and its lifecycle: React's
 * `OverlayController` subclasses it, Vue's adapter wraps it in refs.
 *
 * `TCloseOptions` lets a binding pass more on a close than the state reads —
 * React's `overlay`, resolved by `Action` before the close arrives here.
 */
export class OverlayState<
  TCloseOptions extends OverlayCloseOptions = OverlayCloseOptions,
> {
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
  /**
   * The open state a `setOpen` call is currently applying. Handlers run before
   * `isOpen` is assigned, so a handler that calls `setOpen` again would not be
   * caught by the equality check at the top and would recurse.
   */
  private openStateInFlight: boolean | undefined;

  public constructor(options: OverlayStateOptions = {}) {
    makeObservable(this, {
      isOpen: observable,
      isContentSuspended: observable,
      showConfirmationModal: observable,
      confirmOnCloseEnabled: computed,
      open: action.bound,
      close: action.bound,
      toggle: action.bound,
      setOpen: action.bound,
      syncOpen: action.bound,
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

  /**
   * Sets the opinion of one source – any object the caller keeps – on close
   * confirmation. Remove the source again when its owner goes away.
   *
   * @internal Bindings call it from their lifecycle.
   */
  public setConfirmOnCloseSource(source: object, confirmOnClose: boolean) {
    runInAction(() => {
      this.confirmOnCloseSources.set(source, confirmOnClose);
      this.withdrawUnneededConfirmation();
    });
  }

  /** @internal Bindings call it from their lifecycle. */
  public removeConfirmOnCloseSource(source: object) {
    runInAction(() => {
      this.confirmOnCloseSources.delete(source);
      this.withdrawUnneededConfirmation();
    });
  }

  private withdrawUnneededConfirmation() {
    if (!this.confirmOnCloseEnabled) {
      this.showConfirmationModal = false;
    }
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

  public close(options?: TCloseOptions): void {
    this.setOpen(false, options);
  }

  public toggle(): void {
    this.setOpen(!this.isOpen);
  }

  public setOpen(toOpen: boolean, options?: TCloseOptions): void {
    if (this.isOpen === toOpen || this.openStateInFlight === toOpen) {
      return;
    }

    this.openStateInFlight = toOpen;
    try {
      this.applyOpenState(toOpen, options);
    } finally {
      this.openStateInFlight = undefined;
    }
  }

  /**
   * Sets the open state without running any handler. Use it to mirror a
   * controlled `isOpen` prop, whose change comes from the consumer – notifying
   * them of their own state would echo it back. Closing this way drops a
   * pending close confirmation as well.
   */
  public syncOpen(toOpen: boolean): void {
    this.assignOpenState(toOpen);
  }

  /** A closed overlay has no close left to confirm. */
  private assignOpenState(toOpen: boolean): void {
    this.isOpen = toOpen;
    if (!toOpen) {
      this.showConfirmationModal = false;
      this.closeIsConfirmed = false;
    }
  }

  private applyOpenState(toOpen: boolean, options?: TCloseOptions): void {
    const { bypassConfirmation = false } = options ?? {};

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
      this.assignOpenState(toOpen);
    }
  }

  public setIsContentSuspended(to: boolean): void {
    this.isContentSuspended = to;
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
