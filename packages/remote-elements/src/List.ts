import { FlowRemoteElement } from "@/lib/FlowRemoteElement";

export type { ListProps } from "@mittwald/flow-react-components/List";

export class RemoteListElement extends FlowRemoteElement {}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list": InstanceType<typeof RemoteListElement>;
  }
}

customElements.define("flr-list", RemoteListElement);
