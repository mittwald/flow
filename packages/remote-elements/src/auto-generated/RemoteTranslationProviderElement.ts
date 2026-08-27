/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { TranslationProviderProps } from "@mittwald/flow-react-components";
export type RemoteTranslationProviderElementProps =
  WithSerializableClassName<TranslationProviderProps>;

export class RemoteTranslationProviderElement extends FlowRemoteElement<RemoteTranslationProviderElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      translate: {},
      translations: {},
    };
  }

  static override get remoteEvents() {
    return {};
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-translation-provider": InstanceType<
      typeof RemoteTranslationProviderElement
    >;
  }
}

customElements.define(
  "flr-translation-provider",
  RemoteTranslationProviderElement,
);
