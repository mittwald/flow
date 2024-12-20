import { FlowRemoteElement } from "@/lib/FlowRemoteElement";

export type RemoteFormElementProps = {
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
