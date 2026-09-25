/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteTextElement } from "@mittwald/flow-remote-elements";
import type { RemoteTextElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteTextElementProps as TextProps } from "@mittwald/flow-remote-elements";

export const Text: FlowRemoteVueComponent<RemoteTextElementProps> =
  createFlowRemoteComponent("flr-text", "Text", RemoteTextElement, {
    booleans: [
      "autoFocus",
      "defaultChecked",
      "emulateBoldWidth",
      "hidden",
      "inert",
      "itemScope",
      "noLigatures",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
    ],
  });
