import { createRemoteElement } from "@remote-dom/core/elements";

export interface RemoteSimpleInputElementProps {
  name?: string;
  value?: string;
  type?: string;
  onChange?: (detail: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export const RemoteSimpleInputElement =
  createRemoteElement<RemoteSimpleInputElementProps>({
    properties: ["type", "value", "name"],
    events: ["change", "blur", "focus"],
  });

declare global {
  interface HTMLElementTagNameMap {
    "flr-simple-input": InstanceType<typeof RemoteSimpleInputElement>;
  }
}

customElements.define("flr-simple-input", RemoteSimpleInputElement);
