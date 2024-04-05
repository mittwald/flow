import { OverlayState } from "@/lib/controller/overlay";

export type ActionFn = (...args: unknown[]) => unknown;

export interface FunctionAction {
  type: "function";
  fn: ActionFn;
}

interface ModalAction {
  controller?: OverlayState;
}

export interface ToggleModalAction extends ModalAction {
  type: "toggleModal";
}

export interface OpenModalAction extends ModalAction {
  type: "openModal";
}

export interface CloseModalAction extends ModalAction {
  type: "closeModal";
}

type ModalActions = ToggleModalAction | OpenModalAction | CloseModalAction;

export type ActionType = ModalActions | FunctionAction;
