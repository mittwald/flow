import {
  ThreadSerializationStructuredClone,
  type ThreadSerializationOptions,
  TRANSFERABLE,
} from "@quilted/threads";
import * as serializerModules from "./serializers";
import { isObjectType } from "remeda";
import { Serializer } from "@/serialization/Serializer";

const serializers = Object.values(serializerModules).filter(
  (val) => val instanceof Serializer,
);

export class FlowThreadSerialization extends ThreadSerializationStructuredClone {
  public constructor() {
    const options: ThreadSerializationOptions = {
      serialize: (val, serialize) => {
        try {
          if (this.isSerializableByBase(val)) {
            return;
          }
          if (this.omitSerialization(val)) {
            return null;
          }
          for (const serializer of serializers) {
            const serialization = serializer.serialize(val);
            if (serialization.applied) {
              return serialize(serialization.result);
            }
          }
          if (isObjectType(val)) {
            return serialize({ ...val });
          }
        } catch (error) {
          console.error("Error while serializing", error);
          throw error;
        }
      },
      deserialize: (val, serialize) => {
        try {
          for (const serializer of serializers) {
            const deserialization = serializer.deserialize(val);
            if (deserialization.applied) {
              return deserialization.result.value;
            }
          }
          return serialize(val);
        } catch (error) {
          console.error("Error while deserializing", error);
          throw error;
        }
      },
    };
    super(options);
  }

  private isSerializableByBase(val: unknown) {
    return (
      val instanceof Map ||
      val instanceof Set ||
      Array.isArray(val) ||
      typeof val === "function" ||
      (isObjectType(val) && TRANSFERABLE in val)
    );
  }

  private omitSerialization(val: unknown) {
    return val instanceof HTMLElement || val === window;
  }
}
