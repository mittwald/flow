/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ThemeScopeProps as RemoteThemeScopeElementProps } from "@mittwald/flow-react-components";
export type { ThemeScopeProps as RemoteThemeScopeElementProps } from "@mittwald/flow-react-components";

export class RemoteThemeScopeElement extends FlowRemoteElement<RemoteThemeScopeElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      theme: {},
    };
  }

  static override get remoteEvents() {
    return {};
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-theme-scope": InstanceType<typeof RemoteThemeScopeElement>;
  }
}

customElements.define("flr-theme-scope", RemoteThemeScopeElement);
