export const getInitialsFromString = (initials: string): string[] => {
  return initials
    .replace(/[^\p{L}\s]/giu, "")
    .split(" ")
    .map((part) => part.trim()[0])
    .filter((p) => p !== undefined)
    .map((char) => char.toUpperCase())
    .slice(0, 2);
};
