interface SerializationStrategy<TIn, TOut> {
  isApplicable: (val: unknown) => val is TIn;
  apply: (val: TIn) => TOut | Promise<TOut>;
}

const Key = "mittwald.flow-remote-core.serializer.name";

export interface SuccessfulSerializationResult<T> {
  value: T;
  [Key]: string;
}

export type SerializationResult<T> =
  | { applied: true; result: SuccessfulSerializationResult<T> }
  | { applied: false };

export class Serializer<TIn, TOut> {
  public constructor(
    private options: {
      name: string;
      serialize: SerializationStrategy<TIn, TOut>;
      deserialize: Pick<SerializationStrategy<TOut, TIn>, "apply">;
    },
  ) {}

  private async apply<TIn, TOut>(
    val: unknown,
    strategy: SerializationStrategy<TIn, TOut>,
  ): Promise<SerializationResult<TOut>> {
    if (!strategy.isApplicable(val)) {
      return { applied: false };
    }

    const resolved = await strategy.apply(val);

    return {
      applied: true,
      result: {
        [Key]: this.options.name,
        value: resolved,
      },
    };
  }

  public async serialize(val: unknown): Promise<SerializationResult<TOut>> {
    return this.apply<TIn, TOut>(val, this.options.serialize);
  }

  public async deserialize(val: unknown): Promise<SerializationResult<TIn>> {
    return this.apply(val, {
      isApplicable: (
        candidate,
      ): candidate is SuccessfulSerializationResult<TOut> =>
        !!candidate &&
        typeof candidate === "object" &&
        Key in candidate &&
        (candidate as never)[Key] === this.options.name,
      apply: (serialization) =>
        this.options.deserialize.apply(serialization.value),
    });
  }
}
