import { createRemoteElement } from "@remote-dom/core/elements";
import type { SelectProps } from "@mittwald/flow-react-components/Select";
export type { SelectProps } from "@mittwald/flow-react-components/Select";

export const RemoteSelectElement = createRemoteElement<SelectProps>({
  properties: ["aria-label", "name"],
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-select": InstanceType<typeof RemoteSelectElement>;
  }
}

customElements.define("flr-select", RemoteSelectElement);
