export const getObjectKeysIncludingProtoTypes = (something: object) => {
  const result: string[] = [];

  for (const key in something) {
    result.push(key);
  }

  return result;
};
