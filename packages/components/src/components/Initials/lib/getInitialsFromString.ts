export const getInitialsFromString = (initials: string): string[] => {
  const parts = initials.split(" ");

  return parts
    .map((part) => part?.trim()[0])
    .filter((character) => character !== undefined)
    .map((character) => character.toUpperCase())
    .slice(0, 2);
};
