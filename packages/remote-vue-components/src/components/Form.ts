import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteFormElement } from "@mittwald/flow-remote-elements";
import type { RemoteFormElementProps } from "@mittwald/flow-remote-elements";
export type { RemoteFormElementProps as FormProps } from "@mittwald/flow-remote-elements";

/**
 * Hand-written, like its React counterpart: `flr-form` has no Flow component
 * behind it, so the generator never sees it.
 *
 * Unlike React's, this one adds nothing — that version wraps a function
 * `action` in `startTransition`, which is React's own scheduling.
 */
export const Form: FlowRemoteVueComponent<RemoteFormElementProps> =
  createFlowRemoteComponent("flr-form", "Form", RemoteFormElement);

export default Form;
