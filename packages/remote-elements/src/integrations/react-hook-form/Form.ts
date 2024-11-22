import { createRemoteElement } from "@remote-dom/core/elements";

export interface RemoteRhfFormElementProps {
  onSubmit?: (values: unknown) => Promise<void> | void;
}

export const RemoteRhfFormElement =
  createRemoteElement<RemoteRhfFormElementProps>({
    events: ["submit"],
  });

declare global {
  interface HTMLElementTagNameMap {
    "flr.rhf-form": InstanceType<typeof RemoteRhfFormElement>;
  }
}

customElements.define("flr.rhf-form", RemoteRhfFormElement);
