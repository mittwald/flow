/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { RatingProps as RemoteRatingElementProps } from "@mittwald/flow-react-components";
export type { RatingProps as RemoteRatingElementProps } from "@mittwald/flow-react-components";

export class RemoteRatingElement extends FlowRemoteElement<RemoteRatingElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      size: {},
      value: {},
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
    "flr-rating": InstanceType<typeof RemoteRatingElement>;
  }
}

customElements.define("flr-rating", RemoteRatingElement);
