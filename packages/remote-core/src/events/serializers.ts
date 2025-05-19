import type { EventSerialization } from "@/events/index";
import * as R from "remeda";

const isPrimitive = (something: unknown) =>
  R.isString(something) || R.isNumber(something) || R.isBoolean(something);

const isFile = (something: unknown) =>
  something instanceof File || something instanceof FileList;

export const primitiveFlat: EventSerialization = (event) => {
  if (R.isArray(event)) {
    return event.map(primitiveFlat);
  } else if (R.isObjectType(event)) {
    if (isFile(event)) {
      return event;
    }

    return R.pickBy(
      event as never,
      (value) => isPrimitive(value) || isFile(value),
    );
  }
  return event;
};

export const pick =
  (...props: string[]): EventSerialization =>
  (event) => {
    return R.pick(event as never, props);
  };

export const standard = primitiveFlat;
