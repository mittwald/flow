import { createRemoteElement } from "@remote-dom/core/elements";

export type RemoteFormElementProps = {
  action?: string | ((payload: FormData) => void);
  onSubmit?: (event: never) => void;
} & Partial<Pick<HTMLFormElement, "enctype" | "method">>;

export const RemoteFormElement = createRemoteElement<RemoteFormElementProps>({
  events: ["submit"],
  properties: {
    method: {},
    enctype: {},
    action: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-form": InstanceType<typeof RemoteFormElement>;
  }
}

customElements.define("flr-form", RemoteFormElement);
