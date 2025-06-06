import { FlowRemoteElement } from "@/lib/FlowRemoteElement";

export type RemoteFormElementProps = {
  id?: string;
  action?: string | ((payload: FormData) => void | Promise<void>);
  onSubmit?: (event: never) => void;
} & Partial<Pick<HTMLFormElement, "enctype" | "method">>;

export class RemoteFormElement extends FlowRemoteElement<RemoteFormElementProps> {
  static override get remoteEvents() {
    return {
      submit: {},
    };
  }

  static override get remoteProperties() {
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
