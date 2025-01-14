import { standard } from "~/events/serializers";

export type EventHandler = (event: unknown) => void;

export const mapEventHandler =
  (
    eventHandler: EventHandler,
    eventName: string,
    eventSerialization: EventSerializationMap = {},
  ) =>
  (event: unknown) => {
    const serialize = eventSerialization[eventName] ?? standard;
    return eventHandler(serialize(event));
  };

export type EventSerialization = (event: unknown) => unknown;
export type EventSerializationMap = Record<string, EventSerialization>;
