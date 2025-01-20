/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { OptionProps as RemoteOptionElementProps } from "@mittwald/flow-react-components/Select";
export type { OptionProps as RemoteOptionElementProps } from "@mittwald/flow-react-components/Select";

export class RemoteOptionElement extends FlowRemoteElement<RemoteOptionElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      "aria-label": {},
      className: {},
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

  static override get remoteEvents() {
    return {
      action: {},
      hoverChange: {},
      hoverEnd: {},
      hoverStart: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-option": InstanceType<typeof RemoteOptionElement>;
  }
}

customElements.define("flr-option", RemoteOptionElement);
