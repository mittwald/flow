export const getColumns = (values: (number | null)[]): string => {
  const fractionValues = values
    .filter((v) => v !== null)
    .map((value) => `${value}fr`);

  return fractionValues.join(" ");
};
