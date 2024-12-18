/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { SettingsProviderProps } from "@mittwald/flow-react-components/SettingsProvider";
export type { SettingsProviderProps } from "@mittwald/flow-react-components/SettingsProvider";

export const RemoteSettingsProviderElement =
  createRemoteElement<SettingsProviderProps>({
    properties: {
      children: {},
      type: {},
      storageKey: {},
      id: {},
      store: {},
    },
    events: {},
  });

declare global {
  interface HTMLElementTagNameMap {
    "flr-settings-provider": InstanceType<typeof RemoteSettingsProviderElement>;
  }
}

customElements.define("flr-settings-provider", RemoteSettingsProviderElement);
