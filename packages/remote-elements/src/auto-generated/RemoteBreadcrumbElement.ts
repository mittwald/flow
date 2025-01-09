/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { BreadcrumbProps as RemoteBreadcrumbElementProps } from "@mittwald/flow-react-components/Breadcrumb";
export type { BreadcrumbProps as RemoteBreadcrumbElementProps } from "@mittwald/flow-react-components/Breadcrumb";

export class RemoteBreadcrumbElement extends FlowRemoteElement<RemoteBreadcrumbElementProps> {
  static get remoteProperties() {
    return {
      color: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      isDisabled: {},
      id: {},
      slot: {},
      items: {},
      dependencies: {},
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
