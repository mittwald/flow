import { createRemoteElement } from "@remote-dom/core/elements";

export type RemoteSimpleFormElementProps = {
  action?: string | ((payload: FormData) => void);
  onSubmit?: (event: never) => void;
} & Partial<Pick<HTMLFormElement, "enctype" | "method">>;

export const RemoteSimpleFormElement =
  createRemoteElement<RemoteSimpleFormElementProps>({
    events: ["submit"],
    properties: {
      method: {},
      enctype: {},
      action: {},
    },
  });

declare global {
  interface HTMLElementTagNameMap {
    "flr-simple-form": InstanceType<typeof RemoteSimpleFormElement>;
  }
}

customElements.define("flr-simple-form", RemoteSimpleFormElement);
