export const getColumns = (values: number[]): string => {
  const fractionValues = values.map((value) => `${value}fr`);

  return fractionValues.join(" ");
};
