import { FlowRemoteElement } from "@/lib/FlowRemoteElement";

export interface RemoteRhfFormElementProps {
  id?: string;
  onSubmit?: (event: never) => void;
}

export class RemoteRhfFormElement extends FlowRemoteElement<RemoteRhfFormElementProps> {
  static override get remoteEvents() {
    return {
      submit: {},
    };
  }

  static override get remoteProperties() {
    return {
      id: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-rhf-form": InstanceType<typeof RemoteRhfFormElement>;
  }
}

customElements.define("flr-rhf-form", RemoteRhfFormElement);
