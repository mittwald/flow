/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { BreadcrumbProps as RemoteBreadcrumbElementProps } from "@mittwald/flow-react-components/Breadcrumb";
export type { BreadcrumbProps as RemoteBreadcrumbElementProps } from "@mittwald/flow-react-components/Breadcrumb";

export class RemoteBreadcrumbElement extends FlowRemoteElement<RemoteBreadcrumbElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      className: {},
      color: {},
      dependencies: {},
      id: {},
      isDisabled: {},
      items: {},
      slot: {},
    };
  }

  static override get remoteEvents() {
    return {
      action: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-breadcrumb": InstanceType<typeof RemoteBreadcrumbElement>;
  }
}

customElements.define("flr-breadcrumb", RemoteBreadcrumbElement);
