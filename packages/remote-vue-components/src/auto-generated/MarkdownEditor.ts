/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteMarkdownEditorElement } from "@mittwald/flow-remote-elements";
import type { RemoteMarkdownEditorElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteMarkdownEditorElementProps as MarkdownEditorProps } from "@mittwald/flow-remote-elements";

export const MarkdownEditor: FlowRemoteVueComponent<RemoteMarkdownEditorElementProps> =
  createFlowRemoteComponent(
    "flr-markdown-editor",
    "MarkdownEditor",
    RemoteMarkdownEditorElement,
    {
      booleans: [
        "allowHorizontalResize",
        "allowVerticalResize",
        "autoFocus",
        "excludeFromTabOrder",
        "hidden",
        "inert",
        "isDisabled",
        "isInvalid",
        "isReadOnly",
        "isRequired",
        "showCharacterCount",
      ],
    },
  );
