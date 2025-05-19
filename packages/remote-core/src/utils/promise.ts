import * as R from "remeda";

export const isLikelyAPromise = (obj: unknown): obj is Promise<unknown> =>
  !!(
    obj &&
    typeof obj === "object" &&
    "then" in obj &&
    typeof obj.then === "function" &&
    Object.getPrototypeOf(obj).constructor !== Object
  );

export const resolveNestedPromises = async (
  payload: unknown,
): Promise<unknown> => {
  if (
    typeof payload !== "object" ||
    payload === null ||
    payload instanceof Promise ||
    isLikelyAPromise(payload)
  ) {
    return Promise.resolve(payload);
  }

  if (R.isArray(payload)) {
    return Promise.all(payload.map(resolveNestedPromises));
  }

  const promisesAccumulator: Promise<unknown>[] = [];
  const keysAccumulator: string[] = [];

  R.mapValues(payload, (value, key) => {
    const promise = resolveNestedPromises(value);
    promisesAccumulator.push(promise);
    keysAccumulator.push(key);
  });

  return Promise.all(promisesAccumulator).then((results) => {
    return results.reduce(
      (r: Record<string, unknown>, result, i) => ({
        ...r,
        [keysAccumulator[i] as string]: result,
      }),
      {},
    );
  });
};

export default resolveNestedPromises;
