/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { AutocompleteProps as RemoteAutocompleteElementProps } from "@mittwald/flow-react-components";
export type { AutocompleteProps as RemoteAutocompleteElementProps } from "@mittwald/flow-react-components";

export class RemoteAutocompleteElement extends FlowRemoteElement<RemoteAutocompleteElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      defaultInputValue: {},
      disableAutoFocusFirst: {},
      filter: {},
      slot: {},
      value: {},
    };
  }

  static override get remoteEvents() {
    return {
      change: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-autocomplete": InstanceType<typeof RemoteAutocompleteElement>;
  }
}

customElements.define("flr-autocomplete", RemoteAutocompleteElement);
