import {
  type AnyThread,
  TRANSFERABLE,
  ThreadSerializationStructuredClone,
} from "@quilted/threads";
import * as serializerModules from "./serializers";
import { Key, Serializer } from "@/serialization/Serializer";
import { isArray, isObjectType } from "remeda";

const serializers = Object.values(serializerModules).filter(
  (val) => val instanceof Serializer,
);

const FUNCTION = "_@f";
const ASYNC_ITERATOR = "_@i";

function isBasicObject(value: unknown) {
  if (value == null || typeof value !== "object") return false;

  const prototype = Object.getPrototypeOf(value);
  return prototype == null || prototype === Object.prototype;
}

export class FlowThreadSerialization extends ThreadSerializationStructuredClone {
  constructor() {
    super({
      serialize: (
        valueToSerialize: unknown,
        defaultSerialize: CallableFunction,
      ) => {
        try {
          if (this.#omitSerialization(valueToSerialize)) {
            return null;
          }

          for (const serializer of serializers) {
            const serialization = serializer.serialize(valueToSerialize);
            if (serialization.applied) {
              return {
                [Key]: serialization.result[Key],
                value: defaultSerialize(serialization.result.value),
              };
            }
          }

          if (isObjectType(valueToSerialize)) {
            if ((valueToSerialize as never)[TRANSFERABLE]) {
              return defaultSerialize(valueToSerialize);
            }

            if (isArray(valueToSerialize)) {
              return defaultSerialize([...valueToSerialize]);
            }

            return defaultSerialize({ ...valueToSerialize });
          }

          return defaultSerialize(valueToSerialize);
        } catch (error) {
          console.error("Error while serializing", error);
          throw error;
        }
      },
    });
  }

  /** Deserializes a structured cloning-compatible value from another thread. */
  override deserialize(value: unknown, thread: AnyThread) {
    return this.#deserializeInternal(value, thread);
  }

  #omitSerialization(val: unknown) {
    return val instanceof HTMLElement || val === window;
  }

  #deserializeStructure(value: unknown, thread: AnyThread) {
    try {
      for (const serializer of serializers) {
        const deSerialization = serializer.deserialize(value);
        if (deSerialization.applied) {
          return this.#deserializeInternal(
            deSerialization.result.value,
            thread,
          );
        }
      }

      return value;
    } catch (error) {
      console.error("Error while deserializing", error);
      throw error;
    }
  }

  #deserializeInternal(value: unknown, thread: AnyThread): unknown {
    if (value == null) return value;

    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return value.map((value) => this.#deserializeInternal(value, thread));
      }

      if (value instanceof Map) {
        return new Map(
          [...value].map(([key, value]) => [
            this.#deserializeInternal(key, thread),
            this.#deserializeInternal(value, thread),
          ]),
        );
      }

      if (value instanceof Set) {
        return new Set(
          [...value].map((entry) => this.#deserializeInternal(entry, thread)),
        );
      }

      if (FUNCTION in value) {
        return thread.functions.deserialize(
          (value as { [FUNCTION]: never })[FUNCTION],
          thread,
        );
      }

      if (!isBasicObject(value)) {
        return this.#deserializeStructure(value, thread);
      }

      const result: Record<string | symbol, unknown> = {};

      for (const key of Object.keys(value)) {
        if (key === ASYNC_ITERATOR) {
          result[Symbol.asyncIterator] = () => result;
        } else {
          result[key] = this.#deserializeInternal(
            (value as never)[key],
            thread,
          );
        }
      }

      return this.#deserializeStructure(result, thread);
    }

    return this.#deserializeStructure(value, thread);
  }
}
