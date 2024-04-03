import { OverlayController } from "@/lib/controller/overlayController/types";
import { useSignal } from "@preact/signals-react";
import { useContext } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { overlayContext } from "@/lib/controller/overlayController/context";

interface Options {
  reuseControllerFromContext?: boolean;
  defaultOpen?: boolean;
}

export const useOverlayController = (opts: Options = {}): OverlayController => {
  const { reuseControllerFromContext = true, defaultOpen = false } = opts;

  const isOpen = useSignal<boolean>(defaultOpen);
  const context = useContext(overlayContext);

  if (reuseControllerFromContext && context.controller) {
    return context.controller;
  }

  const open = () => {
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
  };

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  const setIsOpen = (toIsOpen: boolean) => {
    isOpen.value = toIsOpen;
  };

  const useIsOpen = () => {
    useSignals();
    return isOpen.value;
  };

  return {
    useIsOpen,
    open,
    close,
    toggle,
    setIsOpen,
    signals: {
      isOpen,
    },
  };
};
