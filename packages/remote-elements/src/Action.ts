import { createRemoteElement } from "@remote-dom/core/elements";
import type { PickRemoteElementEventListeners } from "@/lib/types";
import type { ActionProps } from "@mittwald/flow-react-components/Action";
export type { ActionProps } from "@mittwald/flow-react-components/Action";

export const RemoteActionElement = createRemoteElement<
  ActionProps,
  object,
  object,
  PickRemoteElementEventListeners<ActionProps>
>({
  events: ["action"],
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-action": InstanceType<typeof RemoteActionElement>;
  }
}

customElements.define("flr-action", RemoteActionElement);
