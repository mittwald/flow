/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteSearchFieldElement } from "@mittwald/flow-remote-elements";
import type { RemoteSearchFieldElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteSearchFieldElementProps as SearchFieldProps } from "@mittwald/flow-remote-elements";

export const SearchField: FlowRemoteVueComponent<RemoteSearchFieldElementProps> =
  createFlowRemoteComponent(
    "flr-search-field",
    "SearchField",
    RemoteSearchFieldElement,
    {
      booleans: [
        "autoFocus",
        "excludeFromTabOrder",
        "hidden",
        "inert",
        "isDisabled",
        "isInvalid",
        "isReadOnly",
        "isRequired",
      ],
    },
  );
