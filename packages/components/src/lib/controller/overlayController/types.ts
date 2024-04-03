import { Signal } from "@preact/signals-react";

export interface OverlayController {
  useIsOpen: () => boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setIsOpen: (isOpen: boolean) => void;
  signals: {
    isOpen: Signal<boolean>;
  };
}
