import { createRemoteElement } from "@remote-dom/core/elements";
import type { PickRemoteElementEventListeners } from "@/lib/types";

export interface RemoteInputElementProps {
  name?: string;
  value?: string;
  type?: string;
  onChange?: (detail: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export const RemoteInputElement = createRemoteElement<
  RemoteInputElementProps,
  object,
  object,
  PickRemoteElementEventListeners<RemoteInputElementProps>
>({
  properties: ["type", "value", "name"],
  events: ["change", "blur", "focus"],
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-input": InstanceType<typeof RemoteInputElement>;
  }
}

customElements.define("flr-input", RemoteInputElement);
