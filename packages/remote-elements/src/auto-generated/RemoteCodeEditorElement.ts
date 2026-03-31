/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { CodeEditorProps as RemoteCodeEditorElementProps } from "@mittwald/flow-react-components";
export type { CodeEditorProps as RemoteCodeEditorElementProps } from "@mittwald/flow-react-components";

export class RemoteCodeEditorElement extends FlowRemoteElement<RemoteCodeEditorElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      copyable: {},
      defaultValue: {},
      isInvalid: {},
      isReadOnly: {},
      isRequired: {},
      language: {},
      showActiveLineMarker: {},
      showCodeFolding: {},
      showCodeIndentationMakers: {},
      showLineNumbers: {},
      showLinterMarkers: {},
      validationBehavior: {},
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
    "flr-code-editor": InstanceType<typeof RemoteCodeEditorElement>;
  }
}

customElements.define("flr-code-editor", RemoteCodeEditorElement);
