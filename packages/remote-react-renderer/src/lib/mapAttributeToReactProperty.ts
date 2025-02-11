import { toCamelCase } from "remeda";

const keepWhenStartsWith = ["aria-", "data-"];

export const mapAttributeToReactProperty = (key: string) => {
  if (keepWhenStartsWith.some((prefix) => key.startsWith(prefix))) {
    return key;
  }

  return toCamelCase(key);
};
