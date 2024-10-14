import { createRemoteElement } from "@remote-dom/core/elements";
import type { EmptyObject } from "type-fest";
import type { PickRemoteElementEventListeners } from "@/lib/types";
import type { IconProps } from "@mittwald/flow-react-components/Icon";

export const RemoteIconElement = createRemoteElement<
  IconProps,
  EmptyObject,
  EmptyObject,
  PickRemoteElementEventListeners<IconProps>
>({
  properties: ["color", "size"],
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-icon": InstanceType<typeof RemoteIconElement>;
  }
}

customElements.define("flr-icon", RemoteIconElement);
