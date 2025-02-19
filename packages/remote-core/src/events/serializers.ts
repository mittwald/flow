import type { EventSerialization } from "@/events/index";
import * as r from "remeda";
import { isBoolean, isNumber, isObjectType, isString } from "remeda";

const isPrimitive = (something: unknown) =>
  isString(something) ||
  isNumber(something) ||
  isBoolean(something) ||
  (r.isArray(something) && something.every(isPrimitive));

export const primitiveFlat: EventSerialization = (event) =>
  r.isArray(event)
    ? event.map(primitiveFlat)
    : isObjectType(event)
      ? r.pickBy(event as never, isPrimitive)
      : event;

export const pick =
  (...props: string[]): EventSerialization =>
  (event) => {
    return r.pick(event as never, props);
  };

export const standard = primitiveFlat;
