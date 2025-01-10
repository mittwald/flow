/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { OptionProps as RemoteOptionElementProps } from "@mittwald/flow-react-components/Select";
export type { OptionProps as RemoteOptionElementProps } from "@mittwald/flow-react-components/Select";

export class RemoteOptionElement extends FlowRemoteElement<RemoteOptionElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      "aria-label": {},
      download: {},
      href: {},
      hrefLang: {},
      isDisabled: {},
      ping: {},
      referrerPolicy: {},
      rel: {},
      routerOptions: {},
      target: {},
      textValue: {},
      value: {},
    };
  }

  static get remoteEvents() {
    return {
      action: {},
      hoverChange: {},
      hoverEnd: {},
      hoverStart: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-option": InstanceType<typeof RemoteOptionElement>;
  }
}

customElements.define("flr-option", RemoteOptionElement);
