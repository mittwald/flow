import { createRemoteElement } from "@remote-dom/core/elements";
import type { IconProps } from "@mittwald/flow-react-components/Icon";
export type { IconProps } from "@mittwald/flow-react-components/Icon";

export const RemoteIconElement = createRemoteElement<IconProps>({
  properties: ["color", "size"],
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-icon": InstanceType<typeof RemoteIconElement>;
  }
}

customElements.define("flr-icon", RemoteIconElement);
