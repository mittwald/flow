import * as R from "remeda";

export function deepMapValues(
  input: unknown,
  fn: (value: unknown) => unknown = (v) => v,
): unknown {
  input = fn(input);

  if (R.isPromise(input)) {
    return input;
  }

  if (R.isArray(input)) {
    return R.map((item) => deepMapValues(item, fn));
  }

  if (R.isObjectType(input)) {
    return R.mapValues(input, (value) => {
      return deepMapValues(value, fn);
    });
  }

  return input;
}
