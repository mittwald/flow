/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { SelectProps } from "@mittwald/flow-react-components/Select";
export type { SelectProps } from "@mittwald/flow-react-components/Select";

export const RemoteSelectElement = createRemoteElement<SelectProps>({
  properties: {
    controller: {},
    isOpen: {},
    defaultOpen: {},
    "aria-label": {},
    "aria-labelledby": {},
    "aria-describedby": {},
    "aria-details": {},
    style: {},
    placeholder: {},
    validationBehavior: {},
    isDisabled: {},
    isRequired: {},
    isInvalid: {},
    validate: {},
    autoFocus: {},
    excludeFromTabOrder: {},
    id: {},
    autoComplete: {},
    name: {},
    slot: {},
    disabledKeys: {},
    selectedKey: {},
    defaultSelectedKey: {},
    children: {},
    wrapWith: {},
    className: {},
    ref: {},
    key: {},
  },
  events: {
    change: {},
    openChange: {},
    focus: {},
    blur: {},
    focusChange: {},
    keyDown: {},
    keyUp: {},
    selectionChange: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-select": InstanceType<typeof RemoteSelectElement>;
  }
}

customElements.define("flr-select", RemoteSelectElement);
