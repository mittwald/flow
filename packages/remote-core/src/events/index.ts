import { standard } from "@/events/serializers";
import resolveNestedPromises from "@/utils/promise";
import { eventValueTransformer } from "@/utils/eventValueTransformer";

export type EventHandler = (event: unknown) => void;
export type EventSerialization = (event: unknown) => unknown;
export type EventSerializationMap = Record<string, EventSerialization>;

export const mapEventHandler =
  (
    eventHandler: EventHandler,
    eventName: string,
    eventSerialization: EventSerializationMap = {},
  ) =>
  (event: unknown) => {
    const serialize = eventSerialization[eventName] ?? standard;
    const data = eventValueTransformer(serialize(event));

    resolveNestedPromises(data).then(eventHandler);
    return null;
  };
