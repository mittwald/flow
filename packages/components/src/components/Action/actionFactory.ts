import {
  ActionFn,
  CloseModalAction,
  FunctionAction,
  OpenModalAction,
  ToggleModalAction,
} from "@/components/Action/types";
import { OverlayController } from "@/lib/controller/overlayController/types";

type ModalActionArg = boolean | OverlayController;

function getModalController(
  arg: ModalActionArg,
): OverlayController | undefined {
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
