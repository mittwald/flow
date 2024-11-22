import { createRemoteElement } from "@remote-dom/core/elements";
import type { SectionProps } from "@mittwald/flow-react-components/Section";
export type { SectionProps } from "@mittwald/flow-react-components/Section";

export const RemoteSectionElement = createRemoteElement<SectionProps>({
  properties: [],
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-section": InstanceType<typeof RemoteSectionElement>;
  }
}

customElements.define("flr-section", RemoteSectionElement);
