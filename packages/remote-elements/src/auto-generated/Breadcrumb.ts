/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { BreadcrumbProps } from "@mittwald/flow-react-components/Breadcrumb";
export type { BreadcrumbProps } from "@mittwald/flow-react-components/Breadcrumb";

export class RemoteBreadcrumbElement extends FlowRemoteElement<BreadcrumbProps> {
  static get remoteProperties() {
    return {
      color: {},
      isDisabled: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      id: {},
      className: {},
      style: {},
      slot: {},
      items: {},
      dependencies: {},
      children: {},
    };
  }

  static get remoteEvents() {
    return {
      action: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-breadcrumb": InstanceType<typeof RemoteBreadcrumbElement>;
  }
}

customElements.define("flr-breadcrumb", RemoteBreadcrumbElement);
