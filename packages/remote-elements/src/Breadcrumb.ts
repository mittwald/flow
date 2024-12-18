/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { BreadcrumbProps } from "@mittwald/flow-react-components/Breadcrumb";
export type { BreadcrumbProps } from "@mittwald/flow-react-components/Breadcrumb";

export const RemoteBreadcrumbElement = createRemoteElement<BreadcrumbProps>({
  properties: {
    color: {},
    "aria-label": {},
    "aria-labelledby": {},
    "aria-describedby": {},
    "aria-details": {},
    className: {},
    style: {},
    isDisabled: {},
    id: {},
    slot: {},
    items: {},
    dependencies: {},
    children: {},
  },
  events: {
    action: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-breadcrumb": InstanceType<typeof RemoteBreadcrumbElement>;
  }
}

customElements.define("flr-breadcrumb", RemoteBreadcrumbElement);
