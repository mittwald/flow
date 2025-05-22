/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ComboBoxProps as RemoteComboBoxElementProps } from "@mittwald/flow-react-components";
export type { ComboBoxProps as RemoteComboBoxElementProps } from "@mittwald/flow-react-components";

export class RemoteComboBoxElement extends FlowRemoteElement<RemoteComboBoxElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      allowsCustomValue: {},
      allowsEmptyCollection: {},
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      autoFocus: {},
      className: {},
      defaultFilter: {},
      defaultInputValue: {},
      defaultItems: {},
      defaultSelectedKey: {},
      disabledKeys: {},
      formValue: {},
      id: {},
      inputValue: {},
      isDisabled: {},
      isInvalid: {},
      isReadOnly: {},
      isRequired: {},
      items: {},
      menuTrigger: {},
      name: {},
      placeholder: {},
      renderEmptyState: {},
      selectedKey: {},
      shouldFocusWrap: {},
      slot: {},
      validate: {},
      validationBehavior: {},
    };
  }

  static override get remoteEvents() {
    return {
      blur: {},
      change: {},
      focus: {},
      focusChange: {},
      inputChange: {},
      keyDown: {},
      keyUp: {},
      openChange: {},
      selectionChange: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-combo-box": InstanceType<typeof RemoteComboBoxElement>;
  }
}

customElements.define("flr-combo-box", RemoteComboBoxElement);
