/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { SettingsProviderProps } from "@mittwald/flow-react-components/SettingsProvider";
export type { SettingsProviderProps } from "@mittwald/flow-react-components/SettingsProvider";

export class RemoteSettingsProviderElement extends FlowRemoteElement<SettingsProviderProps> {
  static get remoteProperties() {
    return {
      children: {},
      type: {},
      storageKey: {},
      id: {},
      store: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-settings-provider": InstanceType<typeof RemoteSettingsProviderElement>;
  }
}

customElements.define("flr-settings-provider", RemoteSettingsProviderElement);
