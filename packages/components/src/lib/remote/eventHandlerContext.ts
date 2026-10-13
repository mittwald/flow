import { createCascade, type CtxCascadeApi } from "context";

export interface EventHandlerContext {
  remoteEvent?: {
    type: string;
  };
  [key: string]: unknown;
}

/*
 * `@mittwald/flow-remote-elements` looks the instance up under this key instead
 * of importing it (`FlowRemoteElement.ts`). A cascade only works as one instance.
 */
const eventHandlerContextKey = Symbol.for(
  "@mittwald/flow-remote-elements/eventHandlerContext",
);

type EventHandlerContextRegistry = Partial<
  Record<typeof eventHandlerContextKey, CtxCascadeApi<EventHandlerContext>>
>;

const registry = globalThis as EventHandlerContextRegistry;

export const eventHandlerContext: CtxCascadeApi<EventHandlerContext> =
  (registry[eventHandlerContextKey] ??= createCascade<EventHandlerContext>());

export const getRemoteEvent = () => eventHandlerContext.use()?.remoteEvent;
