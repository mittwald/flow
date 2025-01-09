/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { OptionProps as RemoteOptionElementProps } from "@mittwald/flow-react-components/Select";
export type { OptionProps as RemoteOptionElementProps } from "@mittwald/flow-react-components/Select";

export class RemoteOptionElement extends FlowRemoteElement<RemoteOptionElementProps> {
  static get remoteProperties() {
    return {
      value: {},
      "aria-label": {},
      className: {},
      style: {},
      isDisabled: {},
      rel: {},
      target: {},
      href: {},
      download: {},
      hrefLang: {},
      ping: {},
      referrerPolicy: {},
      routerOptions: {},
      textValue: {},
      wrapWith: {},
    };
  }

  static get remoteEvents() {
    return {
      action: {},
      hoverStart: {},
      hoverEnd: {},
      hoverChange: {},
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
