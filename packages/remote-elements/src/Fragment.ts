import type { FragmentProps } from "@mittwald/flow-react-components/Fragment";
export type { FragmentProps } from "@mittwald/flow-react-components/Fragment";
import { createRemoteElement } from "@remote-dom/core/elements";

export const RemoteFragmentElement = createRemoteElement<FragmentProps>({
  properties: {},
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-fragment": InstanceType<typeof RemoteFragmentElement>;
  }
}

customElements.define("flr-fragment", RemoteFragmentElement);
