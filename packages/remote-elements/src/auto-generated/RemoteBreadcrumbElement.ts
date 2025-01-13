/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { BreadcrumbProps as RemoteBreadcrumbElementProps } from "@mittwald/flow-react-components/Breadcrumb";
export type { BreadcrumbProps as RemoteBreadcrumbElementProps } from "@mittwald/flow-react-components/Breadcrumb";

export class RemoteBreadcrumbElement extends FlowRemoteElement<RemoteBreadcrumbElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      color: {},
      dependencies: {},
      id: {},
      isDisabled: {},
      items: {},
      slot: {},
    };
  }

  static get remoteEvents() {
    return {
      action: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-breadcrumb": InstanceType<typeof RemoteBreadcrumbElement>;
  }
}

customElements.define("flr-breadcrumb", RemoteBreadcrumbElement);
