import humanizeString from "humanize-string";

export const extractTextFromPath = (path: string) =>
  humanizeString(path).replace(/(^|\s)\S/g, (char) => char.toUpperCase());
