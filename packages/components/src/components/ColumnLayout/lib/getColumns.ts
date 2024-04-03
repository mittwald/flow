export const getColumns = (values: number[]): string => {
  if (values.length < 1) {
    throw new Error("Column layout array is empty");
  }

  const fractionValues = values.map((value) => `${value}fr`);

  return fractionValues.join(" ");
};
