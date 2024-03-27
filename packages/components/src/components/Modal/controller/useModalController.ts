import { ModalController } from "@/components/Modal/controller/types";
import { useSignal } from "@preact/signals-react";
import { useContext } from "react";
import { modalContext } from "@/components/Modal/context";
import { useSignals } from "@preact/signals-react/runtime";

interface Options {
  reuseControllerFromContext?: boolean;
  defaultOpen?: boolean;
}

export const useModalController = (opts: Options = {}): ModalController => {
  const { reuseControllerFromContext = true, defaultOpen = false } = opts;

  const isOpen = useSignal<boolean>(defaultOpen);

  const context = useContext(modalContext);
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
  };
};
