import { createRemoteElement } from "@remote-dom/core/elements";
import type { OptionProps } from "@mittwald/flow-react-components/Select";
export type { OptionProps } from "@mittwald/flow-react-components/Select";

export const RemoteOptionElement = createRemoteElement<OptionProps>({
  properties: ["textValue", "value"],
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-option": InstanceType<typeof RemoteOptionElement>;
  }
}

customElements.define("flr-option", RemoteOptionElement);
