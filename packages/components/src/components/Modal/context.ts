import { type ModalController } from "@/components/Modal/controller/types";
import { createContext } from "react";

interface Context {
  controller: ModalController | undefined;
}

export const modalContext = createContext<Context>({
  controller: undefined,
} as Context);
