import {
  ThreadSerializationStructuredClone,
  type ThreadSerializationOptions,
} from "@quilted/threads";
import * as serializerModules from "./serializers";
import { isArray, isObjectType } from "remeda";

const serializers = Object.values(serializerModules);

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
            const serialization = serializer.serialize(val as never);
            if (serialization.applied) {
              return serialization.result;
            }
          }
          if (isObjectType(val)) {
            return serialize({ ...val });
          }
          if (isArray(val)) {
            return serialize([...val]);
          }
        } catch (error) {
          console.error("Error while serializing", error);
          throw error;
        }
      },
      deserialize: (val, serialize) => {
        try {
          for (const serializer of serializers) {
            const deserialization = serializer.deserialize(val as never);
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
      typeof val === "function"
    );
  }

  private omitSerialization(val: unknown) {
    return val instanceof HTMLElement || val === window;
  }
}
