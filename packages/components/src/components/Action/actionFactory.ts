import type {
  ActionFn,
  CloseModalAction,
  FunctionAction,
  OpenModalAction,
  ToggleModalAction,
} from "@/components/Action/types";
import type { OverlayState } from "@/lib/controller/overlay";

type ModalActionArg = boolean | OverlayState;

function getModalController(arg: ModalActionArg): OverlayState | undefined {
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
