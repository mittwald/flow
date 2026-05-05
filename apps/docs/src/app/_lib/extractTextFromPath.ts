import humanizeString from "humanize-string";

export const extractTextFromPath = (path: string) => {
  return humanizeString(path.replaceAll(/^[0-9]+/g, "")).replace(
    /(^|\s)\S/g,
    (char) => char.toUpperCase(),
  );
};
