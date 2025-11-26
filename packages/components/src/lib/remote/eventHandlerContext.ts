import { createCascade } from "context";

export interface EventHandlerContext {
  remoteEvent?: {
    type: string;
  };
  [key: string]: unknown;
}

export const eventHandlerContext = createCascade<EventHandlerContext>();

export const getRemoteEvent = () => eventHandlerContext.use()?.remoteEvent;
