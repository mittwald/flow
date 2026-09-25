import type { AnyRecord } from "@/lib/types";

/**
 * The marker the host understands as "the value you just reported is still the
 * current one" — see `useControlledRemoteValueProps` in `packages/components`.
 */
const controlledRemoteValueMarker = "___flowControlledRemoteValue___";

const unknownRemoteEventValue = Symbol("unknownRemoteEventValue");

const controlledComponentTags = [
  "flr-markdown-editor",
  "flr-number-field",
  "flr-password-creation-field",
  "flr-search-field",
  "flr-text-field",
  "flr-text-area",
];

/**
 * Keeps a controlled field's caret from jumping.
 *
 * A remote field reports every keystroke to the app, which writes the value
 * back. That round trip is a full frame late, so a plain write would reset the
 * host input to a value the user has already typed past. The marker tells the
 * host "unchanged", so it leaves its own state alone.
 *
 * The React version has to ask `eventHandlerContext` whether the current
 * `onChange` came from a remote event, because a local Flow component in the
 * same tree calls the same handler. Here every listener call comes from the
 * element, so the remote origin is given.
 */
export const controlledRemoteValue = (tag: string) => {
  const isControlled = controlledComponentTags.includes(tag);
  let valueOfRemoteEvent: unknown = unknownRemoteEventValue;

  return {
    mapProperties: (properties: AnyRecord): AnyRecord =>
      isControlled && valueOfRemoteEvent === properties.value
        ? { ...properties, value: controlledRemoteValueMarker }
        : properties,

    /**
     * `FlowRemoteElement` hands a listener the event's `detail`, so a `change`
     * listener is called with the new value itself.
     */
    recordEventPayload: (event: string, payload: unknown) => {
      if (isControlled && event === "change") {
        valueOfRemoteEvent = payload;
      }
    },
  };
};
