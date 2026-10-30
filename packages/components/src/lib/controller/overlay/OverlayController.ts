import {
  OverlayState,
  type AnyOverlayOpenStateHandler,
  type DisposerFn,
  type OverlayCloseHandler,
  type OverlayCloseOptions,
  type OverlayOpenHandler,
  type OverlayOpenStateHandler,
} from "@mittwald/flow-components-base";
import useSelector from "@/lib/mobx/useSelector";
import { useStatic } from "@/lib/hooks/useStatic";
import { useEffect, useRef, type DependencyList } from "react";
import { useCloseOverlayConfirmationController } from "@/lib/controller/overlay/useCloseOverlayConfirmationController";
import type { FlowComponentName } from "@/components/propTypes";

export type {
  OverlayCloseHandler,
  OverlayOpenHandler,
  OverlayOpenStateHandler,
} from "@mittwald/flow-components-base";

export interface CloseOverlayOptions extends OverlayCloseOptions {
  /**
   * The overlay to close. Omitted, the nearest enclosing overlay is closed –
   * the same thing `closeOverlay={true}` means.
   */
  overlay?: FlowComponentName | OverlayController;
}

export interface OnOverlayClosedOptions {
  dependencies?: DependencyList;
}

export type CloseModalOptions = Omit<CloseOverlayOptions, "overlay">;

/**
 * Every way an action can point at an overlay: by the Flow component name it
 * registers under, by controller, by options, or with `true` – the nearest
 * enclosing overlay, whatever its name.
 */
export type OverlayReference =
  FlowComponentName | OverlayController | CloseOverlayOptions | true;

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

/**
 * The state is `OverlayState` from `@mittwald/flow-components-base`, shared
 * with every remote binding; this adds the hooks.
 */
export class OverlayController extends OverlayState<CloseOptions> {
  public useUpdateOptions(options: OverlayControllerOptions = {}): void {
    const { onOpen, onClose, onOpenChange, confirmOnClose } = options;

    this.useOnHandler(onOpen, (h) => this.addOnOpen(h));
    this.useOnHandler(onClose, (h) => this.addOnClose(h));
    this.useOnHandler(onOpenChange, (h) => this.addOnOpenChange(h));

    this.useConfirmOnCloseSource(confirmOnClose);
  }

  /**
   * Registers the calling component as a close confirmation source for as long
   * as it is mounted. `undefined` contributes nothing at all.
   */
  private useConfirmOnCloseSource(confirmOnClose: boolean | undefined): void {
    const source = useStatic((): object => ({}));
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- a dependency must be a plain variable
    const controller = this;

    useEffect(() => {
      if (confirmOnClose === undefined) {
        controller.removeConfirmOnCloseSource(source);
        return;
      }
      controller.setConfirmOnCloseSource(source, confirmOnClose);
      return () => controller.removeConfirmOnCloseSource(source);
    }, [controller, source, confirmOnClose]);
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
      // eslint-disable-next-line react-hooks/exhaustive-deps -- the caller passes the callback's dependencies
    }, [isOpen, ...dependencies]);
  }

  public static useNew(
    options: OverlayControllerOptions = {},
  ): OverlayController {
    const controller = useStatic(() => new OverlayController(options));
    controller.useUpdateOptions(options);
    return controller;
  }

  private useOnHandler<T extends AnyOverlayOpenStateHandler>(
    handler: T | undefined,
    addHandlerFn: (handler: T) => DisposerFn,
  ) {
    useEffect(
      () => (handler ? addHandlerFn(handler) : undefined),
      // eslint-disable-next-line react-hooks/exhaustive-deps -- addHandlerFn is an inline arrow, new each render
      [handler, this],
    );
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
}
