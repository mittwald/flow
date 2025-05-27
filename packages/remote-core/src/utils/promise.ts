import * as R from "remeda";

type AwaitedObject<T> =
  T extends Promise<infer U>
    ? AwaitedObject<U>
    : T extends (infer V)[]
      ? AwaitedObject<V>[]
      : T extends object
        ? { [K in keyof T]: AwaitedObject<T[K]> }
        : T;

async function resolveNestedPromises<T>(input: T): Promise<AwaitedObject<T>> {
  if (input instanceof Promise) {
    return (await resolveNestedPromises(await input)) as Promise<
      AwaitedObject<T>
    >;
  }

  if (R.isArray(input)) {
    return (await Promise.all(
      input.map((item) => resolveNestedPromises(item)),
    )) as AwaitedObject<T>;
  }

  if (input && typeof input === "object") {
    const entries = Object.entries(input);
    const resolvedEntries = await Promise.all(
      entries.map(async ([key, value]) => [
        key,
        await resolveNestedPromises(value),
      ]),
    );

    return Promise.resolve(
      Object.fromEntries(resolvedEntries) as AwaitedObject<T>,
    );
  }

  return Promise.resolve(input as AwaitedObject<T>);
}

export default resolveNestedPromises;
