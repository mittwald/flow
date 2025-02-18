import type { StringIndexedObject } from "react-docgen-typescript/lib/parser";

export const checkTagListIncludes = (
  tags: StringIndexedObject<string> = {},
  key: string,
  ...search: string[]
) => {
  return (tags[`flr-${key}`] ?? "")
    .split(",")
    .map((v) => v.trim())
    .some((v) => search.includes(v));
};

export const checkTagIsSet = (
  tags: StringIndexedObject<string> = {},
  key: string,
) => {
  return `flr-${key}` in tags;
};

export const checkTagIs = (
  tags: StringIndexedObject<string> = {},
  key: string,
  value: string,
) => {
  return tags[`flr-${key}`] === value;
};
