interface SerializationStrategy<TIn, TOut> {
  isApplicable: (val: unknown) => val is TIn;
  apply: (val: TIn) => TOut;
}

export const Key = "mittwald.flow-remote-core.serializer.name";

export interface SuccessfulSerializationResult<T> {
  value: T;
  [Key]: string;
}

export type SerializationResult<T> =
  | { applied: true; result: SuccessfulSerializationResult<T> }
  | { applied: false };

export class Serializer<TIn, TTransfer, TOut = TIn> {
  public constructor(
    private options: {
      name: string;
      serialize: SerializationStrategy<TIn, TTransfer>;
      deserialize: Pick<SerializationStrategy<TTransfer, TOut>, "apply">;
    },
  ) {}

  private apply<TIn, TOut>(
    val: unknown,
    strategy: SerializationStrategy<TIn, TOut>,
  ): SerializationResult<TOut> {
    if (strategy.isApplicable(val)) {
      return {
        applied: true,
        result: {
          [Key]: this.options.name,
          value: strategy.apply(val),
        },
      };
    }
    return {
      applied: false,
    };
  }

  public serialize(val: unknown): SerializationResult<TTransfer> {
    return this.apply<TIn, TTransfer>(val, this.options.serialize);
  }

  public deserialize(val: unknown): SerializationResult<TOut> {
    return this.apply(val, {
      apply: (serialization: SuccessfulSerializationResult<TTransfer>) => {
        return this.options.deserialize.apply(serialization.value);
      },
      isApplicable: (val): val is SuccessfulSerializationResult<TTransfer> => {
        return (
          !!val &&
          typeof val === "object" &&
          Key in val &&
          val[Key] === this.options.name
        );
      },
    });
  }
}
