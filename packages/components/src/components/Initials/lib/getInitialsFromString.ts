export const getInitialsFromString = (initials: string): string[] => {
  return initials
    .split(" ")
    .map((part) =>
      part
        ?.trim()
        .split("")
        .find((char) => /\p{L}/gu.test(char)),
    )
    .filter((char) => char !== undefined)
    .map((char) => char!.toUpperCase())
    .slice(0, 2);
};
