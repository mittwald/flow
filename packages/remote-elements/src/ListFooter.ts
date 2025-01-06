import { FlowRemoteElement } from "@/lib/FlowRemoteElement";

export type { ListFooterProps } from "@mittwald/flow-react-components/ListFooter";

export class RemoteListFooterElement extends FlowRemoteElement {}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-footer": InstanceType<typeof RemoteListFooterElement>;
  }
}

customElements.define("flr-list-footer", RemoteListFooterElement);
