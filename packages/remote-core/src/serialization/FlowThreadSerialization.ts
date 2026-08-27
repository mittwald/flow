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

/*
 * React tags its elements, portals and lazy values with a symbol under
 * `$$typeof`. Symbols pass through serialization untouched and `postMessage`
 * refuses them — and it refuses the *whole* message, so a single element in one
 * prop takes down the entire mutation batch and the extension renders nothing at
 * all. The failure is silent apart from an unhandled `DataCloneError`.
 *
 * Rendered output belongs in a slot, not in a property (see `isSlot` in the
 * remote-components generator). Where it ends up in a property anyway, dropping
 * it keeps the batch intact: the one prop is missing instead of the whole tree.
 */
const isReactValue = (val: unknown): boolean =>
  isObjectType(val) &&
  "$$typeof" in val &&
  typeof (val as { $$typeof: unknown }).$$typeof === "symbol";

/**
 * Names the component behind an element, for the warning below. `type` is a
 * string for a DOM element, a function for a component, and an object for a
 * context provider or a `memo`/`forwardRef` wrapper — the last of which is what
 * a rendered react-aria tree is mostly made of.
 */
const reactValueLabel = (val: unknown): string => {
  const type = (val as { type?: unknown }).type;

  if (typeof type === "string") {
    return type;
  }
  if (typeof type === "function" || isObjectType(type)) {
    const named = type as {
      displayName?: string;
      name?: string;
      $$typeof?: symbol;
    };
    return (
      named.displayName ??
      named.name ??
      named.$$typeof?.toString() ??
      "anonymous"
    );
  }

  return "unknown";
};

export class FlowThreadSerialization extends ThreadSerializationStructuredClone {
  private readonly warnedAboutReactValues = new Set<string>();

  public constructor() {
    const options: ThreadSerializationOptions = {
      serialize: async (val, serialize) => {
        try {
          if (this.isSerializableByBase(val)) {
            return;
          }
          if (this.omitSerialization(val)) {
            return null;
          }
          if (isReactValue(val)) {
            this.warnAboutReactValue(val);
            return null;
          }
          for (const serializer of serializers) {
            const serialization = await serializer.serialize(val);

            if (serialization.applied) {
              return await serialize(serialization.result);
            }
          }

          if (isObjectType(val)) {
            return await serialize({ ...val });
          }

          return undefined;
        } catch (error) {
          console.error("Error while serializing", error);
          throw error;
        }
      },

      deserialize: async (val, deserialize) => {
        try {
          for (const serializer of serializers) {
            const deserialization = await serializer.deserialize(val);

            if (deserialization.applied) {
              return deserialization.result.value;
            }
          }

          return await deserialize(val);
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

  /**
   * Once per component, so a table of many rows reports its cause once instead
   * of once per cell.
   */
  private warnAboutReactValue(val: unknown) {
    const label = reactValueLabel(val);

    if (this.warnedAboutReactValues.has(label)) {
      return;
    }
    this.warnedAboutReactValues.add(label);

    console.error(
      `Cannot send the React element <${label} /> to the host: rendered output is not serializable, and it was replaced with null. Pass it as a slot instead of a property — a property would have dropped the whole update.`,
    );
  }
}
