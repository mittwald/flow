import { FlowRemoteElement } from "@mittwald/flow-remote-core";

export type RemoteFormElementProps = {
  id?: string;
  action?: string | ((payload: FormData) => void);
  onSubmit?: (event: never) => void;
} & Partial<Pick<HTMLFormElement, "enctype" | "method">>;

export class RemoteFormElement extends FlowRemoteElement<RemoteFormElementProps> {
  static get remoteEvents() {
    return {
      submit: {},
    };
  }

  static get remoteProperties() {
    return {
      id: {},
      method: {},
      enctype: {},
      action: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-form": InstanceType<typeof RemoteFormElement>;
  }
}

customElements.define("flr-form", RemoteFormElement);
