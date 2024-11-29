import * as r from "remeda";
import { isBoolean, isNumber, isObjectType, isString } from "remeda";
import type { EventSerialization } from "@/events/index";

const isPrimitive = (something: unknown) =>
  isString(something) || isNumber(something) || isBoolean(something);

export const primitiveFlat: EventSerialization = (event) =>
  isObjectType(event) ? r.pickBy(event as never, isPrimitive) : event;

export const pick =
  (...props: string[]): EventSerialization =>
  (event) =>
    r.pick(event as never, props);

export const standard = primitiveFlat;
