import {
  ActionFn,
  CloseModalAction,
  FunctionAction,
  OpenModalAction,
  ToggleModalAction,
} from "@/components/Action/types";
import { ModalController } from "@/components/Modal/controller/types";

type ModalActionArg = boolean | ModalController;

function getModalController(arg: ModalActionArg): ModalController | undefined {
  return typeof arg === "boolean" ? undefined : arg;
}

export const actions = {
  fn: (fn: ActionFn): FunctionAction => ({
    type: "function",
    fn,
  }),
  openModal: (arg: ModalActionArg): OpenModalAction => ({
    type: "openModal",
    controller: getModalController(arg),
  }),
  closeModal: (arg: ModalActionArg): CloseModalAction => ({
    type: "closeModal",
    controller: getModalController(arg),
  }),
  toggleModal: (arg: ModalActionArg): ToggleModalAction => ({
    type: "toggleModal",
    controller: getModalController(arg),
  }),
};
