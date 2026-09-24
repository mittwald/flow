/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteAutocompleteElement } from "@mittwald/flow-remote-elements";
import type { RemoteAutocompleteElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteAutocompleteElementProps as AutocompleteProps } from "@mittwald/flow-remote-elements";

export const Autocomplete: FlowRemoteVueComponent<RemoteAutocompleteElementProps> =
  createFlowRemoteComponent(
    "flr-autocomplete",
    "Autocomplete",
    RemoteAutocompleteElement,
    { booleans: ["disableAutoFocusFirst", "disableVirtualFocus"] },
  );
